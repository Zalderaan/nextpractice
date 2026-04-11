import { Control, Controller } from "react-hook-form";
import { ApplicationFormValues } from "../../../board/types/application-form.schema";
import { Application } from "../../../board/types/application.types";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface OfferStatusFieldsProps {
    selectedApp: Application;
    isEditing: boolean;
    control: Control<ApplicationFormValues>
}
export function OfferStatusFields({ selectedApp, isEditing, control }: OfferStatusFieldsProps) {
    return (
        <FieldGroup>
            <div className="space-y-1">
                <span className="text-muted-foreground block">Offer Deadline</span>
                {isEditing ? (
                    <Controller
                        name="offerDeadline"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    {...field}
                                    id="offerDeadline"
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
                        {selectedApp.offerDeadline
                            ? new Date(selectedApp.offerDeadline).toLocaleDateString()
                            : "Not specified"}
                    </span>
                )}
            </div>
        </FieldGroup>
    )
}