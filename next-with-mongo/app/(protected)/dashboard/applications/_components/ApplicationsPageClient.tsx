'use client';

import { useCallback, useState } from 'react';
import { ApplicationsTable, applicationTableColumns } from './application-table';
import { ApplicationSheet } from '../../board/_components/ApplicationDetailsSheet';
import { Application } from '../../board/_components/ApplicationCard';

interface ApplicationsPageClientProps {
    applications: Application[];
}

export function ApplicationsPageClient({ applications }: ApplicationsPageClientProps) {
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const selectedApp = applications.find(app => app._id === selectedAppId) || null;

    const handleSelectRow = useCallback((app: Application) => {
        setSelectedAppId(app._id);
    }, []);

    const closeSheet = useCallback(() => {
        setSelectedAppId(null);
    }, []);

    return (
        <main className='h-full'>
            <ApplicationsTable
                columns={applicationTableColumns}
                data={applications}
                onSelectRow={handleSelectRow}
            />
            <ApplicationSheet
                selectedApp={selectedApp}
                onClose={closeSheet}
            />
        </main>
    );
}