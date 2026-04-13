import { BoardPageHeader } from "./_components/BoardPageHeader";

export default function BoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <BoardPageHeader />
            {children}
        </div>
    );
}