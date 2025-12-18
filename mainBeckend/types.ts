import { WebSocket } from "ws";

export interface extWebSocket extends WebSocket {
  userId?: string;
  projectId?: string  | null;
  fileId?: string | null;
  username?: string;
  isAlive?: boolean;
  chatRooms?: Set<string>;
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

// Base message type with common fields
type BaseMessage = {
  roomId?: string;
  projectId?: string;
  fileId?: string;
  userId?: string;
  username?: string;
  fullName?: string;
  avatar?: string | null;
};

// File operation message types
type FileOperationMessage = BaseMessage & ( | { action: 'changeAdmin'; projectId: string; fileId: string; userId: string }
  | { action: 'chat'; chatType: 'global' | 'team' | 'direct'; id: string; message?: string; type: "join" | "leave" | "message" | "deleteMessage"; messageId?: string }
  | { action: 'syncUserPresence'; projectId: string; }
  | { action: 'join'; projectId?: string; fileId?: string; }
  | { action: 'YjsCodeChanges'; projectId: string; fileId: string; updateType:  "text"; data: Uint8Array }
  | { action: 'sync'; projectId: string; fileId: string; data: any }
  | { action: 'syncedData'; projectId: string; fileId: string; data: any; updateType: "awareness" | "text"; include: string }
  | { action: 'leave'; projectId?: string; fileId?: string; }
  | { action: 'fileOp'; projectId?: string; fileId?: string; content?: string; type?: string; fileName: string; newNode?: any; fullName?: string; avatar?: string }
  | { action: 'message'; projectId?: string; fileId?: string; data?: any }
  | { action: 'vote_delete'; projectId: string; fileId: string; fullName: string; fileName: string; }
  | { action: 'cancel_voting'; projectId: string; fileId: string; fullName: string; fileName: string; }
  | { action: 'fileSave'; projectId: string; fileId: string; content: string; }
  | { action: 'awareness'; projectId: string; fileId: string; type: "cursor" | "selection" | "scroll"; scroll?: { top: number; left: number }; cursor?: { line: number; column: number }; selection?: { start: { line: number; column: number }; end: { line: number; column: number } } }
);

// Chat message types
type ChatMessage = BaseMessage & (
  |  { action: 'send_message'; chatType: "team" | "direct", chatId: string, id: string, content: string;createdAt: string;updatedAt: string;reciverId: string}
  | { action: 'join'; chatType: "team" | "direct", chatId: string }
  | { action: 'deleteMessage'; chatId: string,messageId: string,chatType: "team" | "direct"}
  | { action: 'leave'; chatType: "team" | "direct", chatId: string }
  | { action: 'read'; chatId: string; reciverId: string }
  | {action : "typingStart";chatId: string;}
  | {action : "typingEnd";chatId: string;}
);


 
export type ClientMessage = FileOperationMessage | ChatMessage  ;
