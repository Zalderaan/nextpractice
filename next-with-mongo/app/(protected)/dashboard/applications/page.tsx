import { cookies, headers } from 'next/headers';
import {ApplicationsPageHeader} from "@/app/(protected)/dashboard/applications/_components/ApplicationsPageHeader"
import { ApplicationsPageClient } from './_components/ApplicationsPageClient';
import { getApplications } from '@/lib/applications';
import { decodeJwt } from 'jose';
import { redirect } from 'next/navigation';

export default async function ApplicationsPage() {
    const cookieStore = await cookies();
    const headersList = await headers();
    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) token = cookieStore.get("accessToken")?.value

    const {sub: userId} = decodeJwt(token!)

    if (!token || !userId) {
        redirect('/login');
    }

    const data = await getApplications(userId, token)
    const applications = data.data.applications;

    return (
        <div className="flex min-h-0 h-full flex-1 flex-col">
            <ApplicationsPageHeader applications={applications}/>
            <main className='flex flex-1 min-h-0 flex-col p-(--dashboard-pages-padding)'>
                <ApplicationsPageClient applications={applications} />
            </main>
        </div>
    )
}