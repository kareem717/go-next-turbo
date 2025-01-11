"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@repo/ui/components/sidebar"
import { SidebarMenu } from "@/components/sidebar-menu"
import { ComponentPropsWithoutRef } from "react"
import { SidebarUser } from "@/components/sidebar-user"
import { Command } from "lucide-react"
import { sidebar } from "@/lib/config/sidebar"

export function DashboardSidebar({ ...props }: ComponentPropsWithoutRef<typeof Sidebar>) {
  const { dashboard } = sidebar;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Dashboard</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {dashboard.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}
