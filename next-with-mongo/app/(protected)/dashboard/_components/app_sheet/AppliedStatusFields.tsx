import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Control, Controller } from "react-hook-form";
import { ApplicationFormValues } from "../../types/application-form.schema";
import { Input } from "@/components/ui/input";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Application } from "../../types/application.types";

interface AppliedStatusFieldsProps {
    selectedApp: Application;
    isEditing: boolean;
    control: Control<ApplicationFormValues>
}

export function AppliedStatusFields({ selectedApp, isEditing, control }: AppliedStatusFieldsProps) {
    return (
        <FieldGroup>
            <div className='space-y-1'>
                <span className="text-muted-foreground block">Last nudged</span>
                {isEditing ? (
                    <Controller
                        name="nudgedAt"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    {...field}
                                    id="nudgedAt"
                                    type="date"
                                    aria-invalid={fieldState.invalid}
                                    value={
                                        field.value instanceof Date && !isNaN(field.value.getTime())
                                            ? field.value.toISOString().split('T')[0]
                                            : ''
                                    }
                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                ) : (
                    <span className="font-medium capitalize">
                        {selectedApp.nudgedAt ? new Date(selectedApp.nudgedAt).toLocaleDateString()
                            : "Not specified"}
                    </span>
                )}

            </div>

            <div className="space-y-1">
                <span className="text-muted-foreground block">Assessment Status</span>
                {isEditing ? (
                    <Controller
                        name="assessmentStatus"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Select
                                    value={field.value ?? "none"}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select assessment status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="missed">Missed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                ) : (
                    <span className="font-medium capitalize">
                        {selectedApp.assessmentStatus || "none"}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <span className="text-muted-foreground block">Assessment Deadline</span>
                {isEditing ? (
                    <Controller
                        name="assessmentDeadline"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    {...field}
                                    id="assessmentDeadline"
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
                        {selectedApp.assessmentDeadline
                            ? new Date(selectedApp.assessmentDeadline).toLocaleDateString()
                            : "Not specified"}
                    </span>
                )}
            </div>
        </FieldGroup>
    )
}