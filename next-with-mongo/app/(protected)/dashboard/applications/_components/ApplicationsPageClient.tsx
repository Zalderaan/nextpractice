'use client';

import { useCallback, useState } from 'react';
import { ApplicationsTable, applicationTableColumns } from './application-table';
import { ApplicationSheet } from '../../applications/_components/app_sheet/ApplicationSheet';
import { Application } from '../../board/types/application.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface ApplicationsPageClientProps {
    applications: Application[];
}

export function ApplicationsPageClient({ applications }: ApplicationsPageClientProps) {
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const selectedApp = applications.find(app => app._id === selectedAppId) || null;

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleSelectRow = useCallback(
        (app: Application) => {
            setSelectedAppId(app._id);

            const params = new URLSearchParams(searchParams.toString())
            params.set("appId", app._id);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false})
        }, [router, pathname, searchParams]);

    const closeSheet = useCallback(() => {
        setSelectedAppId(null)

        const params = new URLSearchParams(searchParams.toString())
        params.delete('appId')
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [router, pathname, searchParams])

    return (
        <main className='flex h-full flex-1 min-h-0'>
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