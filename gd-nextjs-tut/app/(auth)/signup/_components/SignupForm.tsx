'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState } from "react"
import { register } from "@/app/(auth)/auth.actions"
import { initialRegisterState } from "@/app/(auth)/auth.types"

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [state, formAction, isPending] = useActionState(register, initialRegisterState)

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {state.error && (
          <div className="bg-red-200 text-red-800 text-xs p-4 rounded-md">
            {state.error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            className="bg-background"
            autoComplete="email"
            required
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email with anyone else.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            className="bg-background"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <FieldDescription>Must be at least 8 characters long.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm_password">Confirm Password</FieldLabel>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            className="bg-background"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Sign up with GitHub
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}