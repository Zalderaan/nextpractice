'use client'

/**
 * BoardView
 *
 * The top-level Kanban board for the job-application tracker.
 *
 * Responsibilities:
 *  - Renders one KanbanColumn per status (wishlist → applied → interview → offer → rejected).
 *  - Owns all drag-and-drop state via @dnd-kit/react.
 *  - Optimistically reorders cards on drag; rolls back on server error.
 *  - Syncs the selected-application drawer with the ?appId= URL search param.
 */

// ─── React & hooks ────────────────────────────────────────────────────────────
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useApplicationSheetStore } from '../../_components/app_sheet/app_sheet.store'

// ─── Next.js navigation ───────────────────────────────────────────────────────
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// ─── DnD-kit ──────────────────────────────────────────────────────────────────
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'

// ─── Local components ─────────────────────────────────────────────────────────
import BoardClient from '../../_components/BoardClient'
import { ApplicationCard, ApplicationStatus } from './ApplicationCard'
import { KanbanColumn } from './KanbanColumn'
import { ApplicationSheet } from '../../_components/app_sheet/ApplicationSheet'

// ─── Types & server actions ───────────────────────────────────────────────────
import { Application } from '../../types/application.types'
import { updateApplicationStatusAction } from '../../actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    /** Full list of applications fetched server-side and passed down as a prop. */
    applications: Application[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Stable ordered list of every column status rendered on the board. */
const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const

// Memoised so identical props don't re-render individual columns unnecessarily.
const MemoizedKanbanColumn = memo(KanbanColumn)

// ─── Component ────────────────────────────────────────────────────────────────

export default function BoardView({ applications }: Props) {

    // ── URL / router ────────────────────────────────────────────────────────
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // ── Derived maps & initial state ────────────────────────────────────────

    /**
     * Fast O(1) lookup: application ID → Application object.
     * Re-computed only when `applications` changes.
     */
    const appById = useMemo(() => {
        const map = new Map<string, Application>()
        for (const app of applications) map.set(app._id, app)
        return map
    }, [applications])

    /**
     * Initial mapping of status → ordered array of application IDs.
     * Derived from the server-side `applications` prop; used to
     * (re-)initialise `itemsByStatus` whenever fresh server data arrives.
     */
    const initialItemsByStatus = useMemo(
        () =>
            STATUSES.reduce((acc, status) => {
                acc[status] = applications
                    .filter((a) => a.status === status)
                    .sort((a, b) => a.order - b.order)
                    .map((a) => a._id)
                return acc
            }, {} as Record<ApplicationStatus, string[]>),
        [applications]
    )

    // ── Board state ─────────────────────────────────────────────────────────

    /**
     * The live ordering of card IDs per column.
     * Updated optimistically on every drag-over event; rolled back on error.
     */
    const [itemsByStatus, setItemsByStatus] =
        useState<Record<ApplicationStatus, string[]>>(initialItemsByStatus)

    /**
     * Ref mirror of `itemsByStatus` — lets async `onDragEnd` read the
     * latest ordering without a stale closure over state.
     */
    const itemsByStatusRef = useRef<Record<ApplicationStatus, string[]>>(initialItemsByStatus)

    /**
     * Snapshot of the board taken at drag-start.
     * Used to roll back the optimistic UI if the server update fails.
     */
    const beforeDragRef = useRef<Record<ApplicationStatus, string[]> | null>(null)

    /** True while a card is being dragged; passed down to BoardClient for cursor styling. */
    const [isDraggingCard, setIsDraggingCard] = useState(false)

    /** Get sheet actions from the shared zustand store */
    const { openSheet, closeSheet, selectedApp: storeSelectedApp } = useApplicationSheetStore()
    // ── Sync board with fresh server data ───────────────────────────────────

    /**
     * After a server action triggers revalidation and the parent re-renders
     * with new `applications`, reset local ordering to match.
     */
    useEffect(() => {
        setItemsByStatus(initialItemsByStatus)
        itemsByStatusRef.current = initialItemsByStatus
    }, [initialItemsByStatus])

    // ── Sync selected application with URL ?appId= param ────────────────────

    /**
     * Keeps `selectedAppId` in sync with the `?appId=` search param so that:
     *  - Deep-linking / browser back-forward opens the correct drawer.
     *  - If the app no longer exists in current data the drawer is closed.
     */
    useEffect(() => {
        const paramsAppId = searchParams.get('appId')
        const currentStoreApp = useApplicationSheetStore.getState().selectedApp


        if (!paramsAppId) {
            if (currentStoreApp) closeSheet()
            return
        }

        // Only update Zustand if the URL app doesn't match what's currently open
        if (storeSelectedApp?._id !== paramsAppId) {
            const app = appById.get(paramsAppId)
            // If the app exists in the data, open it. 
            // If it was just deleted (undefined), safely close it and ignore URL.
            if (app) {
                openSheet(app)
            } else {
                closeSheet()
            }
        }
    }, [searchParams, appById, openSheet, closeSheet])

    // ── Sync Zustand with fresh server data updates ─────────────────────────

    useEffect(() => {
        if (!storeSelectedApp) return;

        // Get the fresh version of the currently open app
        const latestApp = appById.get(storeSelectedApp._id);

        // If the data was updated by a server action (the object reference changes), push to Zustand
        if (latestApp && latestApp !== storeSelectedApp) {
            openSheet(latestApp);
        }
    }, [appById, storeSelectedApp, openSheet]);
    
    // ── Drawer helpers ───────────────────────────────────────────────────────


    /** Opens the application side-sheet and pushes ?appId= into the URL. */
    const handleSelect = useCallback(
        (app: Application) => {
            openSheet(app) // Open via Zustand immediately 

            const params = new URLSearchParams(searchParams.toString())
            params.set('appId', app._id)
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams, openSheet]
    )
    // ── Drag-and-drop helpers ────────────────────────────────────────────────

    /**
     * Returns a shallow clone of the given status→ids map so that
     * we can safely snapshot state without mutating it.
     */
    const cloneItems = useCallback(
        (items: Record<ApplicationStatus, string[]>) =>
            STATUSES.reduce((acc, status) => {
                acc[status] = [...items[status]]
                return acc
            }, {} as Record<ApplicationStatus, string[]>),
        []
    )

    /**
     * Persists the new status and fractional order of a card to the server.
     * The fractional order value is computed in `onDragEnd` based on
     * the IDs of the neighbouring cards.
     */
    const handleUpdateStatus = useCallback(
        async (id: string, newStatus: ApplicationStatus, newOrder: number) => {
            console.log('Persisting:', { id, newStatus, newOrder })
            return await updateApplicationStatusAction(id, { newStatus, newOrder })
        },
        []
    )

    // ── DnD event handlers ───────────────────────────────────────────────────

    /**
     * Called when the user first picks up a card.
     * Snapshots current ordering so we can roll back if the drop fails.
     */
    const onDragStart: DragStartEvent = (_event, _manager) => {
        try {
            beforeDragRef.current = cloneItems(itemsByStatusRef.current)
            setIsDraggingCard(true)
        } catch (error) {
            console.error('onDragStart failed:', error)
        }
    }

    /**
     * Called continuously as the dragged card moves between columns / positions.
     * Uses dnd-kit's `move` helper to reorder `itemsByStatus` optimistically.
     */
    const onDragOver: DragOverEvent = (event, _manager) => {
        try {
            setItemsByStatus((current) => {
                const next = move(current, event)
                itemsByStatusRef.current = next
                return next
            })
        } catch (error) {
            console.error('onDragOver failed:', error, { event })
        }
    }

    /**
     * Called when the user releases a card.
     *
     * Order calculation uses a fractional / midpoint strategy:
     *  - No neighbours      → 1000 (safe default)
     *  - No previous card   → nextApp.order / 2  (insert before first)
     *  - No next card       → prevApp.order + 1000 (append to end)
     *  - Both neighbours    → (prevApp.order + nextApp.order) / 2 (midpoint)
     *
     * If the server update fails, the optimistic UI is rolled back to the
     * snapshot saved in `beforeDragRef`.
     */
    const onDragEnd: DragEndEvent = async (event, _manager) => {
        try {
            const { source } = event.operation
            if (!source) {
                console.error('onDragEnd skipped: missing source', { event })
                return
            }

            const activeId = String(source.id)
            const latest = itemsByStatusRef.current

            // Determine which column the card landed in.
            const destinationStatus = STATUSES.find((status) =>
                latest[status].includes(activeId)
            )
            if (!destinationStatus) {
                console.error('onDragEnd skipped: active id not present in any column', {
                    activeId,
                    latest,
                })
                return
            }

            const ids = latest[destinationStatus]
            const targetIndex = ids.indexOf(activeId)
            if (targetIndex < 0) {
                console.error('onDragEnd skipped: active id not found in destination list', {
                    activeId,
                    destinationStatus,
                    ids,
                })
                return
            }

            // Resolve neighbouring Application objects for the order calculation.
            const prevApp = ids[targetIndex - 1] ? appById.get(ids[targetIndex - 1]) : undefined
            const nextApp = ids[targetIndex + 1] ? appById.get(ids[targetIndex + 1]) : undefined

            // Compute fractional order via midpoint between neighbours.
            let newOrder: number
            if (!prevApp && !nextApp) newOrder = 1000
            else if (!prevApp) newOrder = nextApp!.order / 2
            else if (!nextApp) newOrder = prevApp.order + 1000
            else newOrder = (prevApp.order + nextApp.order) / 2

            const result = await handleUpdateStatus(activeId, destinationStatus, newOrder)

            if (!result.success) {
                console.error('Update failed, rolling back UI:', result.error)
                if (beforeDragRef.current) {
                    setItemsByStatus(beforeDragRef.current)
                    itemsByStatusRef.current = beforeDragRef.current
                }
            }
        } catch (error) {
            console.error('onDragEnd failed:', error, { event })

            // Roll back optimistic update on unexpected errors.
            if (beforeDragRef.current) {
                setItemsByStatus(beforeDragRef.current)
                itemsByStatusRef.current = beforeDragRef.current
            }
        } finally {
            setIsDraggingCard(false)
            beforeDragRef.current = null
        }
    }

    // ── Derived render data ──────────────────────────────────────────────────

    /**
     * Maps each status to an ordered array of full Application objects
     * (as opposed to just IDs) ready to hand off to KanbanColumn.
     */
    const applicationsByStatus = useMemo(
        () =>
            STATUSES.reduce((acc, status) => {
                acc[status] = itemsByStatus[status]
                    .map((id) => appById.get(id))
                    .filter((app): app is Application => Boolean(app))
                return acc
            }, {} as Record<ApplicationStatus, Application[]>),
        [itemsByStatus, appById]
    )

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className='flex flex-col min-h-0 flex-1'>
            <div className='flex flex-col min-h-0 flex-1'>
                <DragDropProvider
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    {/* Horizontally scrollable board container */}
                    <BoardClient
                        className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar scrollbar-gutter:stable p-(--dashboard-pages-padding) select-none"
                        isDraggingCard={isDraggingCard}
                    >
                        <div className="flex w-max flex-row items-start gap-4 h-full">
                            {STATUSES.map((status) => (
                                <MemoizedKanbanColumn
                                    key={status}
                                    status={status}
                                    applications={applicationsByStatus[status]}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </div>
                    </BoardClient>

                    {/* Ghost card rendered under the cursor while dragging */}
                    <DragOverlay>
                        {(source) => {
                            const app = appById.get(String(source.id))
                            if (!app) return null

                            return (
                                <div className="opacity-90 shadow-2xl rotate-2 transition-transform cursor-grabbing touch-none">
                                    {/* TODO: Add notif badge for a card if there's a needs attention on it */}
                                    <ApplicationCard application={app} onClick={() => { }} />
                                </div>
                            )
                        }}
                    </DragOverlay>

                    {/* Side-sheet drawer for viewing / editing a single application */}
                    <ApplicationSheet />
                </DragDropProvider>
            </div>
        </div>
    )
}