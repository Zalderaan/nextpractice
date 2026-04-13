import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "./_components/DashboardHeader";
import { AuthBootstrap } from "./_components/AuthBootstrap";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AuthBootstrap />
            <AppSidebar />
            <SidebarInset className="flex flex-col min-w-0 flex-1 h-dvh overflow-hidden">
                <DashboardHeader />
                <main className="flex flex-1 min-h-0 max-h-full w-full overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}