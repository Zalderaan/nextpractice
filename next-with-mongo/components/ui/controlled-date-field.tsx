import { Control, Controller } from "react-hook-form";
import { Field, FieldError } from "./field";
import { Input } from "./input";
import { ApplicationFormValues } from "@/app/(protected)/dashboard/board/types/application-form.schema";

type ControlledDateFieldProps = {
    // ? update name's type when new date fields exist
    name: Extract<keyof ApplicationFormValues, 'appliedAt' | 'nudgedAt' | 'assessmentDeadline' | 'nextInterviewAt' | 'lastInterviewAt' | 'offerDeadline'>
    control: Control<ApplicationFormValues>
    label: string
}

export function ControlledDateField({ name, control, label }: ControlledDateFieldProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <span className="text-muted-foreground block">{label}</span>
                    <Input
                        type="date"
                        value={field.value instanceof Date && !isNaN(field.value.getTime())
                            ? field.value.toISOString().split("T")[0] : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    )
}