import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Application, APPLICATION_STATUSES } from "../board/types/application.types";
import { ApplicationStatus } from "../board/types/application.types";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FolderOpen, SquareKanban, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"

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
        <div className="w-full flex flex-col space-y">
            <div className="flex flex-row items-center justify-between">
                <span className="text-xs">{status}</span>
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
    // console.log("This is applications in ABS.tsx: ", applications)
    const total = applications.length || 1;
    const safeApplications = Array.isArray(applications) ? applications : [];

    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle>
                    Applications by Stage
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full">
                {
                    safeApplications && safeApplications.length > 0 ? (
                        <div id="absItemContainer" className="flex flex-col flex-1 h-full items-stretch justify-between">
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
                    ) : (
                        <ApplicationsByStageEmpty />
                    )
                }


            </CardContent>
        </Card>
    )
}

function ApplicationsByStageEmpty() {
    return (
        <>
            <Empty className="w-full h-full">
                <EmptyHeader>
                    <EmptyMedia variant={'icon'}>
                        <FolderOpen />
                    </EmptyMedia>
                    <EmptyTitle>Nothing here... for now</EmptyTitle>
                    <EmptyDescription className="text-xs">You haven’t added any applications yet. Start by adding one in Table or Board view.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex flex-row justify-center space-x-">
                    <Link href="/dashboard/applications" className="asChild">
                        <Button className="space-x" variant={"secondary"}>
                            <Table />
                            <span>Table View</span>
                        </Button>
                    </Link>

                    <Link href="/dashboard/board" className="asChild">
                        <Button className="space-x">
                            <SquareKanban />
                            <span>Board View</span>
                        </Button>
                    </Link>
                </EmptyContent>
            </Empty>
        </>
    )
}