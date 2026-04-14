import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Application } from "../types/application.types"
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
import { ExternalLink, Megaphone, MoreHorizontal, X } from "lucide-react";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

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

// Enrich app with computed fields once
const enrichApp = (app: Application): NeedsAttentionContext => ({
    ...app,
    daysSinceApplied: app.appliedAt ? getDayCount(app.appliedAt, Date.now()) ?? 0 : undefined,
    daysSinceLastInterview: app.lastInterviewAt ? getDayCount(app.lastInterviewAt, Date.now()) ?? 0 : undefined,
});

const criteria = {
    // 1. Time-sensitive
    assessmentPending: (app: NeedsAttentionContext) => app.status === "applied" && app.assessmentStatus === "pending",

    assessmentMissed: (app: NeedsAttentionContext) => app.status === "applied" && app.assessmentStatus === "missed",

    missingInterviewDate: (app: NeedsAttentionContext) =>
        app.status === "interview" && !app.nextInterviewAt && !app.lastInterviewAt,

    upcomingInterview: (app: NeedsAttentionContext) =>
        app.status === "interview" && app.nextInterviewAt && new Date(app.nextInterviewAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

    // 2. Strategic follow-ups
    thankYouEmailDue: (app: NeedsAttentionContext) =>
        app.status === "interview" &&
        !app.thankYouEmailSent &&
        app.lastInterviewAt &&
        getDayCount(app.lastInterviewAt, Date.now()) === 0 // same day
    ,

    noCallbackAfterInterview: (app: NeedsAttentionContext) =>
        app.status === "interview" &&
        app.daysSinceLastInterview !== undefined &&
        app.daysSinceLastInterview >= 7
    ,

    // 3. Offer & Negotiation
    missingOfferDeadline: (app: NeedsAttentionContext) =>
        app.status === "offer" && !app.offerDeadline,

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
    missingInterviewDate: {
        label: "No interview date entered",
        description: "You haven't entered a date for your initial interview"
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
    missingOfferDeadline: {
        label: "No offer deadline entered",
        description: "Consider adding an offer deadline."
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

interface NeedsAttentionProps {
    applications: Application[]
}

export function NeedsAttention({ applications }: NeedsAttentionProps) {
    const filtered_apps = applications
        .map((app) => ({
            app,
            reasons: findAttentionReasons(app),
        }))
        .filter(({ reasons }) => reasons.length > 0);

        console.log("This is filtered_apps: ", filtered_apps)

    return (
        <Card className="w-full h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row justify-between w-full border-b">
                <CardTitle>Needs Attention</CardTitle>
                <Badge>{filtered_apps.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 py-2 overflow-y-auto">
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
    const { _id: appId, company, role, status } = application;
    return (
        <Card className="flex flex-col border rounded-sm w-full">
            <CardHeader className="flex flex-col w-full">
                <div className="flex flex-row w-full justify-between capitalize">
                    <CardTitle>{company}</CardTitle>
                    <Badge>{status}</Badge>
                </div>
                <CardDescription className="text-xs">{role}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <div className="flex flex-col flex-1 w-full gap-1 mt-2">
                    {reasons.map((reason) => (
                        <NeedsAttentionItemReason key={reason}
                            reason={ATTENTION_REASON_META[reason].label}
                            appId={appId}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function NeedsAttentionItemReason({ reason, appId }: { reason: string, appId: string }) {
    return (
        <div className="group flex w-full border text-xs items-center justify-between rounded-lg px-4 py-2">
            <span>{reason}</span>

            {/* Relative wrapper keeps the height consistent to avoid layout shift */}
            <div className="relative flex items-center h-8">

                {/* Visual Cue: 3 dots, fades out on hover */}
                <div className="absolute right-2 flex items-center opacity-100 group-hover:opacity-0 transition-opacity duration-150 text-muted-foreground/50 pointer-events-none">
                    <MoreHorizontal className="h-4 w-4" />
                </div>

                {/* Actions: Fade in on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-row items-center gap-1 shrink-0 relative z-10">
                    <Button variant={"ghost"} size={"icon"} className="h-7 w-7" title="Remind me tomorrow">
                        <Megaphone className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="h-7 w-7" title="Dismiss for this application">
                        <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="h-7 w-7" title="Edit details" asChild>
                        <Link href={`/dashboard/board?appId=${appId}`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>

            </div>
        </div>
    )
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