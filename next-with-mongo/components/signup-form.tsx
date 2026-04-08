'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

const signupFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

type SignupFormValues = z.infer<typeof signupFormSchema>

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: ""
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: SignupFormValues) {
    try {
      // strip down to only necessary values (match according to backend shape)
      // TODO: share schemas with backend so it's more type-safe
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
      }

      // call backend
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      // console.log("signup result: ", result);
      toast.success("Sign up successful!")
      router.push('/login');
      // console.log("Submitted the following values: ", data);

    } catch (error) {
      const message = error instanceof Error ? error.message : `Something went wrong: ${error}`
      toast.error(message);
    }


  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="john_doe"
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email Adress</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="john.doe@example.com"
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm_password">Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    id="confirm_password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex space-x-2">
                      <Spinner />
                      <span>"Creating account..."</span>
                    </div>
                  ) : "Create Account"}
                </Button>

                {/* NOT WORKING YET  */}
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
