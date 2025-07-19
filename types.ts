import { getSingleProject } from "./lib/actions/projects/getProject";
import { FetchTeam } from "./lib/actions/projects/team";

export type ProjectPageType = Awaited<ReturnType<typeof getSingleProject>>;
export type TeamType = Awaited<ReturnType<typeof FetchTeam>>;
export interface ProjectPageMember{
    user: {
        fullName: string;
        avatar: string | null;
    };
    userId: string;
    role?: "MEMBER"|"ADMIN";
    reason?:string | null;
    status?:"pending"|"accepted"|"rejected"

}