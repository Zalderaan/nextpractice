"use client"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Application, AttentionReason, NeedsAttentionState } from "../types/application.types"
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
import { enrichApp, getDayCount, NeedsAttentionContext, isSnoozed } from "../applications.utils";
import { useDismissReasonDialogStore } from "../_stores/dismiss-reason-dialog.store";
import { DismissNotification } from "./DismissNotification";


/**
 * A callback with a series of conditions (business logic) to determine for each criterion (AttentionReason)
 * @params app: NeedsAttentionContext
 * @returns boolean
 */
type CriteriaPredicate = (app: NeedsAttentionContext) => boolean

// assign a CriteriaPredicate to determine each AttentionReason in a key-value pair format
type CriteriaRecord = Record<AttentionReason, CriteriaPredicate>
const criteria: CriteriaRecord = {
    // 1. Time-sensitive
    assessmentPending: (app) => app.status === "applied" && app.assessmentStatus === "pending",
    assessmentMissed: (app) => app.status === "applied" && app.assessmentStatus === "missed",
    missingInterviewDate: (app) => app.status === "interview" && !app.nextInterviewAt && !app.lastInterviewAt,
    upcomingInterview: (app) =>
        app.status === "interview" &&
        !!app.nextInterviewAt &&
        new Date(app.nextInterviewAt).getTime() < (Date.now() + 7 * 24 * 60 * 60 * 1000),

    // 2. Strategic follow-ups
    thankYouEmailDue: (app) =>
        app.status === "interview" &&
        !app.thankYouEmailSent &&
        app.lastInterviewAt !== null &&
        getDayCount(app.lastInterviewAt, Date.now()) === 0,

    noCallbackAfterInterview: (app) =>
        app.status === "interview" &&
        app.daysSinceLastInterview !== undefined &&
        app.daysSinceLastInterview >= 7,

    // 3. Offer & Negotiation
    missingOfferDeadline: (app) =>
        app.status === "offer" && !app.offerDeadline,

    expiringOffer: (app) =>
        app.status === "offer" &&
        !!app.offerDeadline &&
        new Date(app.offerDeadline).getTime() < (Date.now() + 3 * 24 * 60 * 60 * 1000),

    // 4. Stale rules
    staleFourteenDays: (app) =>
        app.status === "applied" &&
        app.appliedAt !== null &&
        (app.daysSinceApplied ?? 0) >= 14 &&
        !app.nudgedAt,

    staleThirtyDays: (app) =>
        app.status === "applied" &&
        app.appliedAt !== null &&
        (app.daysSinceApplied ?? 0) >= 30,
};

// contains label and descriptions for an AttentionReason
type AttentionReasonData = {
    label: string;
    description?: string;
}

// assign label & descriptions associated with each AttentionReason
const ATTENTION_REASON_META: Record<AttentionReason, AttentionReasonData> = {
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

/**
 * Function to find AttentionReasons in an Application
 * @params app: Application
 * @returns AttentionReason[]
 */
const findAttentionReasons = (app: Application): AttentionReason[] => {
    const enriched = enrichApp(app);
    return (Object.entries(criteria) as [AttentionReason, CriteriaPredicate][])
        .filter(
            ([_, predicate]) => predicate(enriched) // call the predicate function
        )
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

    // console.log("This is filtered_apps: ", filtered_apps)

    return (
        <>
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
            <DismissNotification />
        </>
    );
}

interface NeedsAttentionItemProps {
    application: Application;
    reasons: AttentionReason[];
}

function NeedsAttentionItem({ application, reasons }: NeedsAttentionItemProps) {
    const { _id: appId, company, role, status, attentionStates } = application;
    console.log("attentionStates: ", attentionStates);
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
                        <NeedsAttentionItemReason
                            key={reason}
                            reason={ATTENTION_REASON_META[reason].label}
                            attentionStates={attentionStates}
                            application={application}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function NeedsAttentionItemReason({ reason, application, attentionStates }: { reason: string, application: Application, attentionStates?: NeedsAttentionState[] }) {
    const { openDialog } = useDismissReasonDialogStore();

    const reasonState = attentionStates?.find((state) => state.reason === reason);

    if (reasonState?.isDismissed) return; // if dismissed permanently
    if (isSnoozed(reasonState?.snoozedUntil)) return; // if snoozed

    // if not dismissed and isSnoozed == false
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
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="h-7 w-7"
                        title="Dismiss for this application"
                        onClick={() => openDialog(application, reason)}>
                        <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant={"ghost"} size={"icon"} className="h-7 w-7" title="Edit details" asChild>
                        <Link href={`/dashboard/board?appId=${application._id}`}>
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