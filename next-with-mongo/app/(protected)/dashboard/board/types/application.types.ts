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