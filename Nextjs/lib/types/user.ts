import { FriendshipStatus } from "./friendship";
import { Notification } from "./notification";
import { Project } from "./projects";

export interface UserState {
    fullName: string;
    email: string;
    username: string;
    id:string;
    githubUrl:string| null;
    bio:string;
    avatar:string;
    isAuthenticated: boolean;
    notifications:Notification[];
  }
  export interface UserProfileDetails {
    id: string;
    fullName: string;
    username: string;
    bio: string | null;
    avatar: string | null;
    projects: Project[];
    isFriend: FriendshipStatus;
    totalFriends: number;
  }
  
  export type GetUserDetailsResult =
    | { success: true; user: UserProfileDetails }
    | { success: false; error: string };