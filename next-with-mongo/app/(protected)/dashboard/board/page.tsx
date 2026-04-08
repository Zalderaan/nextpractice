import { BoardPageHeader } from './_components/BoardPageHeader';
import { Application } from './_components/ApplicationCard';
import { cookies, headers } from 'next/headers';
import BoardView from './_components/BoardView';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';
import { getApplications } from "@/lib/applications"
import { decodeJwt } from "jose";
import { redirect } from 'next/navigation';


export default async function BoardPage() {

    const cookieStore = await cookies();
    const headersList = await headers();
    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) {
        token = cookieStore.get("accessToken")?.value
    }
    const { sub: userId } = decodeJwt(token!) 

    if (!token || !userId) {
        redirect('/login');
    }
    
    const data = await getApplications(userId, token)
    const applications: Application[] = data.data.applications;

    const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

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