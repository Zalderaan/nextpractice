'use client'

import * as React from "react"

import {
    Sidebar,
    SidebarContent,
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
import { FileUser, MonitorCog, SidebarIcon, SquareKanban } from "lucide-react"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Core",
            items: [
                {
                    title: "Board",
                    url: "/dashboard/board",
                    icon: <SquareKanban />
                },
                {
                    title: "My Applications",
                    url: "dashboard/applications",
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

    return (
        <Sidebar {...props} collapsible="icon">
            <SidebarHeader>
                <SidebarMenu className="flex flex-row justify-between items-center">
                    <SidebarMenuButton className="">
                        <div className="flex flex-row items-center space-x-2">
                            <span
                                className="rounded-lg"
                                tabIndex={0}
                                onMouseEnter={() => setHoverHeader(true)}
                                onMouseLeave={() => setHoverHeader(false)}
                                onFocus={() => setHoverHeader(true)}
                                onBlur={() => setHoverHeader(false)}
                                aria-label="Open sidebar"
                                onClick={isCollapsed ? () => toggleSidebar() : undefined}
                            >
                                {shouldShow ? <SidebarIcon /> : <MonitorCog />}
                            </span>
                            <span>Slaver</span>
                        </div>
                    </SidebarMenuButton>
                    <SidebarTrigger hidden={isCollapsed} />
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
            <SidebarRail />
        </Sidebar>
    )
}
