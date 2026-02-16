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
    content?:string;
    type: "file" | "folder";
    parentId: string;
    children: FileNode[];
  };
  
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
    newNode?: FileNode;
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
    done:  string[];
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
  export type YjsCodeChangesFirstSyncBroadcast = {
    type: "YjsCodeChangesFirstSync";
    room: string;
    fileId: string;
    updateType: string;
    data: Uint8Array;
  };
  
  export type ErrorBroadcast = {
    type: "error";
    projectId: string;
    fileId: string;
    message: string;
    fileName: string;
  };
  
  export type ServerPayload =
    | UserJoinedBroadcast
    | YouJoinedBroadcast
    | UserLeftBroadcast
    | YouLeftBroadcast
    | FileOpBroadcast
    | VotingBroadcast
    | FileDeletedBroadcast
    | FileSaveBroadcast
    | AwarenessBroadcast
    | YjsCodeChangesBroadcast
    | YjsCodeChangesFirstSyncBroadcast
    | SyncBroadcast
    | ChangeAdminBroadcast
    | MessageBroadcast
    | ErrorBroadcast;
  