'use server'

import { loginSchema, registerPayloadSchema } from "@/app/(auth)/auth.types"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { z } from 'zod';



export async function login({ email, password }: z.infer<typeof loginSchema>) {
    // const email = formData.get('email') as string;
    // const password = formData.get('password') as string;

    // const cookieStore = await cookies();
    const supabase = await createClient(cookies());

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // call supabase operation
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    console.log('Supabase signIn result:', { data, error });  // Add this for debugging


    if (error) {
        return { error: error.message }
    }

    if (data) {  // Optional: Confirm data exists (user/session details)
        redirect('/dashboard')
    } else {
        return { error: 'Login failed unexpectedly' }
    }
}

export async function register({ email, password }: z.infer<typeof registerPayloadSchema>) {
    const supabase = await createClient(cookies());

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // call to supabase
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return { error: error.message }
    }

    if (data) {
        redirect('/login')
    } else {
        return { error: 'Registration failed unexpectedly' }
    }
}