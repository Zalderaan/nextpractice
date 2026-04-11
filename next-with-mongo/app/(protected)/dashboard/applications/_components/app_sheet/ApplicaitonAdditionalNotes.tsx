import { Control, Controller } from "react-hook-form";
import { ApplicationFormValues } from "../../../board/types/application-form.schema";
import { Application } from "../../../board/types/application.types";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalNotesProps {
    selectedApp: Application;
    isEditing: boolean;
    control: Control<ApplicationFormValues>
}

export function AdditionalNotes({ selectedApp, isEditing, control }: AdditionalNotesProps) {
    return (
        <>
            {/* Notes Box */}
            <section className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground border-b pb-2">Additional Notes</h4>
                {isEditing ? (
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Textarea
                                    {...field}
                                    id="notes"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Any additional details..."
                                    rows={3}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                ) : (
                    selectedApp.notes ? (
                        <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground whitespace-pre-wrap">
                            {selectedApp.notes}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No notes provided.</p>
                    )
                )}
            </section>
        </>
    )
}