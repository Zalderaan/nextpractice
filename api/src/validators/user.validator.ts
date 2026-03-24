import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z
        .email("Invalid email address")
        .min(1, "Email is required")
        .toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z
        .enum(['user', 'admin'])
        .optional()
        .default('user')
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});
export type LoginInput = z.infer<typeof loginSchema>;