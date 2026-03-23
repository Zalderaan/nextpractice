import { z } from 'zod';

// login
export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
})

/* === REGISTER === */

// schema for client-side register form validation
export const registerFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
})

// schema for server-side register request validation
export const registerPayloadSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

// schema for register's response
export type RegisterState = {
    error: string | null;
    success: boolean
}

// use in server action
export const initialRegisterState: RegisterState = {
    error: null,
    success: false
}