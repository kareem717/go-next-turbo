import { getAccountProjectsAction } from "@/actions/project";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";

export const dynamic = "force-dynamic";

export default async function RootDashboardPage() {
  const response = await getAccountProjectsAction()

  const projects = response?.data || []

  return (
    <div className="flex flex-wrap gap-4">
      {projects.length > 0 ? projects.map((project) => (
        <Link
          key={project.id}
          href={redirects.projectDashboard(project.id).root} className="bg-secondary rounded-md aspect-square w-32 flex items-center justify-center"
        >
          {project.name}
        </Link>
      )) : <div className="flex-1">No projects found</div>}
    </div>
  )
}

