'use client';
import React from 'react';
import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';

type Props = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    isDraggingCard?: boolean
};

export default function BoardClient({ isDraggingCard, children, className = '', style }: Props) {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef, isDraggingCard);

    return (
        <div
            ref={scrollRef}
            className={`${className} ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={style}
        >
            {children}
        </div>
    );
}