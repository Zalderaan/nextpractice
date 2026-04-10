import { Skeleton } from "@/components/ui/skeleton";

function StatCardsSkeleton() {
    return (
        <div className="flex h-full w-full items-center justify-between space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-full w-full rounded-xl border bg-background p-4">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="mt-6 h-8 w-16 rounded-md" />
                </div>
            ))}
        </div>
    );
}

function ApplicationsByStageSkeleton() {
    return (
        <div className="h-full rounded-xl border bg-background p-4">
            <Skeleton className="h-6 w-48 rounded-md" />
            <div className="mt-6 space-y-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-4 w-8 rounded-md" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function WidgetSkeleton() {
    return (
        <div className="h-full rounded-xl border bg-background p-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="mt-4 h-4 w-full rounded-md" />
            <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
            <Skeleton className="mt-6 h-24 w-full rounded-md" />
        </div>
    );
}

export default function DashboardHomeLoading() {
    return (
        <main className="h-full w-full p-(--dashboard-pages-padding)">
            <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12">
                <section className="col-span-full">
                    <StatCardsSkeleton />
                </section>

                <section className="md:col-span-6 xl:col-span-8">
                    <ApplicationsByStageSkeleton />
                </section>

                <section className="md:col-span-6 xl:col-span-4">
                    <WidgetSkeleton />
                </section>

                <section className="md:col-span-3 xl:col-span-6">
                    <WidgetSkeleton />
                </section>

                <section className="md:col-span-3 xl:col-span-6">
                    <WidgetSkeleton />
                </section>
            </div>
        </main>
    );
}