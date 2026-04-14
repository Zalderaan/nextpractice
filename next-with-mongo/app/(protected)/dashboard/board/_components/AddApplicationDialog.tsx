// already a client component since BoardView imports this


import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createApplicationAction } from "../../actions";
import { fullFormSchema } from "../../types/application-form.schema";
import { Checkbox } from "@/components/ui/checkbox";

export function AddApplicationDialog() {
    const fullAddApplicationForm = useForm<z.infer<typeof fullFormSchema>>({
        resolver: zodResolver(fullFormSchema),
        defaultValues: {
            company: '',
            role: '',
            jobUrl: undefined,
            location: '',
            workType: 'remote',  // Matches schema default
            salaryMin: undefined,
            salaryMax: undefined,
            status: 'wishlist',  // Matches schema default
            priority: 'medium',  // Matches schema default
            appliedAt: null,
            notes: '',
            // === new fields ===
            nudgedAt: null,
            assessmentStatus: "none",
            assessmentDeadline: null,
            nextInterviewAt: null,
            lastInterviewAt: null,
            thankYouEmailSent: false,
            offerDeadline: null
        }
    });

    const { handleSubmit, control, watch, setValue, getValues, formState: { isSubmitting }, reset } = fullAddApplicationForm;

    // conditionally require loc fields according to workType
    const watched_workType = watch('workType');
    const watched_status = watch('status')

    const isApplyDateRequired = watched_status === 'applied'
    const isLocationRequired = watched_workType === 'onsite' || watched_workType === 'hybrid';

    async function onSubmit(data: z.infer<typeof fullFormSchema>) {
        try {
            const result = await createApplicationAction(data);
            if (!result.success) throw new Error('Failed to add application');
            toast.success("Application added successfully!");
            reset();
            // Optionally refresh the board or close dialog
        } catch (error) {
            console.error('Error creating application: ', error);
            toast.error("An unexpected error occurred.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex flex-row items-center px-2">
                    <PlusIcon />
                    <span>Add Application</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Add an application
                    </DialogTitle>
                    <DialogDescription>
                        Enter your job applicaiton details and start tracking
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="add-application-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-6 max-h-[80vh] overflow-y-auto px-2"
                >
                    {/* 1. Basic Job Info */}
                    <FieldGroup className="">
                        <legend className="text-sm font-semibold text-foreground">Basic Job Info</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="company"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="company">Company <span className="text-red-500">*</span></FieldLabel>
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

                            <Controller
                                name="role"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="role">Role <span className="text-red-500">*</span></FieldLabel>
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
                        </div>
                        <Controller
                            name="jobUrl"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="jobUrl">Job URL</FieldLabel>
                                    <Input
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value.trim() === '' ? undefined : e.target.value)}
                                        id="jobUrl"
                                        type="url"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="https://example.com/jobs"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Separator />

                    {/* 2. Job Details */}
                    <FieldGroup className="space-y-4">
                        <legend className="text-sm font-semibold text-foreground">Job Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="location"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            Location
                                            {isLocationRequired && <span className="text-red-500">*</span>}
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="location"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            aria-required={isLocationRequired}
                                            placeholder="Olongapo City, Philippines"
                                            autoComplete="off"
                                            required={isLocationRequired}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="workType"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="Work Type">Work Type <span className="text-red-500">*</span></FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Controller
                                name="salaryMin"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="salaryMin">Min Salary</FieldLabel>
                                        <Input
                                            {...field}
                                            id="salaryMin"
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="50000"
                                            autoComplete="off"
                                            value={field.value || ''}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="salaryMax"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="salaryMax">Max Salary</FieldLabel>
                                        <Input
                                            {...field}
                                            id="salaryMax"
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="150000"
                                            autoComplete="off"
                                            value={field.value || ''}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>

                    <Separator />

                    {/* 3. Application Status */}
                    <FieldGroup className="">
                        <legend className="text-sm font-semibold text-foreground">Application Status</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="status">Status {isApplyDateRequired && (<span className="text-red-500">*</span>)}</FieldLabel>
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
                                            defaultValue={field.value}
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
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Priority <span className="text-red-500">*</span></FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Controller
                                name="appliedAt"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="appliedAt">Applied At</FieldLabel>
                                        <Input
                                            {...field}
                                            id="appliedAt"
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
                        </div>
                    </FieldGroup>

                    {watched_status === "applied" && (
                        <FieldGroup>
                            {/* nudgedAt */}
                            <Controller
                                name="nudgedAt"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="nudgedAt"></FieldLabel>
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
                            {/* assessmentStatus dropdown */}
                            <Controller
                                name="assessmentStatus"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="assessmentStatus">Assessment Status</FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select assessment status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="passed">Passed</SelectItem>
                                                <SelectItem value="missed">Missed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            {/* assessmentDeadline date picker */}
                            <Controller
                                name="assessmentDeadline"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="assessmentDeadline">Assessment Deadline</FieldLabel>
                                        <Input
                                            {...field}
                                            id="assessmentDeadline"
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
                        </FieldGroup>
                    )}

                    {watched_status === "interview" && (
                        <FieldGroup>
                            <legend className="text-sm font-semibold text-foreground">Interview Tracking</legend>
                            {/* lastInterviewAt date picker */}
                            <Controller
                                name="lastInterviewAt"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="lastInterviewAt">Last Interview</FieldLabel>
                                        <Input
                                            {...field}
                                            id="lastInterviewAt"
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

                            {/* nextInterviewAt date picker */}
                            <Controller
                                name="nextInterviewAt"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="nextInterviewAt">Next Interview</FieldLabel>
                                        <Input
                                            {...field}
                                            id="nextInterviewAt"
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

                            {/* thankYouEmailSent checkbox */}
                            <Controller
                                name="thankYouEmailSent"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                        <Checkbox id="ty-email-sent-checkbox" />
                                        <FieldLabel>Sent "thank you" email</FieldLabel>
                                    </Field>
                                )}
                            />


                        </FieldGroup>
                    )}

                    {watched_status === "offer" && (
                        <FieldGroup>
                            {/* offerDeadline date picker */}
                            <Controller
                                name="offerDeadline"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="offerDeadline">Offer Deadline</FieldLabel>
                                        <Input
                                            {...field}
                                            id="offerDeadline"
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
                        </FieldGroup>
                    )}

                    <Separator />

                    {/* 4. Additional Notes */}
                    <FieldGroup className="">
                        <Controller
                            name="notes"
                            control={fullAddApplicationForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
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
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <Button type="reset" form="add-application-form" onClick={() => reset()} variant="outline">Clear</Button>
                    <Button type="submit" form="add-application-form" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : null}
                        Add Application
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}                                                                                                           