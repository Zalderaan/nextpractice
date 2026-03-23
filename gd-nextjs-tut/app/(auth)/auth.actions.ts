'use server'

import { loginSchema, registerPayloadSchema } from "@/app/(auth)/auth.types"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { z } from 'zod';

export async function login(input: unknown) {
    const parsed = loginSchema.safeParse(input)

    if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]
        return { error: firstIssue?.message ?? "Invalid login payload" }
    }

    const { email, password } = parsed.data
    const supabase = await createClient(cookies())

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (data?.user) {
        redirect("/dashboard")
    }

    return { error: "Login failed unexpectedly" }
}

export async function register(input: unknown) {
    const parsed = registerPayloadSchema.safeParse(input)

    if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]
        return { error: firstIssue?.message ?? "Invalid registration payload" }
    }

    const { email, password } = parsed.data
    const supabase = await createClient(cookies())

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    // Keep logs minimal in production
    console.log("Supabase signUp result:", {
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error?.message ?? null,
    })

    if (error) {
        return { error: error.message }
    }

    // For email-confirm flow, user may exist while session is null.
    if (data?.user) {
        redirect("/login")
    }

    return { error: "Sign up failed unexpectedly" }
}
