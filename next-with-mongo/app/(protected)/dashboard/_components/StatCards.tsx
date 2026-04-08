import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Application } from "../board/types/application.types";

type StatisticsType = {
    title: string,
    value: number,
    formatter?: (value: number) => string;
}

interface StatCardsProps {
    applications: Application[]
}

function countAppliedInLastDays(applications: Application[], days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return applications.filter((app) => {
        app.appliedAt && app.appliedAt >= cutoff
    });
}

export function StatCards({ applications }: StatCardsProps) {
    const total = applications.length;
    const applied_week_count = countAppliedInLastDays(applications, 7).length; //! not calculating correctly at the moment
    const interview_count = applications.filter((app) => {
        return app.status === "interview"
    }).length
    const offer_count = applications.filter((app) => {
        return app.status === "offer"
    }).length
    const interview_rate = (interview_count / total) * 100;

    const statistics: StatisticsType[] = [
        {
            title: "Total Applications",
            value: total
        },
        {
            title: "Applied this week",
            value: applied_week_count
        },
        {
            title: "Interviews",
            value: interview_count
        },
        {
            title: "Offers",
            value: offer_count
        },
        {
            title: "Interview rate",
            value: interview_rate,
            formatter: (value) => `${value.toFixed(1)}%`
        }    ] 

    return (
        <div className="flex space-x-2 w-full h-full items-center justify-between">
            {
                statistics.map((stat) => (
                    <OneStatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        formatter={stat.formatter}
                    />
                ))
            }
        </div>
    )
}

function OneStatCard({ title, value, formatter }: StatisticsType) {
    const displayValue = formatter ? formatter(value) : value;
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full">
                <span className="text-2xl font-semibold">
                    {displayValue}
                </span>
            </CardContent>
        </Card>
    )
}