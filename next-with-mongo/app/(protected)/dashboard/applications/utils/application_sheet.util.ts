// lib/application-form.helpers.ts

import { Application } from "../../board/types/application.types";
import { ApplicationFormValues } from "../../board/types/application-form.schema";

// ? helper to map application-related forms values
// * example: call this in defaultValues of useForm
export function mapApplicationToFormValues(
  app: Application | null,
): ApplicationFormValues {
  return {
    company: app?.company ?? "",
    role: app?.role ?? "",
    jobUrl: app?.jobUrl || undefined,
    location: app?.location ?? "",
    workType: app?.workType ?? "remote",
    salaryMin: app?.salaryMin,
    salaryMax: app?.salaryMax,
    status: app?.status ?? "wishlist",
    priority: app?.priority ?? "medium",
    appliedAt: app?.appliedAt ? new Date(app.appliedAt) : null,
    notes: app?.notes ?? "",
    nudgedAt: app?.nudgedAt ? new Date(app.nudgedAt) : null,
    assessmentStatus: app?.assessmentStatus,
    assessmentDeadline: app?.assessmentDeadline
      ? new Date(app.assessmentDeadline)
      : null,
    nextInterviewAt: app?.nextInterviewAt
      ? new Date(app.nextInterviewAt)
      : null,
    lastInterviewAt: app?.lastInterviewAt
      ? new Date(app.lastInterviewAt)
      : null,
    thankYouEmailSent: app?.thankYouEmailSent,
    offerDeadline: app?.offerDeadline ? new Date(app.offerDeadline) : null,
  };
}
