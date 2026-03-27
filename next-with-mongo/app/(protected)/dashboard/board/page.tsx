'use client'
import { Button } from '@/components/ui/button';
// TODO make this server component?

import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';
import React from 'react';
import { KanbanColumn } from './_components/KanbanColumn';
import { BoardPageHeader } from './_components/BoardPageHeader';
export default function BoardPage() {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef);

    const applications = [
        { id: '1', company: 'Google', role: 'Software Engineer', status: 'wishlist' },
        { id: '2', company: 'Microsoft', role: 'Product Manager', status: 'applied' },
        { id: '3', company: 'Apple', role: 'Designer', status: 'interview' },
        { id: '4', company: 'Amazon', role: 'Data Scientist', status: 'offer' },
        { id: '5', company: 'Tesla', role: 'Engineer', status: 'rejected' },
        { id: '6', company: 'Netflix', role: 'Developer', status: 'wishlist' },
        { id: '7', company: 'Spotify', role: 'Analyst', status: 'applied' },
    ];

    const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
            <BoardPageHeader />

            {/* page body (side scrollable) */}
            <div
                ref={scrollRef}
                className={`min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
                {/* kanban cols conts */}
                <div className="flex w-max flex-row items-start gap-4">
                    {/* each kanban column */}
                    {statuses.map((status) => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            applications={applications.filter(app => app.status === status)}
                            onAddApplication={() => console.log(`Add to ${status}`)} // Placeholder
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}