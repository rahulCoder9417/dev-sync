
/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type RoomId = string;
export type ChatType = "team" | "direct";

export type UserInfo = {
  userId: string;
  username?: string;
  fullName?: string;
  avatar?: string | null;
};

export type ChatEvent =
  | {
      type: 'typingStart';
      chatId: string;
      userId: string;
      fullName?: string;
      avatar?: string | null;
    }
  | {
      type: 'typingEnd';
      chatId: string;
      userId: string;
    }
  | {
      type: 'user_joined';
      room: string;
      user: {
        userId: string;
        username?: string;
        fullName?: string;
        avatar?: string | null;
      };
      timestamp: string;
    }
  | {
      type: 'user_left';
      room: string;
      userId: string;
      timestamp: string;
    };

export type ChatHistoryMessage = Record<string, unknown>;

export type ChatClientMessage =
  | {
      action: "send_message";
      chatType: "team" | "direct";
      chatId: string;
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      reciverId: string;
    }
  | { action: "join"; chatType: "team" | "direct"; chatId: string }
  | {
      action: "deleteMessage";
      chatId: string;
      messageId: string;
      chatType: "team" | "direct";
    }
  | { action: "leave"; chatType: "team" | "direct"; chatId: string }
  | { action: "read"; chatId: string; reciverId: string }
  | { action: "typingStart"; chatId: string }
  | { action: "typingEnd"; chatId: string };

/* -------------------------------------------------------------------------- */
/*                           Server-to-Client Types                           */
/* -------------------------------------------------------------------------- */

// User presence events
export type UserOnlineBroadcast = {
    type: "user_online";
    userId: string;
  };
  
  export type UserOfflineBroadcast = {
    type: "user_offline";
    userId: string;
  };
  
  export type UserOnlineTeamBroadcast = {
    type: "userOnlineTeam";
    userId: string;
  };
  
  // Typing events
  export type TypingStartBroadcast = {
    type: "typingStart";
    chatId: string;
    userId: string;
    fullName?: string;
    avatar?: string | null;
  };
  
  export type TypingEndBroadcast = {
    type: "typingEnd";
    chatId: string;
    userId: string;
  };
  
  // Message events
  export type ChatMessageBroadcast = {
    type: "chatMessage";
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    chatId: string;
    chatType: ChatType;
    isRead?: boolean;
    user: UserInfo;
  };
  
  export type ChatToastBroadcast = {
    type: "chatToast";
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    chatId: string;
    chatType: ChatType;
    isRead: boolean;
    user: UserInfo;
  };
  
  export type DeleteMessageBroadcast = {
    type: "deleteMessage";
    chatId: string;
    messageId: string;
    chatType: ChatType;
  };
  
  export type ChatReadBroadcast = {
    type: "chatRead";
    chatId: string;
    userId: string;
  };
  
  // Room events
  export type UserJoinedBroadcast = {
    type: "user_joined";
    room: string;
    user: UserInfo;
    timestamp: string;
  };
  
  export type UserLeftBroadcast = {
    type: "user_left";
    room: string;
    userId: string;
    timestamp: string;
  };
  
  // Error responses
  export type ChatErrorResponse =
    | { error: "invalid_json"; message: string }
    | { error: "invalid_message" }
    | { error: "unknown_action" }
    | { error: "internal_error"; message: string }
    | { error: "missing_parameters" }
    | { error: "failedToCreateMessaage" };
  
  // Union of all server broadcasts
  export type ChatServerBroadcast =
    | UserOnlineBroadcast
    | UserOfflineBroadcast
    | UserOnlineTeamBroadcast
    | TypingStartBroadcast
    | TypingEndBroadcast
    | ChatMessageBroadcast
    | ChatToastBroadcast
    | DeleteMessageBroadcast
    | ChatReadBroadcast
    | UserJoinedBroadcast
    | UserLeftBroadcast
    | ChatErrorResponse;