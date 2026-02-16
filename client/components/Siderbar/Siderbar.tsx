"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/constants/sidebar";
import { StorageLabel } from "../StorageLabel/StorageLabel";
import { Package } from "lucide-react";
import { UserDropdown } from "../UserDropdown/UserDropdown";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package />
            <span className="text-xl font-bold">Baza</span>
          </div>
          <UserDropdown />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-1">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="h-10"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        <StorageLabel />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
