
import CreateProject from "@/components/project/CreatePage";
import { createProjectWithTeam } from "@/lib/actions/projects/makeProject";
import { getFriends } from "@/lib/actions/user/getFriends";

export default async function CreateProjectPage() {
  const friends = await getFriends();

  return <CreateProject action={createProjectWithTeam} friends={friends} />;
}
