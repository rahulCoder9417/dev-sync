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
type FileOperationMessage = BaseMessage & (
  | { action: 'file_update'; filePath: string; content: any }
  | { action: 'file_delete'; filePath: string }
  | { action: 'file_vote'; projectId: string; fileId: string; }
);

// Chat message types
type ChatMessage = BaseMessage & (
  | { action: 'send_message'; roomId: string; content: string; type?: 'text' | 'file' | 'image' }
  | { action: 'typing_status'; roomId: string; isTyping: boolean }
  | { action: 'message_read'; roomId: string; messageId: string }
);

// Room management message types
type RoomManagementMessage = BaseMessage & (
  | { action: 'join_room'; roomId: string }
  | { action: 'leave_room'; roomId: string }
);

// Legacy message types (kept for backward compatibility)
type LegacyMessage =
  | { action: 'changeAdmin'; projectId: string; fileId: string; userId: string }
  | { action: 'chat'; chatType: 'global' | 'team' | 'direct'; id: string; message?: string; type: "join" | "leave" | "message" | "deleteMessage"; messageId?: string }
  | { action: 'syncUserPresence'; projectId: string; }
  | { action: 'join'; projectId?: string; fileId?: string; }
  | { action: 'update'; projectId: string; fileId: string; updateType: "awareness" | "text"; data: any }
  | { action: 'sync'; projectId: string; fileId: string; data: any }
  | { action: 'syncedData'; projectId: string; fileId: string; data: any; updateType: "awareness" | "text"; include: string }
  | { action: 'leave'; projectId?: string; fileId?: string; }
  | { action: 'fileOp'; projectId?: string; fileId?: string; content?: string; type?: string; fileName: string; newNode?: any; fullName?: string; avatar?: string }
  | { action: 'message'; projectId?: string; fileId?: string; data?: any }
  | { action: 'vote_delete'; projectId: string; fileId: string; fullName: string; fileName: string; }
  | { action: 'cancel_voting'; projectId: string; fileId: string; fullName: string; fileName: string; };

export type ClientMessage = FileOperationMessage | ChatMessage | RoomManagementMessage | LegacyMessage;
