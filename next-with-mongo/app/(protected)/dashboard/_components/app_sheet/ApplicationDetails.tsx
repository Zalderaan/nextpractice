import { Button } from "@/components/ui/button";
import { LinkIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { Application } from "../../types/application.types";
import { ApplicationFormValues } from "../../types/application-form.schema";
import { Control, Controller, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Select } from "@/components/ui/select";

interface ApplicationDetailsProps {
    selectedApp: Application,
    isEditing: boolean,
    control: Control<ApplicationFormValues>,
    getValues: UseFormGetValues<ApplicationFormValues>,
    setValue: UseFormSetValue<ApplicationFormValues>,
    isLocationRequired: boolean,
    isApplyDateRequired: boolean
}

export function ApplicationDetails({
    selectedApp,
    isEditing,
    control,
    getValues,
    setValue,
    isLocationRequired,
    isApplyDateRequired
}: ApplicationDetailsProps) {
    const { location, workType, salaryMin, salaryMax, jobUrl, appliedAt } = selectedApp;

    return (

        <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground border-b pb-2">Details</h4>
            <div id='details-container' className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <span className="text-muted-foreground block">Status {isEditing && (<span className='text-red-500'>*</span>)}</span>
                    {isEditing ? (
                        <Controller
                            name="status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    {/* <FieldLabel htmlFor="status">Status *</FieldLabel> */}
                                    <Select
                                        onValueChange={(value) => {
                                            const previousStatus = field.value;
                                            field.onChange(value);

                                            const appliedAt = getValues('appliedAt');

                                            if (previousStatus === 'wishlist' && value !== 'wishlist' && !appliedAt) {
                                                setValue('appliedAt', new Date(), {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                            }

                                            // clear date if setting it as wishlist again
                                            if (previousStatus !== 'wishlist' && value === 'wishlist') {
                                                setValue('appliedAt', null, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                            }
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="wishlist">Wishlist</SelectItem>
                                            <SelectItem value="applied">Applied</SelectItem>
                                            <SelectItem value="interview">Interview</SelectItem>
                                            <SelectItem value="offer">Offer</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium capitalize">{selectedApp.status}</span>
                    )}
                </div>

                <div className="space-y-1">
                    <span className="text-muted-foreground block">Location {isEditing && isLocationRequired && (<span className='text-red-500'>*</span>)}</span>
                    {isEditing ? (
                        <Controller
                            name="location"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        id="location"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        aria-required={isLocationRequired}
                                        placeholder="Olongapo City, Philippines"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium capitalize">
                            {
                                location ? (
                                    <span>{location}</span>
                                ) : (
                                    <span className='font-medium text-muted-foreground italic'>No location specified</span>
                                )
                            }
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <span className="text-muted-foreground block"> Work Type {isEditing && (<span className='text-red-500'>*</span>)}</span>
                    {isEditing ? (
                        <Controller
                            name="workType"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Select
                                        onValueChange={(value) => {
                                            const previousWorkType = field.value;
                                            field.onChange(value);

                                            if (previousWorkType !== 'remote' && value === 'remote') {
                                                setValue('location', '', {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                })
                                            }
                                        }
                                        }
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select work type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="remote">Remote</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                            <SelectItem value="onsite">Onsite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium capitalize">
                            {
                                workType ? (
                                    <span>{workType}</span>
                                ) : (
                                    <span className='font-medium text-red-200'>This shouldn't be available-- workType is always required!</span>
                                )
                            }
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <span className="text-muted-foreground block">Salary Range</span>
                    {isEditing ? (
                        <div className="flex items-start gap-2 w-full">
                            <Controller
                                name="salaryMin"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <Input
                                            {...field}
                                            id="salaryMin"
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Min"
                                            autoComplete="off"
                                            value={field.value || ''}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <span className="text-muted-foreground mt-2">-</span>

                            <Controller
                                name="salaryMax"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <Input
                                            {...field}
                                            id="salaryMax"
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Max"
                                            autoComplete="off"
                                            value={field.value || ''}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    ) : (
                        <span className="font-medium">
                            {salaryMin && salaryMax ? (
                                <span>${salaryMin} - ${salaryMax}</span>
                            ) : salaryMin ? (
                                <span>${salaryMin}</span>
                            ) : salaryMax ? (
                                <span>${salaryMax}</span>
                            ) : (
                                <span className="font-medium text-muted-foreground italic">Not specified</span>
                            )}
                        </span>
                    )}
                </div>

                <div className="space-y-1 max-w-full overflow-hidden truncate">
                    <span className="text-muted-foreground block">URL</span>
                    {isEditing ? (
                        <Controller
                            name="jobUrl"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        id="jobUrl"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="https://example.com"
                                        autoComplete="off"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value.trim() === '' ? undefined : e.target.value)} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium block truncate max-w-full">
                            {
                                jobUrl ? jobUrl : <span className='font-medium text-muted-foreground italic'>Not specified</span>
                            }
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <span className="text-muted-foreground block">Applied on {isEditing && isApplyDateRequired && (<span className='text-red-500'>*</span>)}</span>
                    {isEditing ? (
                        <Controller
                            name="appliedAt"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        id="appliedAt"
                                        type="date"
                                        aria-invalid={fieldState.invalid}
                                        {...(field.value ? { value: field.value.toISOString().split('T')[0] } : { value: '' })}
                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    ) : (
                        <span className="font-medium">{
                            appliedAt
                                ? (<span>{new Date(appliedAt).toLocaleDateString()}</span>)
                                : (<span className='font-medium text-muted-foreground italic'>Not specified</span>)
                        }</span>
                    )}
                </div>
            </div>
        </section>
    )
}