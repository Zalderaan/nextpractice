import React from 'react'; // remove unused "use"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ApplicationCard, Application } from './ApplicationCard';

interface SortableApplicationCardProps {
    application: Application;
    onClick: () => void;
}

export function SortableApplicationCard({ application, onClick }: SortableApplicationCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: application._id,
        data: {
            type: "Application",
            status: application.status
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1, // key change
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            data-dnd-handle="true"
            data-no-drag
        >
            <ApplicationCard application={application} onClick={onClick} />
        </div>
    )
}