"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  CogIcon,
  DollarSignIcon,
  HomeIcon,
  LayoutTemplateIcon,
} from "lucide-react";
import NavMain from "./nav-main";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const data = {
    navMain: [
      {
        title: "Dashboard",
        href: "/app",
        icon: HomeIcon,
      },
      {
        title: "Settings",
        href: "/app/settings",
        icon: CogIcon,
      },
      {
        title: "Templates",
        href: "/app/templates",
        icon: LayoutTemplateIcon,
      },
      {
        title: "Gerar Fatura",
        href: "/app/billing",
        icon: DollarSignIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="no-print">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/app">
                <HomeIcon className="size-5" />
                TomTicket - Billing
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
