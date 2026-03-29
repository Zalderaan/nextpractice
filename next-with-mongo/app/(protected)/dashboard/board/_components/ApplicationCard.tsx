import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

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

// ? shape in backend
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
    appliedAt?: Date | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ApplicationCardProps {
    key?: string | null,
    application: Application
}

export function ApplicationCard({ application }: ApplicationCardProps) {
    const { _id, company, role } = application;

    return (
        <Link href={`/dashboard/applications/${_id}`}>
            <Card className="p-3 cursor-pointer hover:bg-accent">
                <CardTitle className="text-sm">{application.company}</CardTitle>
                <CardDescription className="text-xs">{application.role}</CardDescription>
            </Card>
        </Link>
    )
}