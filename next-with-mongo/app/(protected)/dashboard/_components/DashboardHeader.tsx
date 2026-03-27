'use client'

import { usePathname } from "next/navigation";

export function DashboardHeader() {
    const pathname = usePathname();

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
        <header className="flex flex-row items-center justify-between px-(--header-px) border-b bg-sidebar h-(--header-height)">
            <div className="flex flex-col justify-center space-y-0">
                <h1 className="text-lg font-semibold">{currentPage.title}</h1>
                <p className="text-xs">{currentPage.desc}</p>
            </div>

            <div className="rounded-full bg-black text-white w-8 h-8 flex items-center justify-center">
                <span>SP</span>
            </div>
        </header>
    );
}