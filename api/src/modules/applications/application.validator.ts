import { Types } from "mongoose";
import { z } from "zod";
import {
  APPLICATION_STATUSES,
  PRIORITIES,
  WORK_TYPES,
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

    appliedAt: z.union([z.coerce.date(), z.null()]).optional(),

    order: z.coerce.number().int().min(0).optional(),
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

    appliedAt: z.union([z.coerce.date(), z.null()]).optional(),

    order: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
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
  });

// ---------- move (kanban drag/drop persistence) ----------
export const moveApplicationSchema = z.object({
  newStatus: z.enum(APPLICATION_STATUSES),
  newOrder: z.coerce.number().min(0)
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
