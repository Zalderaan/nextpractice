import { getApplications } from "@/lib/applications";
import { getAuthContext } from "@/lib/auth";
import { ApplicationsByStage } from "./_components/ApplicationsByStage";
import { Suspense } from "react";
import { StatCards } from "./_components/StatCards";

export default async function DashboardHomePage() {
    return (
        <main className="h-full w-full p-(--dashboard-pages-padding)">
            <Suspense fallback={<div>Loading...</div>}>
                <DashboardHomePageContent />
            </Suspense>
        </main>
    );
}

async function DashboardHomePageContent() {
    const { userId, token } = await getAuthContext();
    const data = await getApplications(userId, token);
    const applications = data.data.applications;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12 auto-rows-[minmax(180px,auto)] bg-blue-200">
            <section className="col-span-full bg-red-200">
                <StatCards applications={applications}/>
            </section>

            <section className="md:col-span-6 xl:col-span-8 bg-yellow-200">
                <ApplicationsByStage applications={applications} />
            </section>

            <section className="md:col-span-6 xl:col-span-4 bg-red-200">
                {/* Side widget */}
            </section>


            <section className="md:col-span-3 xl:col-span-6 bg-violet-200">
                {/* Secondary widget */}
            </section>

            <section className="md:col-span-3 xl:col-span-6 bg-orange-200">
                {/* Secondary widget */}
            </section>
        </div>
    );
}