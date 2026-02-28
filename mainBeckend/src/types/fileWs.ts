// Base types
export type UserInfo = {
  userId: string;
  username: string;
  fullName: string;
  projectId?: string | null;
  fileId?: string | null;
  avatar?: string | null;
};

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string;
  children: string[];
};
export type FileNodeWithChildren = Omit<FileNode, 'children'> & {
      fileChildren: string[];
      ancestorIds:string[]
      folderChildren: string[];
    }
export type CursorPosition = {
  line: number;
  column: number;
};

export type ScrollPosition = {
  top: number;
  left: number;
};

export type SelectionRange = {
  start: CursorPosition;
  end: CursorPosition;
};

export type AwarenessType = "cursor" | "selection" | "scroll";

export type UpdateType = "text" | "awareness";

// Action-specific message types
export type JoinMessage = {
  action: "join";
  projectId?: string;
  fileId?: string;
};

export type LeaveMessage = {
  action: "leave";
  projectId?: string;
  fileId?: string;
};

export type FileOpMessage = {
  action: "fileOp";
  projectId?: string;
  fileId?: string;
  type?: "create" | "rename";
  fileName: string;
  content?: string;
  newNode?: FileNodeWithChildren;
  fullName?: string;
  avatar?: string;
};

export type VoteDeleteMessage = {
  action: "vote_delete";
  projectId: string;
  fileId: string;
  fullName: string;
  fileName: string;
};

export type CancelVotingMessage = {
  action: "cancel_voting";
  projectId: string;
  fileId: string;
  fullName: string;
  fileName: string;
};

export type YjsCodeChangesMessage = {
  action: "YjsCodeChanges";
  projectId: string;
  fileId: string;
  updateType: "text";
  data: Uint8Array;
};

export type SyncUserPresenceMessage = {
  action: "syncUserPresence";
  projectId: string;
};

export type ChangeAdminMessage = {
  action: "changeAdmin";
  projectId: string;
  fileId: string;
  userId: string;
};

export type SyncMessage = {
  action: "sync";
  projectId: string;
  fileId: string;
};

export type SyncedDataMessage = {
  action: "syncedData";
  projectId: string;
  fileId: string;
  data: Uint8Array;
  updateType: UpdateType;
  include: string;
};

export type IncomingMessage = {
  action: "message";
  projectId?: string;
  fileId?: string;
  data?: any;
};

export type FileSaveMessage = {
  action: "fileSave";
  projectId: string;
  fileId: string;
  content: string;
};

export type AwarenessMessage = {
  action: "awareness";
  projectId: string;
  fileId: string;
  type: AwarenessType;
  scroll?: ScrollPosition;
  cursor?: CursorPosition;
  selection?: SelectionRange;
};

export type FileMoveMessage = {
  action: "fileMove";
  projectId: string;
  moveId: string;
  moveToId: string | null;
};

// Union type for all client messages
export type ClientMessage =
  | FileMoveMessage
  | JoinMessage
  | LeaveMessage
  | FileOpMessage
  | VoteDeleteMessage
  | CancelVotingMessage
  | YjsCodeChangesMessage
  | SyncUserPresenceMessage
  | ChangeAdminMessage
  | SyncMessage
  | SyncedDataMessage
  | IncomingMessage
  | FileSaveMessage
  | AwarenessMessage;

// Server-to-client broadcast message types
export type UserJoinedBroadcast = {
  type: "user_joined";
  room: string;
  user: UserInfo;
};

export type YouJoinedBroadcast = {
  type: "joined";
  room: string;
  you: UserInfo;
};

export type UserLeftBroadcast = {
  type: "user_left";
  room: string;
  user: UserInfo;
};

export type YouLeftBroadcast = {
  type: "left";
  room: string;
  you: UserInfo;
};

export type FileOpBroadcast = {
  type: "fileOp";
  room: string;
  from: UserInfo;
  projectId: string;
  fileId: string;
  action: "create" | "rename";
  newNode?: FileNodeWithChildren;
  fileName?: string;
  fullName?: string;
  content?: string;
  avatar?: string;
};

export type VotingBroadcast = {
  type: "voting";
  projectId: string;
  fileId: string;
  votingBy: string;
  fileName: string;
  required: number;
  done: string[];
};

export type FileDeletedBroadcast = {
  type: "file_deleted";
  projectId: string;
  fileId: string;
  deletedBy: string;
  fileName: string;
};

export type FileSaveBroadcast = {
  type: "fileSave";
  room: string;
  from: UserInfo;
  projectId: string;
  fileId: string;
  content: string;
};

export type AwarenessBroadcast = {
  type: "awareness";
  room: string;
  from: UserInfo;
  projectId: string;
  fileId: string;
  data: {
    type: AwarenessType;
    userId: string;
    scroll?: ScrollPosition;
    cursor?: CursorPosition;
    selection?: SelectionRange;
  };
};

export type YjsCodeChangesBroadcast = {
  type: "YjsCodeChanges";
  room: string;
  fileId: string;
  updateType: string;
  data: Uint8Array;
};

export type SyncBroadcast = {
  type: "sync";
  room: string;
  fileId: string;
  to: string;
};

export type ChangeAdminBroadcast = {
  type: "changeAdmin";
  projectId: string;
  fileId: string;
  userId: string;
};

export type MessageBroadcast = {
  type: "message";
  room: string;
  from: UserInfo;
  data: any;
};

export type ErrorBroadcast = {
  type: "error";
  projectId: string;
  fileId: string;
  message: string;
  fileName: string;
};

export type FileMove = {
  type: "fileMove";
  projectId: string;
  moveId: string;
  moveToId: string | null;
  from: UserInfo;
};
export type ServerBroadcast =
  | UserJoinedBroadcast
  | YouJoinedBroadcast
  | UserLeftBroadcast
  | YouLeftBroadcast
  | FileMove
  | FileOpBroadcast
  | VotingBroadcast
  | FileDeletedBroadcast
  | FileSaveBroadcast
  | AwarenessBroadcast
  | YjsCodeChangesBroadcast
  | SyncBroadcast
  | ChangeAdminBroadcast
  | MessageBroadcast
  | ErrorBroadcast;

// Error response types
export type ErrorResponse =
  | { error: "invalid_json"; message: string }
  | { error: "invalid_message" }
  | { error: "room_required" }
  | { error: "unknown_action" }
  | { error: "internal_error"; message: string };
