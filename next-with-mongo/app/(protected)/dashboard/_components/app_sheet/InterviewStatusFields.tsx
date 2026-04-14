import { Control, Controller } from "react-hook-form";
import { ApplicationFormValues } from "../../types/application-form.schema";
import { Application } from "../../types/application.types";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface InterviewStatusFieldsProps {
    selectedApp: Application;
    isEditing: boolean;
    control: Control<ApplicationFormValues>
}

export function InterviewStatusFields({ selectedApp, isEditing, control }: InterviewStatusFieldsProps) {
    return (
        <>
            <FieldGroup>
                <div className="space-y-1">
                    <span className="text-muted-foreground block">Last Interview</span>
                    {isEditing ? (
                        <Controller
                            name="lastInterviewAt"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        id="lastInterviewAt"
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                        value={
                                            field.value instanceof Date && !isNaN(field.value.getTime())
                                                ? field.value.toISOString().split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? new Date(e.target.value) : null)
                                        }
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium">
                            {selectedApp.lastInterviewAt
                                ? new Date(selectedApp.lastInterviewAt).toLocaleDateString()
                                : "Not specified"}
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <span className="text-muted-foreground block">Next Interview</span>
                    {isEditing ? (
                        <Controller
                            name="nextInterviewAt"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        id="nextInterviewAt"
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                        value={
                                            field.value instanceof Date && !isNaN(field.value.getTime())
                                                ? field.value.toISOString().split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? new Date(e.target.value) : null)
                                        }
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium">
                            {selectedApp.nextInterviewAt
                                ? new Date(selectedApp.nextInterviewAt).toLocaleDateString()
                                : "Not specified"}
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <span className="text-muted-foreground block">Thank-you Email</span>
                    {isEditing ? (
                        <Controller
                            name="thankYouEmailSent"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                    <Checkbox
                                        id="ty-email-sent-checkbox"
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(!!checked)}
                                    />
                                    <FieldLabel htmlFor="ty-email-sent-checkbox">
                                        Sent "thank you" email
                                    </FieldLabel>
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium">
                            {selectedApp.thankYouEmailSent ? "Sent" : "Not sent"}
                        </span>
                    )}
                </div>
            </FieldGroup>
        </>
    )
}