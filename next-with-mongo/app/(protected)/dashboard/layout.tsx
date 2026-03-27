import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "./_components/DashboardHeader";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex min-h-0 flex-1 min-w-0 flex-col">
                <DashboardHeader />
                <main className="w-full flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}