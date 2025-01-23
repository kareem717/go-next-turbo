"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { redirects } from "@/lib/config/redirects";
import { useProject } from "@/components/providers/project-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function ProjectDashboardBreadcrumb() {
  const { selectedProject, projects } = useProject();
  const pathname = usePathname();

  const generatePath = (projectId: number): string => {
    return pathname.replace(/\/project\/\d+/, `/project/${projectId}`);
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={redirects.projectDashboard(selectedProject.id).root}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {selectedProject.name}
              <ChevronDownIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={generatePath(project.id)}>
                    {project.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
