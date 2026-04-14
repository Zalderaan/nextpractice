'use client';

import { useCallback, useEffect } from 'react';
import { ApplicationsTable, applicationTableColumns } from './application-table';
import { ApplicationSheet } from '../../_components/app_sheet/ApplicationSheet';
import { Application } from '../../types/application.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useApplicationSheetStore } from '../../_components/app_sheet/app_sheet.store';

interface ApplicationsPageClientProps {
    applications: Application[];
}

export function ApplicationsPageClient({ applications }: ApplicationsPageClientProps) {

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // 1. Grab the actions from the store
    const { selectedApp, openSheet, closeSheet } = useApplicationSheetStore();

    // 2. Sync URL params on initial load/navigation (Optional but recommended)
    useEffect(() => {
        const paramsAppId = searchParams.get('appId')
        const currentStoreApp = useApplicationSheetStore.getState().selectedApp

        if (!paramsAppId) {
            if (currentStoreApp) closeSheet()
            return
        }

        if (currentStoreApp?._id !== paramsAppId) {
            const app = applications.find(a => a._id === paramsAppId)
            if (app) {
                openSheet(app)
            } else {
                closeSheet()
            }
        }
    }, [searchParams, applications, openSheet, closeSheet])

    // 3. Sync Zustand with fresh server data updates
    useEffect(() => {
        if (!selectedApp) return;

        const latestApp = applications.find(app => app._id === selectedApp._id);

        // If the data was updated by a server action (the object reference changes), push to Zustand
        if (latestApp && latestApp !== selectedApp) {
            openSheet(latestApp);
        }
    }, [applications, selectedApp, openSheet]);

    const handleSelectRow = useCallback(
        (app: Application) => {
            // Open the sheet globally via Zustand
            openSheet(app);

            const params = new URLSearchParams(searchParams.toString())
            params.set("appId", app._id);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, [router, pathname, searchParams, openSheet]);

    return (
        <main className='flex h-full flex-1 min-h-0'>
            <ApplicationsTable
                columns={applicationTableColumns}
                data={applications}
                onSelectRow={handleSelectRow}
            />
            <ApplicationSheet />
        </main>
    );
}