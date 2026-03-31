'use client'

import React, { useCallback, useMemo, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application } from './ApplicationCard'
import { ApplicationSheet } from './ApplicationDetailsSheet'

type Props = {
    applications: Application[]
}

export default function BoardView({ applications }: Props) {
    // const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
    const handleSelect = useCallback((app: Application) => {
        setSelectedAppId(app._id)
    }, [])
    const selectedApp = applications.find(app => app._id === selectedAppId) || null;

    const closeDrawer = useCallback(() => setSelectedAppId(null), [])
    const statuses = useMemo(() => ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const, [])

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
            <ApplicationSheet
                selectedApp={selectedApp}
                onClose={closeDrawer}
            />
        </>
    )
}