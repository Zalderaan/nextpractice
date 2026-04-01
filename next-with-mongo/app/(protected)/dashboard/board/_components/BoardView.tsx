'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application, ApplicationCard, ApplicationStatus } from './ApplicationCard'
import { ApplicationSheet } from './ApplicationDetailsSheet'
import { updateApplicationStatusAction } from '../actions'
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core'
import { createPortal } from 'react-dom'

type Props = {
  applications: Application[]
}

export default function BoardView({ applications }: Props) {
  const [boardApps, setBoardApps] = useState<Application[]>(applications)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDraggingCard, setIsDraggingCard] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const dragStartSnapshotRef = useRef<Application[]>([])

  const statuses = useMemo(
    () => ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const,
    []
  )

  const getDestStatus = useCallback(
    (overId: string, overStatus: unknown, apps: Application[]): ApplicationStatus | null => {
      if (typeof overStatus === 'string') return overStatus as ApplicationStatus
      const overApp = apps.find((a) => a._id === overId)
      if (overApp) return overApp.status
      if (statuses.includes(overId as ApplicationStatus)) return overId as ApplicationStatus
      return null
    },
    [statuses]
  )

  const handleSelect = useCallback((app: Application) => {
    setSelectedAppId(app._id)
  }, [])

  const selectedApp = boardApps.find((app) => app._id === selectedAppId) || null
  const activeApplication = useMemo(
    () => boardApps.find((app) => app._id === activeId),
    [activeId, boardApps]
  )

  const closeDrawer = useCallback(() => setSelectedAppId(null), [])

  const handleUpdateStatus = async (
    id: string,
    newStatus: ApplicationStatus,
    newOrder: number
  ) => {
    const result = await updateApplicationStatusAction(id, { newStatus, newOrder })
    if (!result.success) {
      console.error('Update failed:', result.error)
      console.error('Error details:', result.details)
      return false
    }
    return true
  }

  const pointerSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  })

  const onDragStart = (e: DragStartEvent) => {
    // snapshot for cancel/rollback
    dragStartSnapshotRef.current = boardApps.map((app) => ({ ...app }))
    setIsDraggingCard(true)
    setActiveId(e.active.id as string)
  }

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    if (!over) return

    const activeDragId = active.id as string
    const overId = over.id as string

    setBoardApps((prev) => {
      const activeApp = prev.find((a) => a._id === activeDragId)
      if (!activeApp) return prev

      // Critical guard: ignore hovering over itself
      if (overId === activeDragId) return prev

      const destStatus = getDestStatus(overId, over.data.current?.status, prev)
      if (!destStatus) return prev

      // Critical guard: only do cross-column preview updates here.
      // Same-column reorder is finalized on drop.
      if (activeApp.status === destStatus) return prev

      const destColumnApps = prev
        .filter((a) => a.status === destStatus && a._id !== activeDragId)
        .sort((a, b) => a.order - b.order)

      // Stable preview placement: append to end of destination column
      const lastDestApp = destColumnApps[destColumnApps.length - 1]
      const newOrder = lastDestApp ? lastDestApp.order + 1000 : 1000

      if (Math.abs(activeApp.order - newOrder) < 0.000001) return prev

      return prev.map((a) =>
        a._id === activeDragId ? { ...a, status: destStatus, order: newOrder } : a
      )
    })
  }

  const onDragCancel = () => {
    setIsDraggingCard(false)
    setActiveId(null)
    setBoardApps(dragStartSnapshotRef.current)
  }

  const onDragEnd = async (e: DragEndEvent) => {
    setIsDraggingCard(false)
    setActiveId(null)

    const { active, over } = e
    if (!over) {
      setBoardApps(dragStartSnapshotRef.current)
      return
    }

    const activeDragId = active.id as string
    const movedApp = boardApps.find((a) => a._id === activeDragId)
    if (!movedApp) return

    const ok = await handleUpdateStatus(movedApp._id, movedApp.status, movedApp.order)
    if (!ok) {
      setBoardApps(dragStartSnapshotRef.current)
    }
  }

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      onDragOver={onDragOver}
      sensors={useSensors(pointerSensor)}
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
              applications={boardApps
                .filter((a) => a.status === status)
                .sort((a, b) => a.order - b.order)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </BoardClient>

      <ApplicationSheet selectedApp={selectedApp} onClose={closeDrawer} />

      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay zIndex={9999}>
            {activeApplication ? (
              <div className="opacity-90 shadow-2xl rotate-2 cursor-grabbing">
                <ApplicationCard application={activeApplication} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  )
}