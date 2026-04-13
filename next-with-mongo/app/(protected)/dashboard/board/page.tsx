import { BoardPageHeader } from './_components/BoardPageHeader';
import { Application } from './types/application.types';
import BoardView from './_components/BoardView';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';
import { getApplications } from "@/lib/applications"
import { getAuthContext } from '@/lib/auth';


export default async function BoardPage() {
    const { token, userId } = await getAuthContext(); // handles all edge cases
    const data = await getApplications(userId, token)
    const applications: Application[] = data.data.applications;

    const statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

    return (
        <main className="flex min-h-0 h-full flex-1 flex-col">
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