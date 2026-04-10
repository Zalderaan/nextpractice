import z from "zod";

const basicJobInfoSchema = z.object({
  company: z.string().min(1, "Company is required").max(120),
  role: z.string().min(1, "Role is required").max(120),
  jobUrl: z.url("Must be a valid URL").max(500).optional(),
});

const jobDetailsSchema = z
  .object({
    location: z.string().max(120).optional(),
    workType: z.enum(["remote", "onsite", "hybrid"]), // Removed .default()
    salaryMin: z.number().min(0).optional(),
    salaryMax: z.number().min(0).optional(),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMax >= data.salaryMin,
    {
      message: "Max salary must be greater than or equal to min salary",
      path: ["salaryMax"],
    },
  );

const applicationStatusSchema = z
  .object({
    status: z.enum(["wishlist", "applied", "interview", "offer", "rejected"]), // Removed .default()
    priority: z.enum(["low", "medium", "high"]), // Removed .default()
    appliedAt: z.union([z.date(), z.null()]).optional(),
  })
  .refine((data) => data.status === "wishlist" || data.appliedAt, {
    message: "Applied date is required for applied or later statuses",
    path: ["appliedAt"],
  });

const statusConditionalSchema = z.object({
  assessmentStatus: z
    .enum(["none", "pending", "completed", "missed"])
    .optional(),
  assessmentDeadline: z.union([z.date(), z.null()]).optional(),
  nextInterviewAt: z.union([z.date(), z.null()]).optional(),
  lastInterviewAt: z.union([z.date(), z.null()]).optional(),
  thankYouEmailSent: z.boolean().optional(),
  offerDeadline: z.union([z.date(), z.null()]).optional(),
});

const additionalSchema = z.object({
  notes: z.string().max(5000).optional(),
});

// 2. Combine using the base objects (avoids the .shape stripping issue)
export const fullFormSchema = z
  .object({
    ...basicJobInfoSchema.shape,
    ...jobDetailsSchema.shape,
    ...applicationStatusSchema.shape,
    ...statusConditionalSchema.shape,
    ...additionalSchema.shape,
  })
  .superRefine((data, ctx) => {
    // Note: When spreading shapes, refinements are lost.
    // You must re-apply them or use the logic below:
    if (data.salaryMin && data.salaryMax && data.salaryMax < data.salaryMin) {
      ctx.addIssue({
        code: "custom",
        message: "Max salary must be >= min salary",
        path: ["salaryMax"],
      });
    }

    if (
      data.status === "applied" &&
      data.assessmentDeadline &&
      data.assessmentDeadline < new Date()
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Assessment deadline must be in the future",
        path: ["assessmentDeadline"],
      });
    }

    if (
      data.status === "offer" &&
      data.offerDeadline &&
      data.offerDeadline < new Date()
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Offer deadline must be in the future",
        path: ["offerDeadline"],
      });
    }
    if (data.status !== "wishlist" && !data.appliedAt) {
      ctx.addIssue({
        code: "custom",
        message: "Applied date is required",
        path: ["appliedAt"],
      });
    }
    if (data.workType !== "remote" && !data.location) {
      ctx.addIssue({
        code: "custom",
        path: ["location"],
        message: "Location is required for onsite and hybrid roles",
      });
    }
  });
