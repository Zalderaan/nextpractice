import { ApplicationsPageHeader } from "@/app/(protected)/dashboard/applications/_components/ApplicationsPageHeader"
import { ApplicationsPageClient } from './_components/ApplicationsPageClient';
import { getApplications } from '@/lib/applications';
import { Suspense } from 'react';
import { getAuthContext } from '@/lib/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";


export default async function ApplicationsPage() {
    return (
        <div className="flex min-h-0 h-full flex-1 flex-col">
            <Suspense fallback={<ApplicationsContentSkeleton />}>
                <ApplicationsContent />
            </Suspense>
        </div>
    )
}

async function ApplicationsContent() {
    const { userId, token } = await getAuthContext();
    const data = await getApplications(userId, token);
    const applications = data.data.applications;

    return (
        <>
            <ApplicationsPageHeader applications={applications} />
            <main className='flex flex-1 min-h-0 flex-col p-(--dashboard-pages-padding)'>
                <ApplicationsPageClient applications={applications} />
            </main>
        </>
    );
}

function ApplicationsContentSkeleton() {
    return (
        <>
            <div className="p-4">
                <Skeleton className="h-8 w-32 mb-4" />
            </div>
            <main className='flex flex-1 min-h-0 flex-col p-(--dashboard-pages-padding)'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
        </>
    );
}