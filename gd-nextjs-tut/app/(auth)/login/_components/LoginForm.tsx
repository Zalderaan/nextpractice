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
import { useForm } from "@tanstack/react-form"
import { loginSchema } from '@/app/(auth)/auth.types'
import { toast } from "sonner"
import { login } from "@/app/(auth)/login/actions"
import { useState } from "react"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {

    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: loginSchema
        },
        onSubmit: async ({ value }) => {
            console.log('onSubmit called with values:', value);
            console.log('Form isSubmitting:', form.state.isSubmitting);
            console.log('Form isValid:', form.state.isValid);
            try {
                const result = await login(value)
                if (result?.error) {
                    setSubmitError(result.error);
                    toast.error(result.error)  // Display error via toast
                    console.error("Error during login: ", result.error);
                } else {
                    toast.success(`Submitted the following values: ${JSON.stringify(value)}`)
                }
            } catch (error) {
                const errorMessage = "An unexpected error occurred."
                setSubmitError(errorMessage)
                console.error(`An unexpected error occurred: ${error}`)
                toast.error(errorMessage)
            }
        }
    })

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {
                        submitError && (
                            <div className="bg-red-200 text-red-800 text-xs p-4 rounded-md">
                                {submitError}
                            </div>
                        )
                    }

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup className="">
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="john.doe@example.com"
                                                autoComplete="off"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            />

                            <form.Field
                                name="password"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Type your password here..."
                                                autoComplete="off"
                                                type="password"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            />
                            <Field>
                                <Button type="submit" disabled={form.state.isSubmitting}>{form.state.isSubmitting ? "Logging in..." : "Login"}</Button>
                                <Button variant="outline" type="button">
                                    Login with Google
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="#">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
