'use client'

import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application, ApplicationStatus } from './ApplicationCard'
import { ApplicationSheet } from './ApplicationDetailsSheet'
import { move } from '@dnd-kit/helpers';

import {
    DragDropProvider,
    DragOverlay,
} from '@dnd-kit/react'

import type {
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
} from '@dnd-kit/react'

import { ApplicationCard } from './ApplicationCard'
import { updateApplicationStatusAction } from '../actions'

type Props = {
    applications: Application[];
}

const MemoizedKanbanColumn = memo(KanbanColumn);

export default function BoardView({ applications }: Props) {
    const statuses = useMemo(
        () => ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const,
        []
    );

    const initialItemsByStatus = useMemo(
        () =>
            statuses.reduce((acc, status) => {
                acc[status] = applications
                    .filter((a) => a.status === status)
                    .sort((a, b) => a.order - b.order)
                    .map((a) => a._id);
                return acc;
            }, {} as Record<ApplicationStatus, string[]>),
        [applications, statuses]
    );

    const [itemsByStatus, setItemsByStatus] =
        useState<Record<ApplicationStatus, string[]>>(initialItemsByStatus);

    const itemsByStatusRef = useRef<Record<ApplicationStatus, string[]>>(initialItemsByStatus);
    const beforeDragRef = useRef<Record<ApplicationStatus, string[]> | null>(null);

    const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
    const [isDraggingCard, setIsDraggingCard] = useState(false);

    const appById = useMemo(() => {
        const map = new Map<string, Application>();
        for (const app of applications) map.set(app._id, app);
        return map;
    }, [applications]);

    const cloneItems = useCallback((items: Record<ApplicationStatus, string[]>) => {
        return statuses.reduce((acc, status) => {
            acc[status] = [...items[status]];
            return acc;
        }, {} as Record<ApplicationStatus, string[]>);
    }, [statuses]);

    const handleSelect = useCallback((app: Application) => {
        setSelectedAppId(app._id)
    }, [])

    const selectedApp = applications.find((app) => app._id === selectedAppId) || null;
    const closeDrawer = useCallback(() => setSelectedAppId(null), [])

    const handleUpdateStatus = useCallback(
        async (id: string, newStatus: ApplicationStatus, newOrder: number) => {
            console.log('Persisting:', { id, newStatus, newOrder });
            return await updateApplicationStatusAction(id, { newStatus, newOrder });
        },
        []
    );

    const onDragStart: DragStartEvent = (_event, _manager) => {
        try {
            beforeDragRef.current = cloneItems(itemsByStatusRef.current);
            setIsDraggingCard(true);
        } catch (error) {
            console.error('onDragStart failed:', error);
        }
    };

    const onDragOver: DragOverEvent = (event, _manager) => {
        try {
            setItemsByStatus((current) => {
                const next = move(current, event);
                itemsByStatusRef.current = next;
                return next;
            });
        } catch (error) {
            console.error('onDragOver failed:', error, { event });
        }
    };

    const onDragEnd: DragEndEvent = async (event, _manager) => {
        try {
            const { source } = event.operation;
            if (!source) {
                console.error('onDragEnd skipped: missing source', { event });
                return;
            }

            const activeId = String(source.id);
            const latest = itemsByStatusRef.current;

            const destinationStatus = statuses.find((status) =>
                latest[status].includes(activeId)
            );

            if (!destinationStatus) {
                console.error('onDragEnd skipped: active id not present in any column', {
                    activeId,
                    latest,
                });
                return;
            }

            const ids = latest[destinationStatus];
            const targetIndex = ids.indexOf(activeId);
            if (targetIndex < 0) {
                console.error('onDragEnd skipped: active id not found in destination list', {
                    activeId,
                    destinationStatus,
                    ids,
                });
                return;
            }

            const prevId = ids[targetIndex - 1];
            const nextId = ids[targetIndex + 1];
            const prevApp = prevId ? appById.get(prevId) : undefined;
            const nextApp = nextId ? appById.get(nextId) : undefined;

            let newOrder: number;
            if (!prevApp && !nextApp) newOrder = 1000;
            else if (!prevApp) newOrder = nextApp!.order / 2;
            else if (!nextApp) newOrder = prevApp.order + 1000;
            else newOrder = (prevApp.order + nextApp.order) / 2;

            const result = await handleUpdateStatus(activeId, destinationStatus, newOrder);

            if (!result.success) {
                console.error('Update failed, rolling back UI:', result.error);

                if (beforeDragRef.current) {
                    setItemsByStatus(beforeDragRef.current);
                    itemsByStatusRef.current = beforeDragRef.current;
                }
            }
        } catch (error) {
            console.error('onDragEnd failed:', error, { event });

            if (beforeDragRef.current) {
                setItemsByStatus(beforeDragRef.current);
                itemsByStatusRef.current = beforeDragRef.current;
            }
        } finally {
            setIsDraggingCard(false);
            beforeDragRef.current = null;
        }
    };

    const applicationsByStatus = useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status] = itemsByStatus[status]
                .map((id) => appById.get(id))
                .filter((app): app is Application => Boolean(app));
            return acc;
        }, {} as Record<ApplicationStatus, Application[]>);
    }, [itemsByStatus, appById, statuses]);

    return (
        <>
            <DragDropProvider onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} >
                <BoardClient className="min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none" isDraggingCard={isDraggingCard} >
                    <div className="flex w-max flex-row items-start gap-4 h-full">
                        {statuses.map((status) => (
                            <MemoizedKanbanColumn key={status} status={status} applications={applicationsByStatus[status]} onSelect={handleSelect} />
                        ))}
                    </div>
                </BoardClient>

                <DragOverlay>
                    {(source) => {
                        const app = appById.get(String(source.id));
                        if (!app) return null;

                        return (
                            <div className="opacity-90 shadow-2xl rotate-2 transition-transform cursor-grabbing touch-none">
                                <ApplicationCard application={app} onClick={() => { }} />
                            </div>
                        );
                    }}
                </DragOverlay>

                <ApplicationSheet selectedApp={selectedApp} onClose={closeDrawer} />
            </DragDropProvider>
        </>
    )
}