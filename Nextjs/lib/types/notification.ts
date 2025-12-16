import { NotificationType } from "@prisma/client";

export interface Notification{
  id:string;
  createdAt:string;
  content:string;
  type:NotificationType;
  sender:{
    id:string;
    fullName:string;
    avatar:string;
    username:string;
  }
  message?:{
    teamId:string;
    dmChatRoomId:string;
    team?:{
        name:string
    }
  }
}