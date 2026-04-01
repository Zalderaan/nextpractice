import { BoardPageHeader } from './_components/BoardPageHeader';
import { Application } from './_components/ApplicationCard';
import { cookies, headers } from 'next/headers';
import BoardView from './_components/BoardView';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { FolderOpen, Icon } from 'lucide-react';

export default async function BoardPage() {

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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach token here
        },
        // Optional: cache control if data changes frequently
        cache: 'no-store'
    })

    if (!res.ok) {
        console.error("Error fetching applications! MORE LOGGING ERRORS NEEDED HERE")
    }

    const data = await res.json();
    const applications: Application[] = data.data.applications;

    const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

    console.log("This is applications: ", applications)

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
            <BoardPageHeader />
            {
                applications.length > 0
                    ? <BoardView applications={applications} />
                    : (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <FolderOpen />
                                </EmptyMedia>
                                <EmptyTitle>You haven't entered any applications yet</EmptyTitle>
                                <EmptyDescription>Add your first application now! </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button>Add Application</Button>
                            </EmptyContent>
                        </Empty>
                    )
            }

        </main>
    );
}