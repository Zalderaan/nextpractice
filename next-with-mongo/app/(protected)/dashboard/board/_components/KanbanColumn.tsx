'use client'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { Application } from "./ApplicationCard";
import { Badge } from "@/components/ui/badge";

// dnd-kit imports
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableApplicationCard } from "./SortableApplicationCard";
import { useMemo } from "react";

interface KanbanColumnProps {
    status: string;
    applications: Application[];
    onSelect: (app: Application) => void; // Make this required
}

export function KanbanColumn({ status, applications, onSelect }: KanbanColumnProps) {
    // this column should be a drop target
    const { setNodeRef, isOver } = useDroppable({
        id: status,
        data: {
            type: "Column",
            status: status
        }
    })

    const applicationIds = useMemo(() => applications.map(app => app._id), [applications]);

    return (
        <Card className="flex flex-col min-w-[320px] max-h-full shrink-0 overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between shrink-0 border-b h-full">
                <div className="flex flex-row space-x-2 item-center justify-start">
                    <CardTitle className="capitalize">{status}</CardTitle>
                    <Badge className="text-sm">{applications.length}</Badge>
                </div>

                <CardAction onClick={() => console.log(`Add application to ${status} clicked`)}>
                    <PlusIcon />
                </CardAction>
            </CardHeader>
            <CardContent
                ref={setNodeRef}
                className={`flex-1 space-y-2 overflow-y-auto min-h-0 py-2 transition-colors ${isOver ? 'bg-accent/50' : ''}`}
            >
                {/* Wrap the list in SortableContext */}
                <SortableContext items={applicationIds} strategy={verticalListSortingStrategy}>
                    {applications.map((app) => (
                        <SortableApplicationCard
                            key={app._id}
                            application={app}
                            onClick={() => onSelect(app)}
                        />
                    ))}
                </SortableContext>
            </CardContent>
        </Card>
    );
}