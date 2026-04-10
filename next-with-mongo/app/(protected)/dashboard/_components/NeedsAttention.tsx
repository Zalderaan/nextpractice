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

interface NeedsAttentionProps {
    applications: Application[]
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
    const filtered_apps = applications.filter((app) => {
        // no filter for now
        return app
    })

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row justify-between w-full">
                <CardTitle> Needs Attention </CardTitle>
                <Badge> 2 </Badge>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                {filtered_apps.map((app) => {
                    // const now = new Date();
                    // const day_count = now.getDate() - app.appliedAt?
                    return (
                        <NeedsAttentionItem
                            key={app._id}
                            company={app.company}
                            role={app.role}
                            status={app.status}
                        // day_count={app.salaryMax}
                        />
                    )
                })}
            </CardContent>
        </Card>
    )
}

interface NeedsAttentionItemProps {
    company: string,
    role: string,
    status: string
    day_count?: string
}

function NeedsAttentionItem({ company, day_count, role, status }: NeedsAttentionItemProps) {
    return (
        <Card className="bg-gray-50 border rounded-sm">
            <CardHeader>
                <CardTitle>{company}</CardTitle>
                <CardDescription className="text-xs">{role}</CardDescription>
                <div className="flex flex-row items-center justify-between text-xs">
                    <span>{status}</span>
                    <span>{day_count ?? 'day_count missing'}</span>
                </div>
            </CardHeader>
        </Card>
    )
}