'use client'
// TODO make this server component?

import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';
import React from 'react';
export default function BoardPage() {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef);

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col bg-blue-200">
            <header className="shrink-0 bg-green-200">board page header</header>
            <div
                ref={scrollRef}
                className={`min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
                <div className="flex w-max flex-row items-start gap-4 p-4">
                    <div className="min-w-[320px] shrink-0 rounded bg-accent p-4">...</div>
                    <div className="min-w-[320px] shrink-0 rounded bg-accent p-4">...</div>
                    <div className="min-w-[320px] shrink-0 rounded bg-accent p-4">...</div>
                    <div className="min-w-[320px] shrink-0 rounded bg-accent p-4">...</div>
                    <div className="min-w-[320px] shrink-0 rounded bg-accent p-4">...</div>
                </div>
            </div>
        </main>
    );
}