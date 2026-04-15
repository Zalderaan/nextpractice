import { Application } from "./types/application.types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function parseTimestamp(value: Application["appliedAt"]): number | null {
    if (!value) return null;
    const ts = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(ts) ? null : ts;
}

export function getDayCount(appliedAt: Application["appliedAt"], nowMs: number): number | null {
    const ts = parseTimestamp(appliedAt);
    if (ts === null) return null;

    // Clamp to 0 in case of future timestamps from bad data/timezone mismatch
    return Math.max(0, Math.floor((nowMs - ts) / DAY_IN_MS));
}

// add additional counted days to an instance of Application
export type NeedsAttentionContext = Application & {
    daysSinceApplied?: number;
    daysSinceLastInterview?: number;
};

// Enrich app with computed fields once
export const enrichApp = (app: Application): NeedsAttentionContext => ({
    ...app,
    daysSinceApplied: app.appliedAt ? getDayCount(app.appliedAt, Date.now()) ?? 0 : undefined,
    daysSinceLastInterview: app.lastInterviewAt ? getDayCount(app.lastInterviewAt, Date.now()) ?? 0 : undefined,
});

export const isSnoozed = (snoozedUntil: Date | string | null | undefined): boolean => {
  if (!snoozedUntil) return false;
  const snoozedTime =
    typeof snoozedUntil === "string"
      ? new Date(snoozedUntil).getTime()
      : snoozedUntil.getTime();
  return snoozedTime > Date.now();
};