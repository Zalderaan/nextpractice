'use client'

import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { FileUser, Home, MonitorCog, SidebarIcon, SquareKanban } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavUser } from "./nav-user"
import { useAuthStore } from "@/app/(auth)/auth.stores"

// This is sample data.
const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Core",
            items: [
                {
                    title: "Home",
                    url: "/dashboard",
                    icon: <Home />
                },
                {
                    title: "Board",
                    url: "/dashboard/board",
                    icon: <SquareKanban />
                },
                {
                    title: "My Applications",
                    url: "/dashboard/applications",
                    icon: <FileUser />
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [hoverHeader, setHoverHeader] = React.useState(false);
    const pathname = usePathname() // get curr path
    const { state, toggleSidebar } = useSidebar();

    const isCollapsed = state === 'collapsed';
    const shouldShow = isCollapsed && hoverHeader;

    const { user } = useAuthStore();

    return (
        <Sidebar {...props} collapsible="icon"
            onMouseEnter={() => setHoverHeader(true)}
            onMouseLeave={() => setHoverHeader(false)}
            onFocus={() => setHoverHeader(true)}
            onBlur={() => setHoverHeader(false)}
            aria-label="Open sidebar"
            onClick={isCollapsed ? () => toggleSidebar() : undefined}
            className={cn(isCollapsed && "hover:cursor-col-resize")}
        >
            <SidebarHeader className="flex flex-row w-full items-center h-(--header-height) border-b">
                <SidebarMenu className="flex flex-row justify-between items-center h-full">
                    <SidebarMenuButton className="h-full">
                        <div className="flex flex-row items-center space-x-2">
                            <span className="rounded-lg" tabIndex={0} >
                                {shouldShow ? <SidebarIcon /> : <MonitorCog />}
                            </span>
                            <span>The Hire Wire</span>
                        </div>
                    </SidebarMenuButton>
                    <SidebarTrigger className="h-full" hidden={isCollapsed} />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={pathname.endsWith(item.title)}>
                                            <Link href={item.url}>
                                                {item.icon}
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
