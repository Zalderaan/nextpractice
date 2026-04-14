import { Suspense } from "react";
import { getApplications } from "@/lib/applications";
import { getAuthContext } from "@/lib/auth";
import { ApplicationsByStage } from "./_components/ApplicationsByStage";
import { StatCards } from "./_components/StatCards";
import DashboardHomeLoading from "./loading";
import { Application } from "./types/application.types";
import { NeedsAttention } from "./_components/NeedsAttention";
import { ApplicationsOverTime } from "./_components/ApplicationsOverTime";
import { EffortVsResult } from "./_components/EffortVsResult";

export default function DashboardHomePage() {
    return (
        <Suspense fallback={<DashboardHomeLoading />}>
            <DashboardHomeContent />
        </Suspense>
    );
}

async function DashboardHomeContent() {
    const { userId, token } = await getAuthContext();
    const data = await getApplications(userId, token);
    const applications: Application[] = data.data.applications;

    return (
        <div className="min-h-full w-full p-(--dashboard-pages-padding)">
            <div className="h-full grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12 auto-rows-[minmax(180px,auto)]">
                <section className="col-span-full">
                    <StatCards applications={applications} />
                </section>

                <section className="md:col-span-6 xl:col-span-8">
                    <ApplicationsOverTime applications={applications} />
                </section>

                <section className="md:col-span-6 xl:col-span-4 row-span-2" >
                    <NeedsAttention applications={applications} />
                </section>
                <section className="md:col-span-3 xl:col-span-3" >
                    <ApplicationsByStage applications={applications} />
                </section>
                <section className="md:col-span-3 xl:col-span-5">
                    <EffortVsResult applications={applications}/>
                </section>
            </div>
        </div>
    );
}