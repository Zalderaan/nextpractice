'use client'
import { Button } from '@/components/ui/button';
// TODO make this server component?

import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';
import { Filter } from 'lucide-react';
import React from 'react';
export default function BoardPage() {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef);

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
            <header className="flex flex-row items-center px-(--header-px) shrink-0 bg-sidebar border-b h-(--header-height)">
                <div className='flex flex-row items-center space-x-4'>
                    <span>Search here</span>
                    <Button variant={'outline'}><Filter /></Button>
                </div>
            </header>
            <div
                ref={scrollRef}
                className={`min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
                <div className="flex w-max flex-row items-start gap-4">
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