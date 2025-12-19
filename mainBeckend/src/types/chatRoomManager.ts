
/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type RoomId = string;

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
