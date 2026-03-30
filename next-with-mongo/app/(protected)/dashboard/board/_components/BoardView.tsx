'use client'

import React, { useCallback, useMemo, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application } from './ApplicationCard'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { Link as LinkIcon } from "lucide-react"
import { deleteApplicationAction } from "@/app/(protected)/dashboard/board/actions";

type Props = {
    applications: Application[]
}

export default function BoardView({ applications }: Props) {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const handleSelect = useCallback((app: Application) => {
        setSelectedApp(app)
    }, [])

    const closeDrawer = useCallback(() => setSelectedApp(null), [])
    const statuses = useMemo(() => ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const, [])

    const {
        _id,
        company, priority, role,
        jobUrl,
    } = selectedApp || {};


    const handleDelete = async () => {
        if (!selectedApp?._id) {
            alert("No application selected to delete.");
            return;
        }

        try {
            const result = await deleteApplicationAction(selectedApp._id);
            if (result.success) {
                closeDrawer();  // Close the sheet
                // Optional: Re-fetch data or show success message
            } else {
                alert(result.error || "Failed to delete application.");
            }
        } catch (error) {
            alert("An unexpected error occurred.");
        }
    };

    console.log("This is applications: ", applications)

    return (
        <>
            <BoardClient className="min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none">
                <div className="flex w-max flex-row items-start gap-4 h-full">
                    {statuses.map((status) => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            applications={applications.filter((a) => a.status === status)}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            </BoardClient>

            <Sheet
                open={!!selectedApp}
                onOpenChange={(open) => {
                    if (!open) closeDrawer()
                }}
            >
                <SheetContent className="w-full sm:max-w-135 flex flex-col p-0 overflow-hidden">
                    {selectedApp && (
                        <>
                            {/* HEADER: Pinned to top */}
                            <SheetHeader className="px-6 py-4 border-b shrink-0">
                                <div className="flex flex-row items-center space-x-3">
                                    <SheetTitle className="text-xl">{company}</SheetTitle>
                                    <Badge
                                        variant={priority === 'high' ? 'destructive' : 'secondary'}
                                        className="capitalize"
                                    >
                                        {priority}
                                    </Badge>
                                </div>
                                <SheetDescription className="text-base font-medium text-primary/80">
                                    {role}
                                </SheetDescription>
                            </SheetHeader>

                            {/* MAIN CONTENT: Scrollable area */}
                            <main className="flex-1 overflow-y-auto px-6 py-4 space-y-8">

                                {/* Action Buttons */}
                                <section className="flex items-center w-full gap-3">
                                    <Button className="flex-1" variant="secondary">
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>

                                    {jobUrl ? (
                                        <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                            <Link href={jobUrl} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                View Job
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="flex-1">
                                            <LinkIcon className="w-4 h-4 mr-2" />
                                            No job URL
                                        </Button>
                                    )}
                                </section>

                                {/* Details Grid */}
                                <section className="space-y-3">
                                    <h4 className="text-sm font-semibold text-foreground border-b pb-2">Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground block">Status</span>
                                            <span className="font-medium capitalize">{selectedApp.status}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground block">Work Type</span>
                                            <span className="font-medium capitalize">{selectedApp.workType}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground block">Priority</span>
                                            <span className="font-medium capitalize">{selectedApp.priority}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Notes Box */}
                                <section className="space-y-3">
                                    <h4 className="text-sm font-semibold text-foreground border-b pb-2">Additional Notes</h4>
                                    {selectedApp.notes ? (
                                        <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground whitespace-pre-wrap">
                                            {selectedApp.notes}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No notes provided.</p>
                                    )}
                                </section>

                                {/* Activity Placeholder */}
                                <section className="space-y-3">
                                    <h4 className="text-sm font-semibold text-foreground border-b pb-2">Activity</h4>
                                    <p className="text-sm text-muted-foreground italic">Activity history coming soon...</p>
                                </section>
                            </main>

                            {/* FOOTER: Pinned to bottom */}
                            <SheetFooter className="px-6 py-4 border-t shrink-0 flex flex-row items-center gap-3 sm:space-x-0">
                                <Button className="flex-1" variant="destructive" onClick={() => handleDelete()}>
                                    Delete
                                </Button>
                                <Button className="flex-1">
                                    Save Changes
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}