
import CreateProject from "@/components/project/CreatePage";
import { createProjectWithTeam } from "@/lib/actions/projects/makeProject";
import { getFriends } from "@/lib/actions/user/getFriends";

export default async function CreateProjectPage() {

  return <CreateProject action={createProjectWithTeam} />;
}
