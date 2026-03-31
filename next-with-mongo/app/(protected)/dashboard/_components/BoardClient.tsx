'use client';
import React from 'react';
import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';

type Props = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    isDraggingCard?: boolean
};

export default function BoardClient({ children, className = '', style, isDraggingCard }: Props) {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef, isDraggingCard);

    return (
        <div
            ref={scrollRef}
            className={`${className} ${isDraggingCard
                    ? 'cursor-default' // Reset cursor when dragging a card [!code ++]
                    : dragging
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                }`}
            style={style}
        >
            {children}
        </div>
    );
}