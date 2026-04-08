import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBoardPage() {
    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
                <Skeleton className="h-8 w-40 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
            </div>

            <div className="flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex w-max gap-4">
                    {Array.from({ length: 5 }).map((_, columnIndex) => (
                        <div
                            key={columnIndex}
                            className="flex min-w-[320px] flex-col rounded-xl border bg-background shadow-sm"
                        >
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <Skeleton className="h-5 w-24 rounded-md" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </div>

                            <div className="space-y-3 p-4">
                                {Array.from({ length: 4 }).map((__, cardIndex) => (
                                    <div
                                        key={cardIndex}
                                        className="rounded-lg border p-4"
                                    >
                                        <Skeleton className="h-4 w-3/4 rounded-md" />
                                        <Skeleton className="mt-3 h-3 w-full rounded-md" />
                                        <Skeleton className="mt-2 h-3 w-5/6 rounded-md" />
                                        <div className="mt-4 flex gap-2">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}