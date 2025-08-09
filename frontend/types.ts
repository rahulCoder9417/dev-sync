import { getProjectById, getSingleProject } from "./lib/actions/projects/getProject";
import { FetchTeam } from "./lib/actions/projects/team";
import { getFriends } from "./lib/actions/user/getFriends";

export type ProjectPageType = Awaited<ReturnType<typeof getSingleProject>>;
export type ProjectById = Awaited<ReturnType<typeof getProjectById>>;
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


export interface User {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  }
  
 
  
  export interface Tab {
    id: string;
    name: string;
    type: 'file';
    content: string;
    isActive: boolean;
    isDirty: boolean;
  }
  
  export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
  }