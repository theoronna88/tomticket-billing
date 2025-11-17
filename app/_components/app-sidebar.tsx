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
import NavMain from "./nav-main";
import { data } from "./sidebar-items";
import { HomeIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { user } = useUser();
  const hasAPlan = user?.publicMetadata.subscriptionPlan == "paid";

  return (
    <Sidebar collapsible="offcanvas" {...props} className="no-print">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={"data-[slot=sidebar-menu-button]:p-1.5!"}
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
        <NavMain items={data.navMain} hasAPlan={hasAPlan} />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
