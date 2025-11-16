"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import React from "react";
import AcquirePlanButton from "./acquire-plan-button";

const NavMain = ({
  items,
  hasAPlan,
}: {
  items: { title: string; href: string; icon: React.ElementType }[];
  hasAPlan: boolean;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 mt-4">
        <SidebarMenu>
          <SidebarMenuItem className="pb-4 px-6">
            <SidebarMenuButton asChild>
              <AcquirePlanButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                disabled={!hasAPlan}
                className={
                  hasAPlan
                    ? ""
                    : "pointer-events-none opacity-60 cursor-not-allowed"
                }
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavMain;
