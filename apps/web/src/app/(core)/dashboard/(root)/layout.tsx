import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { Separator } from "@repo/ui/components/separator";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@repo/ui/components/breadcrumb";

export default async function RootDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  Dashboard
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider >
  );
}
