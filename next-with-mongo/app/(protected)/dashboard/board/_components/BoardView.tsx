'use client'

import React, { useCallback, useMemo, useState } from 'react'
import BoardClient from '../../_components/BoardClient'
import { KanbanColumn } from './KanbanColumn'
import { Application } from './ApplicationCard'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'

type Props = {
    applications: Application[]
}

export default function BoardView({ applications }: Props) {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null)

    const handleSelect = useCallback((app: Application) => {
        setSelectedApp(app)
    }, [])

    const closeDrawer = useCallback(() => setSelectedApp(null), [])

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

            <Drawer
                direction="right"
                open={!!selectedApp}
                onOpenChange={(open) => {
                    if (!open) closeDrawer()
                }}
            >
                <DrawerContent>
                    {selectedApp && (
                        <>
                            <DrawerHeader>
                                <DrawerTitle>{selectedApp.role}</DrawerTitle>
                                <DrawerDescription>{selectedApp.company}</DrawerDescription>
                            </DrawerHeader>

                            <section className="p-4">
                                <p>Status: {selectedApp.status}</p>
                                <p>Work Type: {selectedApp.workType}</p>
                                <p>Priority: {selectedApp.priority}</p>
                                <p>{selectedApp.notes}</p>
                            </section>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}