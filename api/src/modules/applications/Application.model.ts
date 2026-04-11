import { Schema, model, Types } from "mongoose";

export const WORK_TYPES = ["remote", "hybrid", "onsite"] as const;

// UPDATED: Added "ghosted" for the 30-day stale rule
export const APPLICATION_STATUSES = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
  "ghosted",
] as const;

export const PRIORITIES = ["low", "medium", "high"] as const;

// NEW: To track assessments
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

export interface IApplication {
  userId: Types.ObjectId;
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

  // --- NEW "NEEDS ATTENTION" FIELDS ---

  // 1. Time-Sensitive
  assessmentStatus: AssessmentStatus;
  assessmentDeadline?: Date | null;
  nextInterviewAt?: Date | null;

  // 2. Strategic Follow-ups
  lastInterviewAt?: Date | null;
  thankYouEmailSent: boolean;

  // 3. Offers
  offerDeadline?: Date | null;

  // 4. Stale Rules
  nudgedAt?: Date | null;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is missing"],
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: 120,
    },
    jobUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    workType: {
      type: String,
      enum: WORK_TYPES,
      default: "remote",
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "wishlist",
      index: true,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "medium",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    appliedAt: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: 0,
    },

    // --- NEW "NEEDS ATTENTION" SCHEMA DEFINITIONS ---

    assessmentStatus: {
      type: String,
      enum: ASSESSMENT_STATUSES,
      default: "none",
    },
    assessmentDeadline: {
      type: Date,
      default: null,
    },
    nextInterviewAt: {
      type: Date,
      default: null,
    },
    lastInterviewAt: {
      type: Date,
      default: null,
    },
    thankYouEmailSent: {
      type: Boolean,
      default: false,
    },
    offerDeadline: {
      type: Date,
      default: null,
    },
    nudgedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes remain exactly the same as your original file
applicationSchema.index({ userId: 1, status: 1, order: 1 });
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, priority: 1 });

applicationSchema.index({
  company: "text",
  role: "text",
  location: "text",
  notes: "text",
});

const Application = model<IApplication>("Application", applicationSchema);
export default Application;
