'use client'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Draggable, Droppable } from '@hello-pangea/dnd' // [!code ++]
import { PlusIcon } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { Application } from "./ApplicationCard";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
    status: string;
    applications: Application[];
    onSelect: (app: Application) => void; // Make this required
}

export function KanbanColumn({ status, applications, onSelect }: KanbanColumnProps) {
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

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <CardContent
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 space-y-2 overflow-y-auto min-h-0 py-2 transition-colors ${snapshot.isDraggingOver ? 'bg-accent/50' : ''}`}
                    >
                        {applications.map((app, index) => (
                            <Draggable key={app._id} draggableId={app._id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <ApplicationCard
                                            application={app}
                                            onClick={() => onSelect(app)}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder} {/* Required to keep space open */}
                    </CardContent>
                )}
            </Droppable>
        </Card>
    );
}