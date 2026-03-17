import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col w-full">
                <header className="flex items-center justify-between px-4 sticky top-0 z-40 h-(--header-height) shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <SidebarTrigger />
                </header>

                <main className="flex flex-col flex-1">
                    {children}
                </main>
            </div>
        </SidebarProvider >
    );
}