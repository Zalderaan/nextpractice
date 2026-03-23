'use server'

import { loginSchema, registerFormSchema, type RegisterState } from "@/app/(auth)/auth.types"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

export async function login(input: z.input<typeof loginSchema>) {
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

    if (error) return { error: error.message }
    if (data?.user) redirect("/dashboard")

    return { error: "Login failed unexpectedly" }
}

export async function register(
    _prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const raw = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirm_password: String(formData.get("confirm_password") ?? ""),
    }

    const parsed = registerFormSchema.safeParse(raw)

    if (!parsed.success) {
        return {
            error: parsed.error.issues[0]?.message ?? "Invalid registration payload",
            success: false,
        }
    }

    const { email, password } = parsed.data
    const supabase = await createClient(cookies())

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message, success: false }
    }

    if (data?.user) {
        redirect("/login")
    }

    return { error: "Sign up failed unexpectedly", success: false }
}
