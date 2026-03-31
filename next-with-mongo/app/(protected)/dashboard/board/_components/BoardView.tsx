'use client'

import React, { useCallback, useMemo, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application, ApplicationStatus } from './ApplicationCard'
import { ApplicationSheet } from './ApplicationDetailsSheet'
import { DragDropContext, DropResult } from '@hello-pangea/dnd' // [!code ++]
import { updateApplicationStatusAction } from '../actions'

type Props = {
    applications: Application[];
}

export default function BoardView({ applications }: Props) {
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
    const [isDraggingCard, setIsDraggingCard] = useState(false);
    const handleSelect = useCallback((app: Application) => {
        setSelectedAppId(app._id)
    }, [])
    const selectedApp = applications.find(app => app._id === selectedAppId) || null;

    const closeDrawer = useCallback(() => setSelectedAppId(null), [])

    const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus, newOrder: number) => {
        const result = await updateApplicationStatusAction(id, { newStatus, newOrder });
        console.log("this is newStatus: ", newStatus)
        console.log("this is newOrder: ", newOrder)
        if (!result.success) {
            // Handle error (e.g., show a toast notification)
            console.error('Update failed:', result.error);
            console.error('Error details: ', result.details);
        }
    };
    const statuses = useMemo(() => ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const, [])

    const onDragStart = () => { setIsDraggingCard(true) }
    const onDragEnd = (result: DropResult) => {
        setIsDraggingCard(false);
        const { destination, source, draggableId } = result;
        if (!destination) return;

        // Dropped outside a list or in the same spot
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        // 1. Get the list of applications in the destination column, excluding the dragged item
        const destColumnApps = applications
            .filter(app => app.status === destination.droppableId && app._id !== draggableId)
            .sort((a, b) => a.order - b.order);


        let newOrder: number;

        const prevApp = destColumnApps[destination.index - 1];
        const nextApp = destColumnApps[destination.index];

        if (!prevApp && !nextApp) {
            // Column was empty
            newOrder = 1000;
        } else if (!prevApp) {
            // Dropped at the very top
            newOrder = nextApp.order / 2;
        } else if (!nextApp) {
            // Dropped at the very bottom
            newOrder = prevApp.order + 1000;
        } else {
            // Dropped between two cards
            // midpoint strat
            newOrder = (prevApp.order + nextApp.order) / 2;
        }

        // 2. Call server action
        // The droppableId will be the status name (e.g., "applied")
        const newStatus = destination.droppableId as ApplicationStatus;
        handleUpdateStatus(draggableId, newStatus, newOrder);
    };

    return (
        <>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <BoardClient
                    className="min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none"
                    isDraggingCard={isDraggingCard}
                >
                    <div className="flex w-max flex-row items-start gap-4 h-full">
                        {statuses.map((status) => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                applications={applications
                                    .filter((a) => a.status === status)
                                    .sort((a, b) => a.order - b.order)  // Sort by order ascending
                                }
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                </BoardClient>
                <ApplicationSheet
                    selectedApp={selectedApp}
                    onClose={closeDrawer}
                />
            </DragDropContext>
        </>
    )
}