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
import { createApplicationAction } from "../actions";

const basicJobInfoSchema = z.object({
    company: z.string().min(1, "Company is required").max(120),
    role: z.string().min(1, 'Role is required').max(120),
    jobUrl: z.url("Must be a valid URL").max(500).optional()
});

const jobDetailsSchema = z.object({
    location: z.string().max(120).optional(),
    workType: z.enum(['remote', 'onsite', 'hybrid']), // Removed .default()
    salaryMin: z.number().min(0).optional(),
    salaryMax: z.number().min(0).optional()
}).refine((data) => !data.salaryMin || !data.salaryMax || data.salaryMax >= data.salaryMin, {
    message: "Max salary must be greater than or equal to min salary",
    path: ["salaryMax"]
});

const applicationStatusSchema = z.object({
    status: z.enum(['wishlist', 'applied', 'interview', 'offer', 'rejected']), // Removed .default()
    priority: z.enum(['low', 'medium', 'high']), // Removed .default()
    appliedAt: z.union([z.date(), z.null()]).optional()
}).refine((data) => data.status === 'wishlist' || data.appliedAt, {
    message: "Applied date is required for applied or later statuses",
    path: ["appliedAt"]
});

const additionalSchema = z.object({
    notes: z.string().max(5000).optional()
});

// 2. Combine using the base objects (avoids the .shape stripping issue)
export const fullFormSchema = z.object({
    ...basicJobInfoSchema.shape,
    ...jobDetailsSchema.shape,
    ...applicationStatusSchema.shape,
    ...additionalSchema.shape,
}).superRefine((data, ctx) => {
    // Note: When spreading shapes, refinements are lost. 
    // You must re-apply them or use the logic below:
    if (data.salaryMin && data.salaryMax && data.salaryMax < data.salaryMin) {
        ctx.addIssue({
            code: 'custom',
            message: "Max salary must be >= min salary",
            path: ["salaryMax"],
        });
    }
    if (data.status !== 'wishlist' && !data.appliedAt) {
        ctx.addIssue({
            code: 'custom',
            message: "Applied date is required",
            path: ["appliedAt"],
        });
    }
});

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
            notes: ''
        }
    });

    const { handleSubmit, control, formState: { isSubmitting }, reset } = fullAddApplicationForm;

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

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add an application
                    </DialogTitle>
                    <DialogDescription>
                        lorem ipsum dolor sit amet.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="add-application-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-6 max-h-96 overflow-y-auto"
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
                                        <FieldLabel>Location <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            {...field}
                                            id="location"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Olongapo City, Philippines"
                                            autoComplete="off"
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
                                        <FieldLabel htmlFor="status">Status *</FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                            {...(field.value ? { value: field.value.toISOString().split('T')[0] } : { value: '' })}
                                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>

                    <Separator />

                    {/* 4. Additional Notes */}
                    <FieldGroup className="">
                        <legend className="text-sm font-semibold text-foreground">Additional Notes</legend>
                        <Controller
                            name="notes"
                            control={fullAddApplicationForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="notes">Notes</FieldLabel>
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
                    <DialogClose asChild>
                        <Button type="reset" form="add-application-form" onClick={() => reset()} variant="outline">Clear</Button>
                    </DialogClose>
                    <Button type="submit" form="add-application-form" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : null}
                        Add Application
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}                                                                                                           