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
    
    const onDragEnd = (event: DragEndEvent) => {
        setIsDraggingCard(false);
        setActiveApp(null);
        
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;
        const overStatus = over.data.current?.status as ApplicationStatus;

        if (!overStatus) return; // Make sure we dropped over a valid zone

        // 1. Get apps in destination column
        const destColumnApps = applications
            .filter(app => app.status === overStatus && app._id !== activeId)
            .sort((a, b) => a.order - b.order);

        let newOrder: number;

        if (overType === "Column") {
            // Dropped onto an empty column or directly on the column background
            // Add to the end of the column
            const lastApp = destColumnApps[destColumnApps.length - 1];
            newOrder = lastApp ? lastApp.order + 1000 : 1000;
        } else {
            // Dropped over another item
            // We need to find its index in destColumnApps
            const overIndex = destColumnApps.findIndex(app => app._id === overId);
            
            if (overIndex >= 0) {
                // Determine if we should place above or below based on position in list
                // For simplicity, we can just insert before the hovered item
                // However dnd-kit gives rect info, but we can utilize index approach
                // We'll calculate order similar to before
                const prevApp = destColumnApps[overIndex - 1];
                const nextApp = destColumnApps[overIndex]; // The item we dropped ON

                if (!prevApp) {
                    // Dropped at top
                    newOrder = nextApp.order / 2;
                } else {
                    // Dropped between
                    newOrder = (prevApp.order + nextApp.order) / 2;
                }
            } else {
                const lastApp = destColumnApps[destColumnApps.length - 1];
                newOrder = lastApp ? lastApp.order + 1000 : 1000;
            }
        }

        handleUpdateStatus(activeId as string, overStatus, newOrder);
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