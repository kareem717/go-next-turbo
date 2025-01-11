"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu as SidebarMenuComponent,
} from "@repo/ui/components/sidebar"
import { ComponentPropsWithoutRef } from "react"
import { sidebar } from "@/lib/config/sidebar"
import { ChevronsUpDown, Plus } from "lucide-react"
import { redirects } from "@/lib/config/redirects"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@repo/ui/components/dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/components/dropdown-menu"
import { SidebarUser } from "@/components/sidebar-user"
import Link from "next/link"
import { SidebarMenu } from "@/components/sidebar-menu"
import { useProject } from "@/components/providers/project-provider"
import { useIsMobile } from "@repo/ui/hooks/use-mobile"

export function ProjectDashboardSidebar({ ...props }: ComponentPropsWithoutRef<typeof Sidebar>) {
  const { selectedProject, projects, setSelectedProject } = useProject();
  const isMobile = useIsMobile();

  const sidebarConfig = sidebar.projectDashboard(selectedProject.id)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <span className="text-lg uppercase">
                      {selectedProject.name[0]}
                    </span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {selectedProject.name}
                    </span>
                    {/* <span className="truncate text-xs">{business.plan}</span> */}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Linked Accounts
                </DropdownMenuLabel>
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {project.name[0]}
                    </div>
                    {project.name}
                    {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <Link
                    href={redirects.dashboard.createProject}
                    className="font-medium text-muted-foreground"
                    prefetch={true}
                  >
                    Create Project
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarHeader>
      <SidebarContent>
        {sidebarConfig.map((menu) => (
          <SidebarMenu key={menu.name} config={menu} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}
