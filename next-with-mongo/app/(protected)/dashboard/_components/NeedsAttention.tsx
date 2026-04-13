import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardHeader,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Application } from "../board/types/application.types"
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
} from "@/components/ui/empty";
import Link from "next/link"
import { Megaphone } from "lucide-react";

interface NeedsAttentionProps {
    applications: Application[]
}

const criteria = {
    // 1. Time-sensitive
    assessmentPending: (app: NeedsAttentionContext) =>
        app.status === "applied" && app.assessmentStatus === "pending",

    assessmentMissed: (app: NeedsAttentionContext) =>
        app.status === "applied" && app.assessmentStatus === "missed",

    upcomingInterview: (app: NeedsAttentionContext) =>
        app.status === "interview" && app.nextInterviewAt && new Date(app.nextInterviewAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

    // 2. Strategic follow-ups
    thankYouEmailDue: (app: NeedsAttentionContext) =>
        app.status === "interview" &&
        !app.thankYouEmailSent &&
        app.lastInterviewAt &&
        getDayCount(app.lastInterviewAt, Date.now()) === 0, // same day

    noCallbackAfterInterview: (app: NeedsAttentionContext) =>
        app.status === "interview" &&
        app.daysSinceLastInterview !== undefined &&
        app.daysSinceLastInterview >= 7,

    // 3. Offer & Negotiation
    expiringOffer: (app: NeedsAttentionContext) =>
        app.status === "offer" &&
        app.offerDeadline &&
        new Date(app.offerDeadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // within 3 days

    // 4. Stale rules
    staleFourteenDays: (app: NeedsAttentionContext) =>
        app.status === "applied" &&
        app.appliedAt &&
        (app.daysSinceApplied ?? 0) >= 14 &&
        !app.nudgedAt,

    staleThirtyDays: (app: NeedsAttentionContext) =>
        app.status === "applied" &&
        app.appliedAt &&
        (app.daysSinceApplied ?? 0) >= 30,
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

type NeedsAttentionApp = Application & {
    day_count: number;
}

function parseTimestamp(value: Application["appliedAt"]): number | null {
    if (!value) return null;
    const ts = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(ts) ? null : ts;
}

function getDayCount(appliedAt: Application["appliedAt"], nowMs: number): number | null {
    const ts = parseTimestamp(appliedAt);
    if (ts === null) return null;

    // Clamp to 0 in case of future timestamps from bad data/timezone mismatch
    return Math.max(0, Math.floor((nowMs - ts) / DAY_IN_MS));
}

// Type for enriched data needed during filtering
type NeedsAttentionContext = Application & {
    daysSinceApplied?: number;
    daysSinceLastInterview?: number;
};


// export function NeedsAttention({ applications }: NeedsAttentionProps) {
/** 
 * ? Criteria for being marked as "Needs Attention"
 * TODO: 1. Time-sensitive
 *          - assessment pending/missed deadline | action: mark as passed assessment | would need to implement assessment + assessment_status in cols db?
 *          - remind user of upcoming interview date | action: mark as taken, will not take, etc. | would need interview_date col in db
 * TODO: 2. Strategic follow-ups
 *          - send a "thank you" email to recruiter within 24 hours after interview | action: mark as email sent / opt not to send / etc.
 *          - no callbacks yet after 5-7 days after an interview | action: mark as ghosted?
 * TODO: 3. Offer & Negotiation hurdles | action: mark as reviewed
 *          - Offer review
 *          - expiring offers | would need to add offer deadline 
 * TODO: 4. Stale rules (pinaka possible magawa ngayon)
 * TODO:    - 14-day stale | action: nudge + mark as nudged (stays in the needs attention)
 * *            - successfully counting 14-day 
 * TODO:        - no action yet 
 *          - 30-day stale | action: move to archive (?) | would need to implement ghosted status
*/

// Enrich app with computed fields once
const enrichApp = (app: Application): NeedsAttentionContext => ({
    ...app,
    daysSinceApplied: app.appliedAt ? getDayCount(app.appliedAt, Date.now()) ?? 0 : undefined,
    daysSinceLastInterview: app.lastInterviewAt ? getDayCount(app.lastInterviewAt, Date.now()) ?? 0 : undefined,
});

type AttentionReason = keyof typeof criteria;

const ATTENTION_REASON_META: Record<
    AttentionReason,
    { label: string; description?: string }
> = {
    assessmentPending: {
        label: "Assessment pending",
        description: "Set a deadline or complete the assessment.",
    },
    assessmentMissed: {
        label: "Assessment deadline missed",
        description: "Follow up or mark outcome.",
    },
    upcomingInterview: {
        label: "Interview coming up",
        description: "Prepare and confirm schedule.",
    },
    thankYouEmailDue: {
        label: "Send thank-you email",
        description: "Interview happened recently and email is not sent.",
    },
    noCallbackAfterInterview: {
        label: "No callback after interview",
        description: "Consider follow-up message.",
    },
    expiringOffer: {
        label: "Offer deadline approaching",
        description: "Review and respond before deadline.",
    },
    staleFourteenDays: {
        label: "No response for 14+ days",
        description: "Nudge recruiter.",
    },
    staleThirtyDays: {
        label: "No response for 30+ days",
        description: "Consider marking as ghosted.",
    },
};

const findAttentionReasons = (app: Application): AttentionReason[] => {
    const enriched = enrichApp(app);
    return (Object.entries(criteria) as [AttentionReason, (a: NeedsAttentionContext) => boolean][])
        .filter(([_, predicate]) => predicate(enriched))
        .map(([key]) => key);
};


export function NeedsAttention({ applications }: NeedsAttentionProps) {
    const filtered_apps = applications
        .map((app) => ({
            app,
            reasons: findAttentionReasons(app),
        }))
        .filter(({ reasons }) => reasons.length > 0);

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row justify-between w-full">
                <CardTitle>Needs Attention</CardTitle>
                <Badge>{filtered_apps.length}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col h-full space-y-2">
                {
                    filtered_apps.length > 0
                        ? filtered_apps.map(({ app, reasons }) => (
                            <NeedsAttentionItem key={app._id} application={app} reasons={reasons} />
                        ))
                        : <NeedsAttentionEmpty />
                }
            </CardContent>
        </Card>
    );
}

interface NeedsAttentionItemProps {
    application: Application;
    reasons: AttentionReason[];
}

function NeedsAttentionItem({ application, reasons }: NeedsAttentionItemProps) {
    const { _id: appId, company, role } = application;
    return (
        <Link href={`/dashboard/board?appId=${appId}`}>
        <Card className="bg-gray-50 border rounded-sm">
            <CardHeader className="flex flex-col w-full">
                <div className="flex flex-row w-full items-start justify-between">
                    <span>
                        <CardTitle>{company}</CardTitle>
                        <CardDescription className="text-xs">{role}</CardDescription>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {reasons.map((reason) => (
                                <Badge key={reason} variant="outline" className="text-xs">
                                    {ATTENTION_REASON_META[reason].label}
                                </Badge>
                            ))}
                        </div>
                    </span>
                    <CardAction>
                        <Button>
                            Test
                        </Button>
                    </CardAction>
                </div>
            </CardHeader>
        </Card>
        </Link>

    );
}

//! Tightly coupled with NeedsAttention
function NeedsAttentionEmpty() {
    return (
        <>
            <Empty className="w-full h-full">
                <EmptyContent className="flex flex-col h-full items-center justify-center">
                    <EmptyHeader className="flex flex-col">
                        <EmptyMedia variant={'icon'}>
                            <Megaphone />
                        </EmptyMedia>
                        <EmptyTitle>No applications require your attention yet</EmptyTitle>
                        <EmptyDescription className="text-xs">You don't have anything in your applications that require your immediate attention for now. Apply some more!</EmptyDescription>
                    </EmptyHeader>
                </EmptyContent>
            </Empty>
        </>
    )
}