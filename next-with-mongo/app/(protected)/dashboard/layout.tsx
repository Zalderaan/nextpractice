import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const paths = {
        dashboard: "/dashboard",
        board: "/dashboard/board",
        applications: "/dashboard/applications"
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex min-h-0 flex-1 min-w-0 flex-col">
                <header className="flex flex-col justify-center px-(--header-px) border-b bg-sidebar h-(--header-height)">
                    <span>Main header</span> {/* TODO: Conditionals here (changing according to the page) */}
                </header>
                <main className="w-full flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}