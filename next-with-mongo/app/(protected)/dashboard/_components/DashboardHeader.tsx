'use client'

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/(auth)/auth.stores";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardHeader() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const isMobile = useIsMobile();
    // console.log("this is user: ", user)

    // Define page data with title and description for each route
    const pageData = {
        dashboard: { title: "Dashboard", desc: "Overview of your dashboard" },
        board: { title: "Board", desc: "Manage your board and tasks" },
        applications: { title: "Your Applications", desc: "View and edit your applications" }
    };

    // Function to get the data for the current page
    const getPageData = () => {
        if (pathname === "/dashboard/board") return pageData.board;
        if (pathname === "/dashboard/applications") return pageData.applications;
        if (pathname === "/dashboard") return pageData.dashboard;
        return pageData.dashboard;  // Default fallback
    };

    const currentPage = getPageData();

    return (
        <header className="sticky z-50 top-0 flex flex-row items-center justify-between px-(--header-px) border-b bg-sidebar h-(--header-height)">

            <div className="flex flex-row items-center space-x-2">
                <SidebarTrigger className={isMobile ? "" : "hidden"}/>
                <div className="flex flex-col justify-center space-y-0">
                    <h1 className="text-lg font-semibold">{currentPage.title}</h1>
                    <p className="text-xs">{currentPage.desc}</p>
                </div>
            </div>

            <div className="flex flex-row items-center space-x-4">
                <Separator orientation="vertical" className="border-x" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className="rounded-xl h-8 w-8 bg-black text-white flex items-center justify-center shrink-0 text-xs">
                            {user?.username.charAt(0).toLocaleUpperCase() ?? "?"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <span className="text-sm">{user?.username ?? "Loading..."}</span>
                        <DropdownMenuItem>
                            <LogOutIcon />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}