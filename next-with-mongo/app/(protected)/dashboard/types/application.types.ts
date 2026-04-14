export const WORK_TYPES = ["remote", "hybrid", "onsite"] as const;
export const APPLICATION_STATUSES = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
  "ghosted",
] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;
export const ASSESSMENT_STATUSES = [
  "none",
  "pending",
  "completed",
  "missed",
] as const;

export type WorkType = (typeof WORK_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];

export type AttentionReason =
  | "assessmentPending"
  | "assessmentMissed"
  | "missingInterviewDate"
  | "upcomingInterview"
  | "thankYouEmailDue"
  | "noCallbackAfterInterview"
  | "missingOfferDeadline"
  | "expiringOffer"
  | "staleFourteenDays"
  | "staleThirtyDays";

  export interface NeedsAttentionState {
    reason: AttentionReason;
    isDismissed: boolean;
    snoozedUntil?: Date | string | null; // The date when the snooze expires
  }

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
  assessmentStatus: AssessmentStatus;
  assessmentDeadline?: Date | null;
  nextInterviewAt?: Date | null;
  lastInterviewAt?: Date | null;
  thankYouEmailSent: boolean;
  offerDeadline?: Date | null;
  nudgedAt?: Date | null;
  // attentionStates?: NeedsAttentionState[]; // TODO: Implement this
}

