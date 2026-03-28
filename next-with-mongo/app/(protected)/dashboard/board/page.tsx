// TODO: CSR only for now
'use client'

import React, { useEffect, useState } from 'react';
import { useHorizontalDragScroll } from '@/hooks/use-horizontal-drag-scroll';
import { KanbanColumn } from './_components/KanbanColumn';
import { BoardPageHeader } from './_components/BoardPageHeader';
import { authedFetch } from '@/lib/auth_fetch';
import { Application } from './_components/ApplicationCard';

export default function BoardPage() {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = useHorizontalDragScroll(scrollRef);
    
    // 1. Add state for your data and loading status
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Fetch data inside useEffect
    useEffect(() => {
        const fetchApps = async () => {
            try {
                const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;
                const res = await authedFetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`);
                
                if (res.ok) {
                    const jsonResponse = await res.json();
                    
                    // Log it to see exactly what Express is sending!
                    console.log("Raw API Response:", jsonResponse); 

                    // Extract the array. If your backend uses a different key than 'data', change it here.
                    const appsArray = Array.isArray(jsonResponse) 
                        ? jsonResponse 
                        : (jsonResponse.data || jsonResponse.applications || []);

                    setApplications(appsArray);
                } else {
                    console.error("Failed to fetch applications. Status:", res.status);
                    setApplications([]); // Safe fallback
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setApplications([]); // Safe fallback
            } finally {
                setIsLoading(false);
            }
        };

        fetchApps();
    }, []);

    const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

    if (isLoading) return <div>Loading board...</div>;

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
            <BoardPageHeader />
            <div
                ref={scrollRef}
                className={`min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-(--dashboard-pages-padding) select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
                <div className="flex w-max flex-row items-start gap-4">
                    {statuses.map((status) => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            applications={applications.filter(app => app.status === status)}
                            onAddApplication={() => console.log(`Add to ${status}`)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}