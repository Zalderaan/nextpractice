import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application } from "../types/application.types";

interface EVRProps {
    applications: Application[]
}

export function EffortVsResult({ applications }: EVRProps) {
    const nonWishlist = applications.filter(a => a.status !== "wishlist")

    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Effort vs. Result
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full justify-between">
                <EffortToInterview applications={nonWishlist} />
                <ConversionFunnel applications={nonWishlist} />
            </CardContent>
        </Card>
    )
}

function EffortToInterview({ applications }: { applications: Application[] }) {
    const total_apps = applications.length
    const total_interviews = applications.filter(a => a.status === "interview").length
    const ratio = total_interviews === 0 ? null : Math.round(total_apps / total_interviews)

    return (
        <Card className="px-3 py-2 flex flex-col gap-0.5">
            <div className="flex flex-row items-center justify-between">
                <span className="text-xs font-medium">Effort-to-interview</span>
                <span className="text-sm font-semibold">
                    {ratio === null ? "N/A" : `${ratio}:1`}
                </span>
            </div>
            <p className="text-xs text-muted-foreground">
                {ratio === null
                    ? "No interviews yet — keep applying."
                    : `You send ${ratio} application${ratio === 1 ? "" : "s"} for every interview you land.`}
            </p>
        </Card>
    )
}

function GhostRate({ applications }: { applications: Application[] }) {
    const total = applications.length
    const ghosted = applications.filter(a => a.status === "ghosted").length
    const rate = total === 0 ? 0 : Math.round((ghosted / total) * 100)

    return (
        <Card className="px-3 py-2 flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between">
                <span className="text-xs font-medium">Ghost rate</span>
                <span className="text-sm font-semibold">{rate}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-destructive transition-all"
                    style={{ width: `${rate}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground">
                {ghosted === 0
                    ? "No ghosts yet — every company has responded."
                    : `${ghosted} of ${total} companies never replied.`}
            </p>
        </Card>
    )
}

function ConversionFunnel({ applications }: { applications: Application[] }) {
    const total = applications.length
    const interviews = applications.filter(a => a.status === "interview").length
    const offers = applications.filter(a => a.status === "offer").length

    const interviewRate = total === 0 ? 0 : Math.round((interviews / total) * 100)
    const offerRate = interviews === 0 ? 0 : Math.round((offers / interviews) * 100)

    const stages = [
        { label: "Applied", count: total, rate: 100, color: "bg-blue-500" },
        { label: "Interviewed", count: interviews, rate: interviewRate, color: "bg-emerald-500" },
        { label: "Offered", count: offers, rate: offerRate, color: "bg-violet-500" },
    ]

    return (
        <Card className="px-3 py-2 flex flex-col gap-2">
            <span className="text-xs font-medium">Conversion funnel</span>
            <div className="flex flex-col gap-1.5">
                {stages.map((stage, i) => (
                    <div key={stage.label} className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{stage.label}</span>
                            <span className="text-xs font-medium">
                                {stage.count}
                                {i > 0 && (
                                    <span className="text-muted-foreground font-normal ml-1">
                                        ({stage.rate}%)
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${stage.color}`}
                                style={{ width: `${stage.rate}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">
                {interviewRate === 0
                    ? "No interviews yet — your resume may need refinement."
                    : offerRate === 0
                        ? "Getting interviews but no offers yet — focus on interview prep."
                        : `${offerRate}% of your interviews are converting to offers.`}
            </p>
        </Card>
    )
}