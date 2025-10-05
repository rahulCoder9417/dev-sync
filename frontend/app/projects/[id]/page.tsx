import ProjectPage from "@/components/project/ProjectPage";
import { Button } from "@/components/ui/button";
import { getSingleProject } from "@/lib/actions/projects/getProject";
import { FetchTeam } from "@/lib/actions/projects/team";
import Link from "next/link";

export default async function ProjectRoute({ params}: any) {
let projectData ,teamData;
const id = await  params.id;
  try {
     [projectData, teamData] = await Promise.all([
    getSingleProject(id),
    FetchTeam(id),
  ]);
  
  } catch (error) {
    console.error("Error loading project or team:", error);
  }

  if (!projectData || !teamData) {
    return (
      <div className="min-h-screen w-full bg-primary flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link href="/dashboard" prefetch={true}>
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }


  return (
    <ProjectPage
      project={projectData}
      teamInfo={teamData.team}
    />
  );
}
