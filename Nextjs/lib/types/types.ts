import { getProjectById, getSingleProject } from "../actions/projects/getProject";
import { FetchTeam } from "../actions/projects/team";
import { getFriends } from "../actions/user/getFriends";

export type ProjectPageType = Awaited<ReturnType<typeof getSingleProject>>;
export type ProjectById = Awaited<ReturnType<typeof getProjectById>>;
export type FriendsGet = Awaited<ReturnType<typeof getFriends>>;
export type TeamType = Awaited<ReturnType<typeof FetchTeam>>;
export interface ProjectPageMember{
    user: {
        fullName: string;
        avatar: string | null;
        username:string
    };
    userId: string;
    role?: "MEMBER"|"ADMIN";
    reason?:string | null;
    status?:"pending"|"accepted"|"rejected"

}
export type OneOrNone<T extends Record<string, boolean>> = | { [K in keyof T]: { [P in K]: true; } & { [P in Exclude<keyof T, K>]?: false; }; }[keyof T] | { [K in keyof T]?: false; };

export interface User {
    id: string;
    name: string;
    avatar: string;
    fullName: string;
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
  
  export type UserSummary = {
    userId: string;
    username?: string;
    fullName?: string;
    avatar?: string;
  };
  
  export type ServerPayload =
    | { type: "update"; room: string; fileId: string; updateType: string; data: any }
    | { type: "joined"; room: string; you: UserSummary }
    | { type: "left"; room: string; you: UserSummary }
    | { type: "awareness"; fileId: string,projectId:string; from: UserSummary; data: {type:string,scroll?:{top:number,left:number},cursor?:{x:number,y:number},selection?:{start:number,end:number}} }
    | { type: "user_joined"; room: string; user: UserSummary }
    | { type: "user_left"; room: string; user: UserSummary }
    | { type: "message"; room: string; from: UserSummary; data: any }
    | { type: "error"; message: string }
    | { type: string; [k: string]: any }; // fallback
  
    export type FileNode = {
      id: string;
      name: string;
      content?: string;
      type: 'file' | 'folder';
      parentId: string | null;
      children?: FileNode[];
    }
    