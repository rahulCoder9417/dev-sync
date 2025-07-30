import { getSingleProject } from "./lib/actions/projects/getProject";
import { FetchTeam } from "./lib/actions/projects/team";
import { getFriends } from "./lib/actions/user/getFriends";

export type ProjectPageType = Awaited<ReturnType<typeof getSingleProject>>;
export type FriendsGet = Awaited<ReturnType<typeof getFriends>>;
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