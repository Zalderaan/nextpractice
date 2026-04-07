import { useSortable } from '@dnd-kit/react/sortable';
import { ApplicationCard, Application } from './ApplicationCard';

interface SortableApplicationCardProps {
    application: Application;
    index: number;
    onClick: () => void;
}

export function SortableApplicationCard({ application, onClick, index }: SortableApplicationCardProps) {
    const {ref, isDragging} = useSortable({
        id: application._id,
        index,
        type: 'application',
        accept: 'application',
        data: {
            type: "Application",
        }
    });

    return (
        <div
            ref={ref}
            data-dnd-handle="true"
            data-no-drag
            className={[
                'transition-[transform,opacity,box-shadow] duration-150',
                isDragging ? 'opacity-35' : 'opacity-100'
            ].join(' ')}

        >
            <ApplicationCard application={application} onClick={onClick} />
        </div>
    )
}