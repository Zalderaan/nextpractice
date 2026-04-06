import { SheetHeader, SheetFooter } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationSheetSkeleton() {
    return (
        <>
            {/* Header Skeleton */}
            <SheetHeader className="px-6 py-4 space-y-2 border-b shrink-0">
                <div className="flex gap-3 items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
            </SheetHeader>

            {/* Main Content Skeleton */}
            <main className="flex-1 overflow-y-auto px-6 p-4 space-y-8">
                {/* Buttons */}
                <div className="flex gap-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                    <Skeleton className="h-4 w-16" />
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </main>

            {/* Footer Skeleton */}
            <SheetFooter className="px-6 py-4 border-t shrink-0 flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
            </SheetFooter>
        </>
    )
}