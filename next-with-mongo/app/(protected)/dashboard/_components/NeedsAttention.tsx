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
    // TODO: filter applications according to criteria
    // TODO: map filtered apps
    const filtered_apps = applications.filter((app) => {
        // no filter for now
        return app
    })

    return (
        <Card className="w-full h-full">
            <CardHeader className="w-full">
                <CardTitle>
                    Needs Attention
                </CardTitle>
                <Badge>
                    2
                </Badge>
            </CardHeader>
            <CardContent className="flex flex-col">
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
        <Card>
            <CardHeader>
                <CardTitle>{company}</CardTitle>
                <CardDescription className="text-xs">{role}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-row items-center justify-center">
                <span>{status}</span>
                <span>{day_count ?? 'day_count missing'}</span>
            </CardFooter>
        </Card>
    )
}