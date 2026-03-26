import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex min-h-0 flex-1 min-w-0 flex-col">
                <header className="bg-red-200">Main header</header>
                <main className="w-full flex-1 overflow-hidden bg-blue-500">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}