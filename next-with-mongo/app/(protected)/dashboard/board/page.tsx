// import React, { useEffect, useState } from 'react';
// import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';
// import { authedFetch } from '@/lib/auth_fetch';
import { KanbanColumn } from './_components/KanbanColumn';
import { BoardPageHeader } from './_components/BoardPageHeader';
import BoardClient from '../_components/BoardClient';
import { Application } from './_components/ApplicationCard';
import { cookies } from 'next/headers';

export default async function BoardPage() {

    const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Attach token here
            'Content-Type': 'application/json',
        },
        // Optional: cache control if data changes frequently
        cache: 'no-store'
    });

    if (!res.ok) {
        console.error("Error fetching applications! MORE LOGGING ERRORS NEEDED HERE")
    }

    const data = await res.json();
    console.log("This is data: ", data);

    const applications: Application[] = [];

    const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
            <BoardPageHeader />
            <BoardClient
                className={`min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none`}

            >
                <div className="flex w-max flex-row items-start gap-4">
                    {statuses.map((status) => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            applications={applications.filter(app => app.status === status)}
                        />
                    ))}
                </div>
            </BoardClient>
        </main>
    );
}