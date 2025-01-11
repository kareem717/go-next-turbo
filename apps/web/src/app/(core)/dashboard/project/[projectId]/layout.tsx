import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation";
import { getAccountProjectsAction } from "@/actions/project"
import { Separator } from "@repo/ui/components/separator";
import { ProjectDashboardSidebar } from "./components/project-dashboard-sidebar";
import { ProjectDashboardBreadcrumb } from "./components/project-dashboard-breadcrumb";
import { redirects } from "@/lib/config/redirects";
import { ProjectProvider } from "@/components/providers/project-provider";

export const metadata: Metadata = {
  title: {
    default: "Project Dashboard",
    template: "%s | Project Dashboard",
  },
}

export default async function ProjectDashboardLayout({ children, params }: { children: React.ReactNode, params: Promise<{ projectId: string }> }) {
  const projects = await getAccountProjectsAction()

  //TODO: handle error
  if (!projects?.data || projects?.data?.length < 1) {
    redirect(redirects.dashboard.createProject)
  }

  const { projectId } = await params;
  const parsedProjectId = parseInt(projectId);

  //TODO: can be improved when have large amount of projects
  const project = projects.data.find(project => project.id === parsedProjectId);

  if (!project) {
    return notFound();
  }

  return (
    <ProjectProvider projects={projects.data} defaultProject={project}>
      <SidebarProvider>
        <ProjectDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ProjectDashboardBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider >
    </ProjectProvider>
  );
}