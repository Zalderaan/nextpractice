'use client'

import { cn } from "@/lib/utils"
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
import Link from "next/link"
import { useAuthStore } from "@/app/(auth)/auth.stores"

const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// response shapes (base this from the backend response shapes)
const loginSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    user: z.unknown(), // intentionally loose
  }),
});

const apiValidationIssueSchema = z.object({
  field: z.string().optional(),
  message: z.string().optional(),
});

const apiErrorSchema = z.object({
  success: z.literal(false).optional(),
  error: z.string().optional(),
  details: z.array(apiValidationIssueSchema).optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>
type LoginSuccessResponse = z.infer<typeof loginSuccessSchema>;
type ApiErrorResponse = z.infer<typeof apiErrorSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      const raw: unknown = await res.json()

      if (!res.ok) {
        const parsedError = apiErrorSchema.safeParse(raw);
        const err: ApiErrorResponse | null = parsedError.success ? parsedError.data : null;

        if (Array.isArray(err?.details)) {
          for (const issue of err.details) {
            const field = issue?.field
            const message = issue?.message || "Invalid value"

            if (field === "email" || field === "password") {
              form.setError(field, { type: "server", message })
            } else {
              form.setError("root.server", { type: "server", message })
            }
          }
        } else {
          form.setError("root.server", {
            type: "server",
            message: err?.error || "Login failed",
          })
        }
        return;
      }

      const parsedSuccess = loginSuccessSchema.safeParse(raw);
      if (!parsedSuccess.success) {
        form.setError("root.server", {
          type: "server",
          message: "Unexpected server response",
        });
        return;
      }

      const result: LoginSuccessResponse = parsedSuccess.data; // get access token
      setAuth({ user: result.data.user,})

      toast.success("Login successful!")
      router.push("/dashboard")

    } catch {
      form.setError("root.server", {
        type: "server",
        message: "Network error. Please try again.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldError
                className="flex w-full items-center justify-center py-2 rounded-lg text-center bg-red-200"
                errors={[form.formState.errors.root?.server]}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="m@example.com"
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

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex flex-row space-x-2">
                      <Spinner />
                      <span>Logging in...</span>
                    </div>
                  ) : "Login"}
                </Button>

                {/* NOT YET WORKING */}
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
