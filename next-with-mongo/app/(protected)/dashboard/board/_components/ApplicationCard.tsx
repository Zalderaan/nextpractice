import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Briefcase, MapPin, DollarSign } from "lucide-react";

export const WORK_TYPES = ["remote", "hybrid", "onsite"] as const;
export const APPLICATION_STATUSES = [
    "wishlist",
    "applied",
    "interview",
    "offer",
    "rejected",
] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;

export type WorkType = (typeof WORK_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface Application {
    _id: string;
    userId: string;
    company: string;
    role: string;
    jobUrl?: string;
    location?: string;
    workType: WorkType;
    status: ApplicationStatus;
    priority: Priority;
    notes?: string;
    salaryMin?: number;
    salaryMax?: number;
    appliedAt?: Date | string | null; // Backend dates often arrive as strings
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ApplicationCardProps {
    application: Application;
    onClick: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
    const { company, role, workType, priority, salaryMin, salaryMax, location, appliedAt, notes } = application;
    console.log("This is notes: ", notes);

    // Convert string dates to Date objects if necessary and format
    const dateToDisplay = appliedAt
        ? new Date(appliedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0
        }).format(value);

    const noteToDisplay = notes !== undefined ? notes : null;

    return (
        <Card
            className="cursor-pointer hover:bg-accent transition-colors shadow-sm"
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <div>
                    <CardTitle className="text-base font-bold">{company}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary/80">{role}</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Location */}
                {location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={14} />
                        <span>{location}</span>
                    </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize flex gap-1 items-center">
                        <Briefcase size={12} />
                        {workType}
                    </Badge>
                    <Badge
                        variant={priority === 'high' ? 'destructive' : 'secondary'}
                        className="capitalize"
                    >
                        {priority}
                    </Badge>
                </div>

                {/* Date */}
                {dateToDisplay && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>Applied {dateToDisplay}</span>
                    </div>
                )}

            </CardContent>

            {(salaryMin || salaryMax) && (
                <CardFooter className="p-4 flex flex-col justify-start gap-1 text-xs font-light text-green-700 dark:text-green-500">
                    <span className="flex space-x-2 w-full text-xs">
                        <span className="text-gray-">Est. </span>
                        <span>
                            {salaryMin && formatCurrency(salaryMin)}
                            {salaryMin && salaryMax ? " - " : ""}
                            {salaryMax && formatCurrency(salaryMax)}
                        </span>
                    </span>

                    {notes && (
                        <>
                            <Separator className="my-1" />
                            <span className="text-muted-foreground italic line-clamp-2 w-full">
                                {notes}
                            </span>
                        </>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}