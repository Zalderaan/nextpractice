'use client'

import React, { useCallback, useMemo, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application, ApplicationStatus } from './ApplicationCard'
import { ApplicationSheet } from './ApplicationDetailsSheet'
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { ApplicationCard } from './ApplicationCard' // For the DragOverlay
import { updateApplicationStatusAction } from '../actions'

type Props = {
    applications: Application[];
}

export default function BoardView({ applications }: Props) {
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
    const [activeApp, setActiveApp] = useState<Application | null>(null);
    const [isDraggingCard, setIsDraggingCard] = useState(false);
    
    const handleSelect = useCallback((app: Application) => {
        setSelectedAppId(app._id)
    }, [])
    const selectedApp = applications.find(app => app._id === selectedAppId) || null;

    const closeDrawer = useCallback(() => setSelectedAppId(null), [])

    const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus, newOrder: number) => {
        // Optimistic UI updates or error handling would go here
        const result = await updateApplicationStatusAction(id, { newStatus, newOrder });
        if (!result.success) {
            console.error('Update failed:', result.error);
        }
    };
    const statuses = useMemo(() => ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const, [])

    // Sensors to differentiate click/drag from horizontal scroll
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require 5px movement before drag activates (allows clicks and horizontal scrolling)
            },
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        setIsDraggingCard(true)
        const { active } = event;
        const app = applications.find(app => app._id === active.id);
        if (app) setActiveApp(app);
    }
    
    // const onDragEnd = (event: DragEndEvent) => {
    //     setIsDraggingCard(false);
    //     setActiveApp(null);

    //     const { active, over } = event;
    //     if (!over || active.id === over.id) return;

    //     const activeStatus = active.data.current?.status as ApplicationStatus;
    //     const overStatus = over.data.current?.status as ApplicationStatus;
    //     const overType = over.data.current?.type;

    //     if (!overStatus || !activeStatus) return;

    //     // Get the column containing the item (with the item included)
    //     const columnApps = applications
    //         .filter(app => app.status === activeStatus)
    //         .sort((a, b) => a.order - b.order);

    //     const activeIndex = columnApps.findIndex(app => app._id === active.id);
    //     let targetIndex: number;

    //     if (activeStatus === overStatus && overType !== "Column") {
    //         const overIndex = columnApps.findIndex(app => app._id === over.id);

    //         if (overIndex >= 0) {
    //             // Dragging upward: insert BEFORE the target
    //             // Dragging downward: insert AFTER the target
    //             targetIndex = activeIndex < overIndex
    //                 ? overIndex + 1  // Moving down → insert after
    //                 : overIndex;     // Moving up → insert before
    //         } else {
    //             targetIndex = columnApps.length - 1;
    //         }
    //     } else {
    //         // ❌ CROSS-COLUMN: Existing logic
    //         const destColumnApps = applications
    //             .filter(app => app.status === overStatus && app._id !== active.id)
    //             .sort((a, b) => a.order - b.order);

    //         if (overType === "Column") {
    //             const lastApp = destColumnApps[destColumnApps.length - 1];
    //             const newOrder = lastApp ? lastApp.order + 1000 : 1000;
    //             handleUpdateStatus(active.id as string, overStatus, newOrder);
    //             return;
    //         }

    //         const overIndex = destColumnApps.findIndex(app => app._id === over.id);
    //         if (overIndex < 0) {
    //             const lastApp = destColumnApps[destColumnApps.length - 1];
    //             const newOrder = lastApp ? lastApp.order + 1000 : 1000;
    //             handleUpdateStatus(active.id as string, overStatus, newOrder);
    //             return;
    //         }

    //         targetIndex = overIndex;
    //     }

    //     // ✅ Calculate new order based on target position in the column
    //     const prevApp = columnApps[targetIndex - 1];
    //     const nextApp = columnApps[targetIndex];
    //     let newOrder: number;

    //     if (!prevApp && !nextApp) {
    //         newOrder = 1000;
    //     } else if (!prevApp) {
    //         newOrder = nextApp!.order / 2;
    //     } else if (!nextApp) {
    //         newOrder = prevApp.order + 1000;
    //     } else {
    //         newOrder = (prevApp.order + nextApp.order) / 2;
    //     }

    //     handleUpdateStatus(active.id as string, overStatus, newOrder);
    // };

    const onDragEnd = (event: DragEndEvent) => {
        setIsDraggingCard(false);
        setActiveApp(null);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeStatus = active.data.current?.status as ApplicationStatus;
        const overStatus = over.data.current?.status as ApplicationStatus;
        const overType = over.data.current?.type;

        if (!overStatus || !activeStatus) return;

        const sourceColumnApps = applications
            .filter(app => app.status === activeStatus)
            .sort((a, b) => a.order - b.order);

        const isWithinColumn = activeStatus === overStatus;
        let targetApps = isWithinColumn ? sourceColumnApps : applications
            .filter(app => app.status === overStatus && app._id !== active.id)
            .sort((a, b) => a.order - b.order);

        let targetIndex: number;

        if (overType === "Column") {
            // Dropping on empty column header → append to end
            targetIndex = targetApps.length;
        } else {
            // Dropping on a card → find position relative to that card
            const overIndex = targetApps.findIndex(app => app._id === over.id);

            if (isWithinColumn) {
                // Same column: insert before if moving up, after if moving down
                const activeIndex = sourceColumnApps.findIndex(app => app._id === active.id);
                targetIndex = activeIndex < overIndex ? overIndex + 1 : overIndex;
            } else {
                // Cross-column: insert before the target, UNLESS it's the last card (then append)
                if (overIndex >= 0) {
                    const isLastCard = overIndex === targetApps.length - 1;
                    targetIndex = isLastCard ? overIndex + 1 : overIndex;
                } else {
                    targetIndex = targetApps.length;
                }
            }
        }

        // Calculate new order using the correct target column's apps
        const prevApp = targetApps[targetIndex - 1];
        const nextApp = targetApps[targetIndex];
        let newOrder: number;

        if (!prevApp && !nextApp) {
            newOrder = 1000;
        } else if (!prevApp) {
            newOrder = nextApp!.order / 2;
        } else if (!nextApp) {
            newOrder = prevApp.order + 1000;
        } else {
            newOrder = (prevApp.order + nextApp.order) / 2;
        }

        handleUpdateStatus(active.id as string, overStatus, newOrder);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
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

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeApp ? (
                        <div className="opacity-90 shadow-2xl rotate-2 transition-transform cursor-grabbing touch-none">
                            <ApplicationCard
                                application={activeApp}
                                onClick={() => {}}
                            />
                        </div>
                    ) : null}
                </DragOverlay>

                <ApplicationSheet
                    selectedApp={selectedApp}
                    onClose={closeDrawer}
                />
            </DndContext>
        </>
    )
}