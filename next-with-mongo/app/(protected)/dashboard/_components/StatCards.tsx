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
import { ReactNode } from "react";

type StatisticsType = {
    title: string,
    value: number,
    description?: string | ReactNode,
    accent?: string,
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
            value: total,
            description: "applications",
            accent: "gray",
        },
        {
            title: "Applied this week",
            value: applied_week_count,
            description: "applied",
            accent: "blue"
        },
        {
            title: "Interviews",
            value: interview_count,
            description: `of ${total} applied`,
            accent: "purple"
        },
        {
            title: "Offers",
            value: offer_count,
            description: `of ${interview_count} interviewed`,
            accent: "green",
        },
        {
            title: "Interview rate",
            value: interview_rate,
            description: (
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mt-2">
                    <div
                        className={`bg-orange-600 h-2.5 rounded-full`}
                        style={{ width: `${Math.min(interview_rate || 0, 100)}%` }}
                    />
                </div>
            ),
            accent: "orange",
            formatter: (value) => `${value.toFixed(1)}%`
        }]

    return (
        <div className="flex space-x-2 w-full h-full items-center justify-between">
            {
                statistics.map((stat) => (
                    <OneStatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        accent={stat.accent}
                        formatter={stat.formatter}
                    />
                ))
            }
        </div>
    )
}

function OneStatCard({ title, value, description, formatter, accent }: StatisticsType) {
    const displayValue = formatter ? formatter(value) : value;

    const borderColors: Record<string, string> = {
        gray: "border-gray-600",
        blue: "border-blue-600",
        purple: "border-purple-600",
        green: "border-green-600",
        orange: "border-orange-600",
    };

    // Fallback to gray if accent is missing or mistyped
    const borderColorClass = borderColors[accent || "gray"] || "border-gray-600";

    return (
        <Card className={`flex flex-col justify-around w-full h-full p-4 border-t-4 ${borderColorClass}`}>
            <p>{title.toLocaleUpperCase()}</p>
            <h1 className="text-6xl">{displayValue}</h1>
            {description && typeof description === "string" ? (
                <p className="text-gray-600">{description}</p>
            ) : (
                description
            )}
        </Card>
    )
}