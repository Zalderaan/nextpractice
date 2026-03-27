'use client'

// TODO make this server component?

import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';
import React from 'react';
import { KanbanColumn } from './_components/KanbanColumn';
import { BoardPageHeader } from './_components/BoardPageHeader';
import { authedFetch } from '@/lib/auth_fetch';
import { Application } from './_components/ApplicationCard';
export default function BoardPage() {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef);

    // const applications = [
    // ];

    const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL
    const res = await authedFetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`);
    const applications: Application[] = await res.json();

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