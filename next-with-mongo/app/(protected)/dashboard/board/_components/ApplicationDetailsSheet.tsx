'use client' // already a client component since BoardView.tsx imports it, but ok
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Link as LinkIcon, X, Save } from 'lucide-react'
import Link from 'next/link'
import { deleteApplicationAction, updateApplicationAction } from "@/app/(protected)/dashboard/board/actions"
import { fullFormSchema } from '../types/application-form.schema';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { toast } from 'sonner'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { DeleteApplicationDialog } from './DeleteApplicationDialog';
import { ApplicationSheetSkeleton } from "./ApplicationSheetSkeleton"
import { Application } from '../types/application.types';
import { Checkbox } from '@/components/ui/checkbox';
import next from 'next';

// ? TODO LIST:
// TODO: Loading state (skeleton)
// TODO: Activity (what changes in the db for this?)
// * DONE : SheetContent overflow handling (ok na pala)
// * DONE : Empty date defaulting to 01/01/1970 (fix in dialog date input)

type ApplicationSheetProps = {
    selectedApp: Application | null;
    onClose: () => void;
}

export function ApplicationSheet({ selectedApp, onClose }: ApplicationSheetProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const {
        _id, userId, order,
        company, role, priority,
        jobUrl, workType, location, status, salaryMax, salaryMin,
        notes, appliedAt,
        nudgedAt, assessmentStatus, assessmentDeadline,
        lastInterviewAt, nextInterviewAt, thankYouEmailSent,
        offerDeadline,
        createdAt, updatedAt
    } = selectedApp || {};

    const fullUpdateApplicationForm = useForm<z.infer<typeof fullFormSchema>>({
        resolver: zodResolver(fullFormSchema),
        defaultValues: {
            company: company,
            role: role,
            jobUrl: jobUrl || undefined,
            location: location,
            workType: workType,  // Matches schema default
            salaryMin: salaryMin,
            salaryMax: salaryMax,
            status: status,  // Matches schema default
            priority: priority,  // Matches schema default
            appliedAt: appliedAt ? new Date(appliedAt) : null,  // Convert string to Date if present
            notes: notes,
            // === new fields ===
            nudgedAt: nudgedAt ? new Date(nudgedAt) : null,
            assessmentStatus: assessmentStatus,
            assessmentDeadline: assessmentDeadline ? new Date(assessmentDeadline) : null,
            nextInterviewAt: nextInterviewAt ? new Date(nextInterviewAt) : null,
            lastInterviewAt: lastInterviewAt ? new Date(lastInterviewAt) : null,
            thankYouEmailSent: thankYouEmailSent,
            offerDeadline: offerDeadline ? new Date(offerDeadline) : null,

        }
    })

    const resetFormToOriginal = () => {
        fullUpdateApplicationForm.reset({
            company: company || '',
            role: role || '',
            jobUrl: jobUrl || undefined,
            location: location || '',
            workType: workType,
            salaryMin: salaryMin || undefined,
            salaryMax: salaryMax || undefined,
            status: status,
            priority: priority,
            appliedAt: appliedAt ? new Date(appliedAt) : undefined,
            notes: notes || '',
            // === new fields ===
            nudgedAt: nudgedAt ? new Date(nudgedAt) : null,
            assessmentStatus: assessmentStatus,
            assessmentDeadline: assessmentDeadline ? new Date(assessmentDeadline) : null,
            nextInterviewAt: nextInterviewAt ? new Date(nextInterviewAt) : null,
            lastInterviewAt: lastInterviewAt ? new Date(lastInterviewAt) : null,
            thankYouEmailSent: thankYouEmailSent,
            offerDeadline: offerDeadline ? new Date(offerDeadline) : null,
        });
    }

    // Reset states when a new app is selected or sheet closes
    useEffect(() => {
        setIsEditing(false);
        setIsRefreshing(false);
        if (selectedApp) {
            resetFormToOriginal();
        }
    }, [selectedApp, fullUpdateApplicationForm]);

    const { handleSubmit, control, watch, setValue, getValues, formState: { isSubmitting } } = fullUpdateApplicationForm;
    const watched_worktype = watch('workType');
    const watched_status = watch('status')

    const isApplyDateRequired = watched_status === 'applied'
    const isLocationRequired = watched_worktype === 'onsite' || watched_worktype === 'hybrid';

    async function onSubmit(data: z.infer<typeof fullFormSchema>) {
        // console.log("Data submitted: ", data);
        const _id = selectedApp?._id;
        if (!_id) {
            alert("No application selected to delete.");
            return;
        }

        try {
            const result = await updateApplicationAction(_id, data);
            if (result.success) {
                toast.success("Application updated successfully")
                setIsRefreshing(true);
                router.refresh();
            } else {
                const details = Array.isArray((result as any).details) ? (result as any).details : [];

                if (details.length > 0) {
                    const first = details[0];
                    const msg = first?.message || result.error || "Error updating application";
                }
            }
        } catch (error) {
            console.error('An error occured while updating the application: ', error)
            toast.error("Error updating application")
            setIsRefreshing(false);
        } finally {
            setIsEditing(false);
        }
    }

    return (
        <Sheet open={!!selectedApp} onOpenChange={(open) => { if (!open) onClose() }}>
            <SheetContent className="w-full sm:max-w-135 flex flex-col p-0 overflow-hidden">
                {isRefreshing ? (
                    <ApplicationSheetSkeleton />
                ) : selectedApp && (
                    <form
                        id='update-application-form'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col h-full'
                    >
                        <SheetHeader className="px-6 py-4 space-y-2 border-b shrink-0 max-h-full">
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

                            {isEditing ? (
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
                            )}
                        </SheetHeader>

                        <main className="flex-1 overflow-y-auto px-6 p-4 space-y-8">
                            {/* Action Buttons */}
                            {!isEditing && (
                                <section className="flex items-center w-full gap-3">
                                    <Button type="button" className="flex-1" variant="secondary" onClick={() => setIsEditing(true)}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>

                                    {selectedApp.jobUrl ? (
                                        <Button asChild type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                            <Link href={selectedApp.jobUrl} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                View Job
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="flex-1">
                                            <LinkIcon className="w-4 h-4 mr-2" />
                                            No job URL
                                        </Button>
                                    )}
                                </section>
                            )}

                            {/* Details Grid */}
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

                            {/* Status-specific Details */}
                            {["applied", "interview", "offer"].includes(watched_status ?? "") && (
                                <section className="space-y-3">
                                    <h4 className="text-sm font-semibold text-foreground border-b pb-2">
                                        Status-specific details
                                    </h4>

                                    <div id="status-specific-details-container">
                                        {watched_status === "applied" && (
                                            <FieldGroup>
                                                <div className='space-y-1'>
                                                    {isEditing ? (
                                                        <Controller
                                                            name="nudgedAt"
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <FieldLabel htmlFor="nudgedAt">Last nudged</FieldLabel>
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
                                        )}

                                        {watched_status === "interview" && (
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
                                        )}

                                        {watched_status === "offer" && (
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
                                        )}
                                    </div>
                                </section>
                            )}

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

                            {/* Insert the activity logs here */}
                            {/* <section className='flex flex-col'>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                                <span>test</span>
                            </section> */}
                        </main>

                        {/* FOOTER: Changes based on edit state */}
                        <SheetFooter className="px-6 py-4 border-t shrink-0 flex flex-row items-center gap-3 sm:space-x-0">
                            {isEditing ? (
                                <>
                                    <Button type="button" className="flex-1" variant="outline" disabled={isSubmitting}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            resetFormToOriginal();
                                            setIsEditing(false);
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                        {isSubmitting ? <Spinner /> : <Save className="w-4 h-4 mr-2" />}
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </>
                            ) : (
                                <DeleteApplicationDialog application={selectedApp} onDeleteSuccess={onClose} />
                            )}
                        </SheetFooter>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    )
}