import * as React from "react";

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
    SidebarSeparator
} from "@/components/ui/sidebar";

import {
    LayoutDashboard,
    Ticket,
    Users,
    Laptop,
    BarChart3,
    Plus,
    FileText,
    MoreHorizontal,
    Settings,
    CircleHelp
} from "lucide-react";


const primaryItems = [
    {
        title: "Quick Create",
        href: "#quick-create",
        icon: Plus
    },
    {
        title: "Dashboard",
        href: "#dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Tickets",
        href: "#tickets",
        icon: Ticket
    },
    {
        title: "Employees",
        href: "#employees",
        icon: Users
    },
    {
        title: "Assets",
        href: "#assets",
        icon: Laptop
    },
    {
        title: "Reports",
        href: "#reports",
        icon: BarChart3
    }
];


const documentItems = [
    {
        title: "Ticket Reports",
        href: "#ticket-reports",
        icon: FileText
    },
    {
        title: "More",
        href: "#more",
        icon: MoreHorizontal
    }
];


const supportItems = [
    {
        title: "Settings",
        href: "#settings",
        icon: Settings
    },
    {
        title: "Get Help",
        href: "#help",
        icon: CircleHelp
    }
];


function NavigationItems({ items }) {

    return (

        <SidebarMenu className="gap-1">

            {items.map((item) => {

                const Icon = item.icon;

                return (

                    <SidebarMenuItem
                        key={item.title}
                    >

                        <SidebarMenuButton
                            asChild
                            size="lg"
                            tooltip={item.title}
                            className="
                                h-10
                                rounded-lg
                                px-3
                                text-sm
                                font-medium
                                transition-colors
                                hover:bg-sidebar-accent
                                hover:text-sidebar-accent-foreground
                            "
                        >

                            <a href={item.href}>

                                <Icon className="size-4 shrink-0" />

                                <span>
                                    {item.title}
                                </span>

                            </a>

                        </SidebarMenuButton>

                    </SidebarMenuItem>

                );

            })}

        </SidebarMenu>

    );

}


export function AppSidebar(props) {

    return (

        <Sidebar
            collapsible="offcanvas"
            variant="sidebar"
            {...props}
        >

            {/* =====================================================
                BRAND
            ===================================================== */}

            <SidebarHeader className="px-3 py-4">

                <SidebarMenu>

                    <SidebarMenuItem>

                        <SidebarMenuButton
                            asChild
                            size="lg"
                            className="
                                h-12
                                rounded-xl
                                px-3
                                hover:bg-sidebar-accent
                            "
                        >

                            <a href="#dashboard">

                                <div
                                    className="
                                        flex
                                        size-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-primary
                                        text-primary-foreground
                                    "
                                >

                                    <Ticket className="size-4" />

                                </div>


                                <div className="flex flex-col gap-0.5">

                                    <span className="text-sm font-semibold">
                                        IT Helpdesk
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        Service Management
                                    </span>

                                </div>

                            </a>

                        </SidebarMenuButton>

                    </SidebarMenuItem>

                </SidebarMenu>

            </SidebarHeader>


            <SidebarSeparator />


            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <SidebarContent className="px-2 py-3">

                {/* Main */}

                <SidebarGroup>

                    <SidebarGroupLabel className="px-3 text-xs font-medium uppercase tracking-wider">
                        Workspace
                    </SidebarGroupLabel>

                    <SidebarGroupContent>

                        <NavigationItems
                            items={primaryItems}
                        />

                    </SidebarGroupContent>

                </SidebarGroup>


                {/* Documents */}

                <SidebarGroup className="mt-3">

                    <SidebarGroupLabel className="px-3 text-xs font-medium uppercase tracking-wider">
                        Documents
                    </SidebarGroupLabel>

                    <SidebarGroupContent>

                        <NavigationItems
                            items={documentItems}
                        />

                    </SidebarGroupContent>

                </SidebarGroup>


                {/* Support */}

                <SidebarGroup className="mt-3">

                    <SidebarGroupLabel className="px-3 text-xs font-medium uppercase tracking-wider">
                        Support
                    </SidebarGroupLabel>

                    <SidebarGroupContent>

                        <NavigationItems
                            items={supportItems}
                        />

                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <SidebarFooter className="p-3">

                <SidebarSeparator className="mb-3" />

                <SidebarMenu>

                    <SidebarMenuItem>

                        <SidebarMenuButton
                            size="lg"
                            className="
                                h-12
                                rounded-xl
                                px-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    size-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-muted
                                    text-xs
                                    font-semibold
                                "
                            >
                                IT
                            </div>


                            <div className="flex flex-col gap-0.5">

                                <span className="text-sm font-medium">
                                    IT Administrator
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    System operator
                                </span>

                            </div>

                        </SidebarMenuButton>

                    </SidebarMenuItem>

                </SidebarMenu>

            </SidebarFooter>

        </Sidebar>

    );

}