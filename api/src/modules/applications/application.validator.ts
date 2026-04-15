import { Types } from "mongoose";
import { z } from "zod";
import {
  APPLICATION_STATUSES,
  PRIORITIES,
  WORK_TYPES,
  ASSESSMENT_STATUSES,
} from "./Application.model";

// ---------- helpers ----------
const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((val) => (val === "" ? undefined : val));

const optionalNullableTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((val) => {
      if (val === "") return undefined;
      return val;
    });

const optionalNumberLike = z
  .union([z.number(), z.string().trim()])
  .optional()
  .transform((val) => {
    if (val === undefined || val === "") return undefined;

    const parsed = typeof val === "number" ? val : Number(val);

    if (Number.isNaN(parsed)) {
      throw new Error("Invalid number");
    }

    return parsed;
  });

// ---------- create ----------
export const createApplicationSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required").max(120),

    role: z.string().trim().min(1, "Role is required").max(120),

    jobUrl: z
      .string()
      .trim()
      .url("Job URL must be a valid URL")
      .max(500)
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),

    location: optionalTrimmedString(120),

    workType: z.enum(WORK_TYPES).optional().default("remote"),

    status: z.enum(APPLICATION_STATUSES).optional().default("wishlist"),

    priority: z.enum(PRIORITIES).optional().default("medium"),

    notes: optionalTrimmedString(5000),

    salaryMin: optionalNumberLike,

    salaryMax: optionalNumberLike,

    appliedAt: z.coerce.date().nullable().optional(),

    order: z.coerce.number().int().min(0).optional(),

    assessmentStatus: z.enum(ASSESSMENT_STATUSES).optional().default("none"),
    assessmentDeadline: z.coerce.date().nullable().optional(),
    nextInterviewAt: z.coerce.date().nullable().optional(),
    lastInterviewAt: z.coerce.date().nullable().optional(),
    thankYouEmailSent: z.boolean().optional().default(false),
    offerDeadline: z.coerce.date().nullable().optional(),
    nudgedAt: z.coerce.date().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.salaryMin !== undefined && data.salaryMin < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMin"],
        message: "Salary minimum must be 0 or greater",
      });
    }

    if (data.salaryMax !== undefined && data.salaryMax < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "Salary maximum must be 0 or greater",
      });
    }

    if (
      data.salaryMin !== undefined &&
      data.salaryMax !== undefined &&
      data.salaryMax < data.salaryMin
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message:
          "Salary maximum must be greater than or equal to salary minimum",
      });
    }

    if (data.status !== "wishlist" && !data.appliedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["appliedAt"],
        message: "Applied date is required once status is not wishlist",
      });
    }

    // if (data.assessmentStatus === "pending" && !data.assessmentDeadline) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["assessmentDeadline"],
    //     message: "Assessment deadline is required when assessment is pending",
    //   });
    // }

    if (
      data.lastInterviewAt &&
      data.nextInterviewAt &&
      data.nextInterviewAt < data.lastInterviewAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["nextInterviewAt"],
        message: "Next interview date must be on or after last interview date",
      });
    }

    // if (data.status === "offer" && !data.offerDeadline) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["offerDeadline"],
    //     message: "Offer deadline is required when status is offer",
    //   });
    // }

    if (data.status === "wishlist" && data.offerDeadline) {
      ctx.addIssue({
        code: "custom",
        path: ["offerDeadline"],
        message: "Offer deadline only applies when status is offer",
      });
    }
  });

// ---------- update ----------
export const updateApplicationSchema = z
  .object({
    company: z.string().trim().min(1).max(120).optional(),

    role: z.string().trim().min(1).max(120).optional(),

    jobUrl: z
      .union([
        z.string().trim().url("Job URL must be a valid URL").max(500),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((val) => {
        if (val === "" || val === null) return undefined;
        return val;
      }),

    location: optionalNullableTrimmedString(120),

    workType: z.enum(WORK_TYPES).optional(),

    status: z.enum(APPLICATION_STATUSES).optional(),

    priority: z.enum(PRIORITIES).optional(),

    notes: z
      .union([z.string().trim().max(5000), z.literal(""), z.null()])
      .optional()
      .transform((val) => {
        if (val === "" || val === null) return undefined;
        return val;
      }),

    salaryMin: z
      .union([z.number(), z.string().trim(), z.null()])
      .optional()
      .transform((val) => {
        if (val === undefined || val === "" || val === null) return undefined;

        const parsed = typeof val === "number" ? val : Number(val);

        if (Number.isNaN(parsed)) {
          throw new Error("Invalid salaryMin");
        }

        return parsed;
      }),

    salaryMax: z
      .union([z.number(), z.string().trim(), z.null()])
      .optional()
      .transform((val) => {
        if (val === undefined || val === "" || val === null) return undefined;

        const parsed = typeof val === "number" ? val : Number(val);

        if (Number.isNaN(parsed)) {
          throw new Error("Invalid salaryMax");
        }

        return parsed;
      }),

    appliedAt: z.coerce.date().nullable().optional(),
    order: z.coerce.number().int().min(0).optional(),

    assessmentStatus: z.enum(ASSESSMENT_STATUSES).optional(),
    assessmentDeadline: z.coerce.date().nullable().optional(),
    nextInterviewAt: z.coerce.date().nullable().optional(),
    lastInterviewAt: z.coerce.date().nullable().optional(),
    thankYouEmailSent: z.boolean().optional(),
    offerDeadline: z.coerce.date().nullable().optional(),
    nudgedAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
  .superRefine((data, ctx) => {
    const has = (key: keyof typeof data) =>
      Object.prototype.hasOwnProperty.call(data, key);

    if (
      data.salaryMin !== undefined &&
      data.salaryMax !== undefined &&
      data.salaryMax < data.salaryMin
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message:
          "Salary maximum must be greater than or equal to salary minimum",
      });
    }

    if (
      data.nextInterviewAt &&
      data.lastInterviewAt &&
      data.nextInterviewAt < data.lastInterviewAt
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["nextInterviewAt"],
        message: "Next interview date must be on or after last interview date",
      });
    }

    if (
      data.assessmentStatus === "pending" &&
      has("assessmentStatus") &&
      !has("assessmentDeadline")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["assessmentDeadline"],
        message:
          "Include assessment deadline when setting assessmentStatus to pending",
      });
    }

    if (data.status === "offer" && has("status") && !has("offerDeadline")) {
      ctx.addIssue({
        code: "custom",
        path: ["offerDeadline"],
        message: "Include offer deadline when setting status to offer",
      });
    }

    if (
      has("offerDeadline") &&
      has("status") &&
      data.status !== "offer" &&
      data.offerDeadline
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["offerDeadline"],
        message: "Offer deadline only applies when status is offer",
      });
    }
  });

  export const dismissNotificationSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
  })

  export const snoozeNotificationSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
    snoozedUntil: z.date().min(1, "snoozedUntil is required")
  });

// ---------- move (kanban drag/drop persistence) ----------
export const moveApplicationSchema = z.object({
  newStatus: z.enum(APPLICATION_STATUSES),
  newOrder: z.coerce.number().min(0),
});

// ---------- inferred types (only reflects pure forms) ----------
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type MoveApplicationInput = z.infer<typeof moveApplicationSchema>;

// ---------- model type-safe ---------
export type CreateApplicationData = CreateApplicationInput & {
  userId: Types.ObjectId;
  order: number;
};

