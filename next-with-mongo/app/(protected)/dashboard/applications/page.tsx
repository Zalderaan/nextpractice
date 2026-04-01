import { cookies, headers } from 'next/headers';
import {ApplicationsPageHeader} from "@/app/(protected)/dashboard/applications/_components/ApplicationsPageHeader"
import { ApplicationsTable, applicationTableColumns } from './_components/application-table';
import { ApplicationsPageClient } from './_components/ApplicationsPageClient';

export default async function ApplicationsPage() {
    const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL

    const cookieStore = await cookies();
    const headersList = await headers();
    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) {
        token = cookieStore.get("accessToken")?.value
    }
    const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        // Optional: cache control if data changes frequently
        cache: 'no-store'
    });

    if (!res.ok) {
        console.error("Error fetching applications! MORE LOGGING ERRORS NEEDED HERE")
    }

    const data = await res.json();
    const applications = data.data.applications;

    return (
        <div className="flex min-h-0 h-full flex-1 flex-col">
            <ApplicationsPageHeader />
            <main className='p-(--dashboard-pages-padding)'>
                <ApplicationsPageClient applications={applications} />
            </main>
        </div>
    )
}