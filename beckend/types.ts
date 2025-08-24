import { WebSocket } from "ws";

export interface extWebSocket extends WebSocket {
  userId?: string;
  projectId?: string;
  fileId?: string;
  username?: string;
  isAlive?: boolean;
  fullName?: string;
  rooms?: Set<string>;
}


export type UserMeta = {
    userId: string;
    projectId?: string;
    fileId?: string;
    username: string;
    fullName: string;
  };

export type ClientMessage =
  | { action: 'join'; projectId?: string; fileId?: string; }
  | { action: 'leave'; projectId?: string; fileId?: string; }
  | { action: 'message'; projectId?: string; fileId?: string; data?: any };