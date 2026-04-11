import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";
import { Application } from "../../../board/types/application.types";
import { ApplicationFormValues } from "../../../board/types/application-form.schema";

interface ApplicationSheetHeaderProps {
    selectedApp: Application,
    isEditing: boolean,
    control: Control<ApplicationFormValues>
}

export function ApplicationSheetHeader({ selectedApp, isEditing, control }: ApplicationSheetHeaderProps) {
    return (
        <SheetHeader className="px-6 py-4 space-y-2 border-b shrink-0 max-h-full" >
            <div className="flex flex-row items-center space-x-3">
                {isEditing ? (
                    <Controller
                        name="company"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="company">Company {isEditing && (<span className='text-red-500'>*</span>)}</FieldLabel>
                                <Input
                                    {...field}
                                    id="company"
                                    type="text"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Acme Corp."
                                    autoComplete="off"
                                    required
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                ) : (
                    <SheetTitle className="text-xl">{selectedApp.company}</SheetTitle>
                )}

                {!isEditing && (
                    <Badge variant={selectedApp.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                        {selectedApp.priority}
                    </Badge>
                )}
            </div>

            {
                isEditing ? (
                    <FieldGroup className='flex flex-row items-center justify-between'>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="role">Role {isEditing && (<span className='text-red-500'>*</span>)}</FieldLabel>
                                    <Input
                                        {...field}
                                        id="role"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Software Engineer"
                                        autoComplete="off"
                                        required
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="priority"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="role">Priority{isEditing && (<span className='text-red-500'>*</span>)}</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                ) : (
                    <SheetDescription className="text-base font-medium text-primary/80">
                        {selectedApp.role}
                    </SheetDescription>
                )
            }
        </SheetHeader >
    )
}