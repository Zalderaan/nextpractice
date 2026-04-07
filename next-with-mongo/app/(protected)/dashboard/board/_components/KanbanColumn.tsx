'use client'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/react';
import { PlusIcon } from "lucide-react";
import { ApplicationCard, Application } from "./ApplicationCard";
import { SortableApplicationCard } from "./SortableApplicationCard";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
    status: string;
    applications: Application[];
    onSelect: (app: Application) => void;
}

export function KanbanColumn({ status, applications, onSelect }: KanbanColumnProps) {
    const { isDropTarget, ref } = useDroppable({
        id: status,
        type: 'column',
        accept: 'application',
        data: {
            type: "Column",
            status: status
        }
    });

    const style = isDropTarget ? { background: '#00000030' } : undefined;
    // const applicationIds = applications.map((app) => app._id);

    return (
        <Card className="flex flex-col min-w-[320px] max-h-full shrink-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between shrink-0 border-b h-full">
                <div className="flex flex-row space-x-2 item-center justify-start">
                    <CardTitle className="capitalize">{status}</CardTitle>
                    <Badge className="text-sm">{applications.length}</Badge>
                </div>

                <CardAction onClick={() => console.log(`Add application to ${status} clicked`)}>
                    <PlusIcon />
                </CardAction>
            </CardHeader>

            <div
                ref={ref}
                className={`droppable overflow-y-auto ${isDropTarget ? "active" : ""}`}
            >
                <CardContent className="space-y-2 pb-8">
                    {applications.map((app, index) => (
                        <SortableApplicationCard
                            key={app._id}
                            index={index}
                            application={app}
                            onClick={() => onSelect(app)}
                        />
                    ))}
                </CardContent>
            </div>
        </Card>
    );
}