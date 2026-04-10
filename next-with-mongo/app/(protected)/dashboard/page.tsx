import { Suspense } from "react";
import { getApplications } from "@/lib/applications";
import { getAuthContext } from "@/lib/auth";
import { ApplicationsByStage } from "./_components/ApplicationsByStage";
import { StatCards } from "./_components/StatCards";
import DashboardHomeLoading from "./loading";
import { Application } from "./board/types/application.types";
import { NeedsAttention } from "./_components/NeedsAttention";

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
        <main className="h-full w-full p-(--dashboard-pages-padding)">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12 auto-rows-[minmax(180px,auto)]">
                <section className="col-span-full">
                    <StatCards applications={applications} />
                </section>

                <section className="md:col-span-6 xl:col-span-8">
                    <ApplicationsByStage applications={applications} />
                </section>

                <section className="md:col-span-6 xl:col-span-4 bg-yellow-200" >
                    <NeedsAttention applications={applications} />
                </section>
                <section className="md:col-span-3 xl:col-span-6 bg-yellow-200" />
                <section className="md:col-span-3 xl:col-span-6 bg-yellow-200" />
            </div>
        </main>
    );
}