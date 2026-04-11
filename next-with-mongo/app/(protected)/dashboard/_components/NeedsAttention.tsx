import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Application } from "../board/types/application.types"
import { Button } from "@/components/ui/button";

interface NeedsAttentionProps {
    applications: Application[]
}

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

function getStaleAppliedApplications(applications: Application[], staleDays: number): NeedsAttentionApp[] {
    const nowMs = Date.now();

    return applications.flatMap((app) => {
        if (app.status !== "applied") return [];

        const day_count = getDayCount(app.appliedAt, nowMs);
        if (day_count === null) return [];
        if (day_count < staleDays) return [];

        return [{ ...app, day_count }];
    });
}


export function NeedsAttention({ applications }: NeedsAttentionProps) {
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
     *          - 30-day stale | action: move to archive (?) | would need to implement ghosted status
    */
    const filtered_apps = getStaleAppliedApplications(applications, 14);

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row justify-between w-full">
                <CardTitle> Needs Attention </CardTitle>
                <Badge>{filtered_apps.length}</Badge>
                <Badge>{filtered_apps.length}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                {filtered_apps.map((app) => {
                    return (
                        <NeedsAttentionItem
                            key={app._id}
                            application={app}
                        />
                    )
                })}
            </CardContent>
        </Card>
    )
}

interface NeedsAttentionItemProps {
    application: NeedsAttentionApp;
}

function NeedsAttentionItem({ application }: NeedsAttentionItemProps) {
    const { company, role, status, day_count, nudgedAt } = application
    console.log(`${company}: ${nudgedAt}`)
    return (
        <Card className="bg-gray-50 border rounded-sm">
            <CardHeader className="flex flex-col w-full">
                {/* Top row */}
                <div className="flex flex-row w-full items-start justify-between">
                    <span>
                        <CardTitle>{company}</CardTitle>
                        <CardDescription className="text-xs">{role}</CardDescription>
                    </span>
                    <span>
                        {nudgedAt === null ? (
                            <CardAction>
                                <Button size={"xs"}>
                                    Mark as nudged
                                </Button>
                            </CardAction>
                        ) : (
                            <Badge>
                                Nudged
                            </Badge>
                        )}
                    </span>
                </div>
                {/* Bottom Row */}
                <div className="flex flex-row w-full items-center justify-between">
                    <div className="flex flex-row w-full items-center justify-between text-xs">
                        <span>{status.charAt(0).toLocaleUpperCase() + status.slice(1)}</span>
                        <span>
                            {
                                day_count
                                    ? <span>{`${day_count} days ago`}</span>
                                    : "?? days ago"
                            }
                        </span>
                    </div>
                    <CardHeader className="flex flex-col w-full">
                        {/* Top row */}
                        <div className="flex flex-row w-full items-start justify-between">
                            <span>
                                <CardTitle>{company}</CardTitle>
                                <CardDescription className="text-xs">{role}</CardDescription>
                            </span>
                            <span>
                                {nudgedAt === null ? (
                                    <CardAction>
                                        <Button size={"xs"}>
                                            Mark as nudged
                                        </Button>
                                    </CardAction>
                                ) : (
                                    <Badge>
                                        Nudged
                                    </Badge>
                                )}
                            </span>
                        </div>
                        {/* Bottom Row */}
                        <div className="flex flex-row w-full items-center justify-between">
                            <div className="flex flex-row w-full items-center justify-between text-xs">
                                <span>{status.charAt(0).toLocaleUpperCase() + status.slice(1)}</span>
                                <span>
                                    {
                                        day_count
                                            ? <span>{`${day_count} days ago`}</span>
                                            : "?? days ago"
                                    }
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                </div>
            </CardHeader>
        </Card>
    )
}