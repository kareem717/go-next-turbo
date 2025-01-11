import { Card, CardTitle, CardHeader, CardContent } from "@repo/ui/components/card";
import { CreateProjectForm } from "./components/create-project-form";

export const dynamic = "force-dynamic";

export default function CreateProjectPage() {
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <Card className="self-center">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProjectForm className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
