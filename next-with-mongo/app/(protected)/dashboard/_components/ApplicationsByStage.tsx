import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Application, APPLICATION_STATUSES } from "../board/types/application.types";
import { ApplicationStatus } from "../board/types/application.types";

interface absItemProps {
    status: string,
    amount: number,
    percent: number
}

interface ApplicationsByStageProps {
    applications: Application[];
}

function AbsItem({ status, amount, percent }: absItemProps) {
    return (
        <div className="w-full flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between">
                <span>{status}</span>
                <span>{amount}</span>
            </div>
            <div className="h-2 w-full rounded bg-muted overflow-hidden">
                <div
                    className="h-full bg-primary"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    )
}

export function ApplicationsByStage({ applications }: ApplicationsByStageProps) {
    console.log("This is applications in ABS.tsx: ", applications)
    const total = applications.length || 1;
    const safeApplications = Array.isArray(applications) ? applications : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Applications by Stage
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full">
                <div id="absItemContainer" className="flex flex-col space-y-4">
                    {/* status.map() */}
                    {APPLICATION_STATUSES.map((app_status) => {
                        const amount = safeApplications.filter(
                            (app) => app.status === app_status
                        ).length;

                        const percent = Math.round((amount / total) * 100);

                        return (
                            <AbsItem
                                key={app_status}
                                status={app_status}
                                amount={amount}
                                percent={percent}
                            />
                        )
                    })}
                </div>

            </CardContent>
        </Card>
    )
}