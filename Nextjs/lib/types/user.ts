import { Notification } from "./notification";

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
  