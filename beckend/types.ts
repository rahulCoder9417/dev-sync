import { WebSocket } from "ws";

export interface extWebSocket extends WebSocket {
  userId?: string;
  projectId?: string  | null;
  fileId?: string | null;
  username?: string;
  isAlive?: boolean;
  fullName?: string;
  avatar?: string | null;
  rooms?: Set<string>;
}


export type UserMeta = {
    userId: string;
    projectId?: string;
    fileId?: string;
    username: string;
    fullName: string;
    avatar?: string | null;
  };

export type ClientMessage =
  | { action: 'join'; projectId?: string; fileId?: string; }
  | { action: 'update'; projectId: string; fileId: string;updateType :"awareness" | "text";data:any }
  | { action: 'sync'; projectId: string; fileId: string;data:any }
  | { action: 'syncedData'; projectId: string; fileId: string;data:any ,updateType :"awareness" | "text",include:string}
  | { action: 'leave'; projectId?: string; fileId?: string; }
  | { action: 'fileOp'; projectId?: string; fileId?: string; type?: string; fileName: string; newNode?: any;fullName?:string;avatar?:string }
  | { action: 'message'; projectId?: string; fileId?: string; data?: any }
  | { action: 'vote_delete'; projectId: string; fileId: string;fullName:string,fileName:string; }
  | { action: 'cancel_voting'; projectId: string; fileId: string;fullName:string,fileName:string; };
