import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ChatToastType,
  showChatNotify,
  showToast,
} from "@/components/main/Toast";
import { addOnlineUser, removeOnlineUser } from "./onlineUserSlice";
import { AppDispatch, RootState } from "../store";
// Chat message types
export type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  chatType: "team" | "direct";
  chatId: string;
  createdAt: Date;
};

// Extended message type for UI
export interface Message {
  id: string;
  isRead: boolean;

  sender: {
    id: string;
    fullName: string;
    avatar: string;
    username: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
  limit: number;
}
export interface TypingUser {
  userId: string;
  fullName: string;
  avatar?: string | null;
}

export type TypingUsersMap = {
  [chatId: string]: TypingUser[];
};
export interface ChatCache {
  messages: Message[];
  pagination: PaginationInfo | null;
  currentPage: number;
  isFetched: boolean;
}

export interface MessagesCache {
  team: { [chatId: string]: ChatCache };
  direct: { [chatId: string]: ChatCache };
}

// Client message types for WebSocket
// Note: createdAt and updatedAt are strings when sent over WebSocket
export type ClientChatMessage =
  | { action: "read"; chatId: string; reciverId: string }
  | { action: "join"; chatType: "team" | "direct"; chatId: string }
  | { action: "leave"; chatType: "team" | "direct"; chatId: string }
  | {
      action: "send_message";
      chatType: "team" | "direct";
      chatId: string;
      content: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      reciverId: string;
    }
  | {
      action: "typing";
      chatType: "team" | "direct";
      chatId: string;
      isTyping: boolean;
    }
  | { action: string; [k: string]: any };

// Server payload types
// Note: createdAt and updatedAt are strings when received from WebSocket
export type ServerChatPayload =
  | {
      type: "chatMessage";
      id: string;
      content: string;
      createdAt: string;
      chatType: "team" | "direct";
      chatId: string;
      updatedAt: string;
      user: {
        userId: string;
        username: string;
        fullName: string;
        avatar: string;
      };
    }
  | {
      type: "chatToast";
      content: string;
      createdAt: string;
      chatType: "team" | "direct";
      id: string;
      updatedAt: string;
      chatId: string;
      user: {
        userId: string;
        username: string;
        fullName: string;
        avatar: string;
      };
    }
  | { type: "user_online"; userId: string }
  | { type: "user_offline"; userId: string }
  | {
      type: "deleteMessage";
      chatId: string;
      messageId: string;
      chatType: "team" | "direct";
    }
  | { type: "chatRead"; chatId: string; userId: string }
  | {
      type: "typingStart";
      chatId: string;
      userId: string;
      fullName: string;
      avatar: string;
    }
  | { type: "typingEnd"; chatId: string; userId: string }
  | { type: string; [k: string]: any };

interface ChatState {
  ws: boolean;
  status:
    | "idle"
    | "connecting"
    | "connected"
    | "closed"
    | "error"
    | "reconnecting";
  messages: ChatMessage[];
  readyState: boolean;
  typingUsers: TypingUsersMap;
  activeChats: string[];
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  wsUrl: string;
  manualClose: boolean;
  pendingPayloads: ServerChatPayload[];
  messagesCache: MessagesCache;
}

const initialState: ChatState = {
  ws: false,
  status: "idle",
  messages: [],
  readyState: false,
  typingUsers: {},
  activeChats: [],
  reconnectAttempts: 0,
  maxReconnectAttempts: 15,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "",
  manualClose: false,
  pendingPayloads: [],
  messagesCache: {
    team: {},
    direct: {},
  },
};

// Store WebSocket instance globally (outside Redux since it's not serializable)
let wsInstance: WebSocket | null = null;
let reconnectTimeoutId: NodeJS.Timeout | null = null;
let payloadFlushTimeoutId: NodeJS.Timeout | null = null;

// Async thunk to build WebSocket URL
export const connectChat = createAsyncThunk<
  string,
  { token: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "chat/connect",
  async ({ token }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const wsUrl = state.chat.wsUrl;

    if (!wsUrl) {
      showToast(false, "WebSocket URL not configured (NEXT_PUBLIC_WS_URL).");
      return rejectWithValue("WebSocket URL not configured");
    }

    if (!token) {
      showToast(true, "No token provided for WebSocket auth.");
      return rejectWithValue("No token provided");
    }

    const url = wsUrl + "/ws/chat" + `?token=${token}`;
    return url;
  }
);

// Process incoming server payloads
const processPayload = (payload: ServerChatPayload, dispatch: AppDispatch) => {
  try {
    switch (payload.type) {
      case "user_online":
        dispatch(addOnlineUser(payload.userId));
        break;

      case "deleteMessage":
        dispatch(
          deleteMessageFromCache({
            chatType: payload.chatType,
            chatId: payload.chatId,
            messageId: payload.messageId,
          })
        );
        break;
      case "user_offline":
        dispatch(removeOnlineUser(payload.userId));
        break;

      case "chatMessage":
        const incomingMessage: Message = {
          id: payload.id,
          sender: {
            id: payload.user.userId,
            fullName: payload.user.fullName,
            avatar: payload.user.avatar,
            username: payload.user.username,
          },
          content: payload.content,
          isRead: payload.chatType === "direct" ? true : false,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt,
        };
        dispatch(
          addMessageToCache({
            chatType: payload.chatType,
            chatId: payload.chatId,
            message: incomingMessage,
          })
        );
        break;

      case "chatToast":
        showChatNotify(payload as any);
        const c: Message = {
          id: payload.id,
          sender: {
            id: payload.user.userId,
            fullName: payload.user.fullName,
            avatar: payload.user.avatar,
            username: payload.user.username,
          },
          content: payload.content,
          createdAt: payload.createdAt,
          isRead: false,
          updatedAt: payload.updatedAt,
        };
        dispatch(
          addMessageToCacheAsync({
            chatType: payload.chatType,
            chatId: payload.chatId,
            message: c,
          })
        );
        break;

      case "chatRead":
        dispatch(
          updateMessageReadStatus({
            chatId: payload.chatId,
            userId: payload.userId,
          })
        );
        break;
      case "typingStart":
        dispatch(
          addTypingUser({
            chatId: payload.chatId,
            userId: payload.userId,
            fullName: payload.fullName,
            avatar: payload.avatar,
          })
        );
        break;
      case "typingEnd":
        dispatch(
          removeTypingUser({ chatId: payload.chatId, userId: payload.userId })
        );
        break;
      default:
        console.log("[chatSlice] Unknown payload type:", payload.type);
        break;
    }
  } catch (err) {
    console.error("[chatSlice] processPayload error", err);
  }
};

// Flush all pending payloads
const flushPayloads = (dispatch: AppDispatch, getState: () => RootState) => {
  if (payloadFlushTimeoutId) {
    clearTimeout(payloadFlushTimeoutId);
    payloadFlushTimeoutId = null;
  }

  const state = getState();
  const payloads = [...state.chat.pendingPayloads];

  // Clear pending payloads
  dispatch(clearPendingPayloads());

  // Process FIFO
  payloads.forEach((payload) => {
    try {
      processPayload(payload, dispatch);
    } catch (err) {
      console.error("[chatSlice] processPayload error", err);
    }
  });
};

// Handle incoming WebSocket message
const handleServerMessage = (
  raw: MessageEvent,
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  let payload: ServerChatPayload;
  try {
    payload = JSON.parse(raw.data);
  } catch {
    return;
  }

  // Enqueue payload
  dispatch(enqueuePendingPayload(payload));

  // Schedule flush if not already scheduled
  if (payloadFlushTimeoutId === null) {
    payloadFlushTimeoutId = setTimeout(() => {
      payloadFlushTimeoutId = null;
      flushPayloads(dispatch, getState);
    }, 0);
  }
};

// Setup WebSocket connection
const setupWebSocket = (
  url: string,
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  try {
    dispatch(setStatus("connecting"));
    dispatch(setManualClose(false));

    const ws = new WebSocket(url);
    wsInstance = ws;
    dispatch(setWebSocket(true));

    ws.onopen = () => {
      console.log("[chatSlice] WebSocket connection opened");
      showToast(true, "Chat connected");
      dispatch(setReadyState(true));
      dispatch(setStatus("connected"));
      dispatch(setReconnectAttempts(0));
    };

    ws.onmessage = (ev) => handleServerMessage(ev, dispatch, getState);

    ws.onerror = (ev) => {
      console.error("[chatSlice] ws error", ev);
      dispatch(setReadyState(false));
      dispatch(setStatus("error"));
      dispatch(incrementReconnectAttempts());
    };

    ws.onclose = (ev) => {
      console.log("[chatSlice] WebSocket connection closed");
      wsInstance = null;
      dispatch(setWebSocket(false));
      dispatch(setReadyState(false));

      const state = getState();
      if (state.chat.manualClose) {
        dispatch(setStatus("closed"));
        return;
      }

      // Attempt reconnect
      if (state.chat.reconnectAttempts >= state.chat.maxReconnectAttempts) {
        dispatch(setStatus("closed"));
        showToast(
          false,
          "Chat disconnected. Max reconnect attempts reached.",
          ev.reason
        );
        console.warn("[chatSlice] max reconnect attempts reached");
        return;
      }

      // Exponential backoff + jitter
      const backoff = Math.min(
        30000,
        500 * Math.pow(1.8, state.chat.reconnectAttempts)
      );
      const jitter = Math.floor(Math.random() * 300);

      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
      }

      reconnectTimeoutId = setTimeout(() => {
        const currentState = getState();
        if (!currentState.chat.manualClose) {
          console.log(
            `[chatSlice] Reconnecting... Attempt ${
              currentState.chat.reconnectAttempts + 1
            }`
          );
          dispatch(incrementReconnectAttempts());
          //how reconnet happens it will setStatus reconnecting then in Client App it will once agin call useChatInitializer
          dispatch(setStatus("reconnecting"));
        }
      }, backoff + jitter);
    };
  } catch (err) {
    console.error("[chatSlice] setupWebSocket failed", err);
    dispatch(setStatus("error"));
    dispatch(setReadyState(false));
  }
};

// Send message via WebSocket
export const sendChatMessage = (msg: ClientChatMessage) => {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) {
      console.warn("[chatSlice] trying to send but socket not open");

      // Optionally retry after a delay
      setTimeout(() => {
        if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
          try {
            wsInstance.send(JSON.stringify(msg));
          } catch (err) {
            console.error("[chatSlice] send retry failed", err);
          }
        }
      }, 100);
      return false;
    }

    try {
      wsInstance.send(JSON.stringify(msg));
      return true;
    } catch (err) {
      console.error("[chatSlice] send failed", err);
      return false;
    }
  };
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setWebSocket(state, action: PayloadAction<boolean>) {
      // We don't actually store the WebSocket in Redux (not serializable)
      // This is just for tracking
      state.ws = action.payload;
    },
    updateMessageReadStatus(
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) {
      const { chatId, userId } = action.payload;
      const chat = state.messagesCache["direct"][chatId];
      if (!chat) return;
      const newMessages = [...chat.messages];
      for (let i = newMessages.length - 1; i >= 0; i--) {
        const element = newMessages[i];

        if (element.sender.id !== userId) break;
        newMessages[i] = { ...element, isRead: true };
      }
      state.messagesCache.direct = {
        ...state.messagesCache.direct,
        [chatId]: {
          ...chat,
          messages: newMessages,
        },
      };
    },
    setStatus(state, action: PayloadAction<ChatState["status"]>) {
      state.status = action.payload;
    },
    setReadyState(state, action: PayloadAction<boolean>) {
      state.readyState = action.payload;
    },
    setManualClose(state, action: PayloadAction<boolean>) {
      state.manualClose = action.payload;
    },
    setReconnectAttempts(state, action: PayloadAction<number>) {
      state.reconnectAttempts = action.payload;
    },
    incrementReconnectAttempts(state) {
      state.reconnectAttempts += 1;
    },
    pushMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
      // Keep only last 100 messages in memory
      if (state.messages.length > 100) {
        state.messages.shift();
      }
    },
    clearMessages(state) {
      state.messages = [];
    },
    addActiveChat(state, action: PayloadAction<string>) {
      if (!state.activeChats.includes(action.payload)) {
        state.activeChats.push(action.payload);
      }
    },
    removeActiveChat(state, action: PayloadAction<string>) {
      state.activeChats = state.activeChats.filter(
        (chat) => chat !== action.payload
      );
    },
    enqueuePendingPayload(state, action: PayloadAction<ServerChatPayload>) {
      state.pendingPayloads.push(action.payload);
    },
    clearPendingPayloads(state) {
      state.pendingPayloads = [];
    },

    //typing
    addTypingUser(
      state,
      action: PayloadAction<{
        chatId: string;
        userId: string;
        fullName: string;
        avatar: string;
      }>
    ) {
      const { chatId, userId, fullName, avatar } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      state.typingUsers[chatId].push({ userId, fullName, avatar });
    },
    removeTypingUser(
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          (user) => user.userId !== userId
        );
      }
    },

    // Message cache actions

    addMessageToCache(
      state,
      action: PayloadAction<{
        chatType: "team" | "direct";
        chatId: string;
        message: Message;
      }>
    ) {
      const { chatType, chatId, message } = action.payload;
      if (!state.messagesCache[chatType][chatId]) {
        // use async thunk to add message to cache
        return
      }
      state.messagesCache[chatType][chatId].messages.push(message);
    },

    deleteMessageFromCache(
      state,
      action: PayloadAction<{
        chatType: "team" | "direct";
        chatId: string;
        messageId: string;
      }>
    ) {
      const { chatType, chatId, messageId } = action.payload;
      if (!state.messagesCache[chatType][chatId]) return;

      state.messagesCache[chatType][chatId].messages = state.messagesCache[
        chatType
      ][chatId].messages.filter((msg) => msg.id !== messageId);
    },

    updateChatCache(
      state,
      action: PayloadAction<{
        chatType: "team" | "direct";
        chatId: string;
        updates: Partial<ChatCache>;
      }>
    ) {
      const { chatType, chatId, updates } = action.payload;

      if (!state.messagesCache[chatType][chatId]) {
        state.messagesCache[chatType][chatId] = {
          messages: [],
          pagination: null,
          currentPage: 1,
          isFetched: true,
        };
      }

      state.messagesCache[chatType][chatId] = {
        ...state.messagesCache[chatType][chatId],
        ...updates,
      };
    },
    updateIsFetched(
      state,
      action: PayloadAction<{ chatType: "team" | "direct"; chatId: string; }>
    ) {
      const { chatType, chatId } = action.payload;
      if (!state.messagesCache[chatType][chatId]) return;
      state.messagesCache[chatType][chatId].isFetched = true;
    },
    setChatMessages(
      state,
      action: PayloadAction<{
        chatType: "team" | "direct";
        chatId: string;
        messages: Message[];
        pagination?: PaginationInfo | null;
      }>
    ) {
      const { chatType, chatId, messages, pagination } = action.payload;

      state.messagesCache[chatType][chatId] = {
        messages,
        pagination: pagination || null,
        currentPage: pagination?.currentPage || 1,
        isFetched: true,
      };
    },
    clearChatCache(
      state,
      action: PayloadAction<{ chatType: "team" | "direct"; chatId: string }>
    ) {
      const { chatType, chatId } = action.payload;
      delete state.messagesCache[chatType][chatId];
    },
    clearAllChatCaches(state) {
      state.messagesCache = {
        team: {},
        direct: {},
      };
    },
    disconnectChat(state) {
      state.manualClose = true;
      state.status = "closed";
      state.readyState = false;
      state.activeChats = [];

      // Close WebSocket if open
      if (wsInstance) {
        try {
          wsInstance.close();
        } catch (err) {
          console.warn("[chatSlice] error during close", err);
        }
        wsInstance = null;
      }

      // Clear timeouts
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
      }
      if (payloadFlushTimeoutId) {
        clearTimeout(payloadFlushTimeoutId);
        payloadFlushTimeoutId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectChat.fulfilled, (state, action) => {
      // Connection URL built successfully, now setup WebSocket
      // Actual setup is done via setupWebSocket function
    });
    builder.addCase(connectChat.rejected, (state, action) => {
      state.status = "error";
      state.readyState = false;
    });
  },
});

export const {
  setWebSocket,
  setStatus,
  setReadyState,
  setManualClose,
  setReconnectAttempts,
  incrementReconnectAttempts,
  pushMessage,
  clearMessages,
  addActiveChat,
  deleteMessageFromCache,
  removeActiveChat,
  enqueuePendingPayload,
  addTypingUser,
  removeTypingUser,
  clearPendingPayloads,
  updateMessageReadStatus,
  disconnectChat,
  addMessageToCache,
  updateChatCache,
  updateIsFetched,
  setChatMessages,
  clearChatCache,
  clearAllChatCaches,
} = chatSlice.actions;

export const addMessageToCacheAsync = createAsyncThunk<
  void,
  { chatType: "team" | "direct"; chatId: string; message: Message },
  { state: RootState; dispatch: AppDispatch }
>(
  "chat/addMessageToCacheAsync",
  async (payload, { getState, dispatch }) => {
    const { chatType, chatId, message } = payload;
    const state = getState();
    const existing = state.chat.messagesCache[chatType]?.[chatId];

    // If the cache for this chat is missing or not fetched, fetch initial page
    if (!existing || !existing.isFetched) {
      try {
        const response = await fetch(
          //1 is skipped because async add message only used when there is a chat toast ,so to let the user know about read functonality we dont fetch the last message message
          `/api/chat/messages/get?chatType=${chatType}&chatId=${chatId}&page=1&limit=30&skip=${1}`
        );
        //isFetched is false because when user open the chat comp and see there are message and the isFetched is false so it wil send a update to db to update read status
        if (response.ok) {
          const data = await response.json();
          dispatch(
            updateChatCache({
              chatType,
              chatId,
              updates: {
                messages: data.messages,
                pagination: data.pagination,
                currentPage: data.currentPage ?? 1,
                isFetched: false,
              },
            })
          );
        }
      } catch (err) {
        // Swallow fetch errors for now; we still add the message locally
        console.warn("[chatSlice] addMessageToCacheAsync fetch failed", err);
      }
    }

    // Finally push the new message into cache
    dispatch(addMessageToCache({ chatType, chatId, message }));
  }
);

// Helper action creators for common operations
export const joinChat = (chatType: "team" | "direct", chatId: string) => {
  return sendChatMessage({ action: "join", chatType, chatId });
};

export const leaveChat = (chatType: "team" | "direct", chatId: string) => {
  console.log("leaveChat", chatType, chatId);
  return sendChatMessage({ action: "leave", chatType, chatId });
};

export const sendMessage = (
  chatType: "team" | "direct",
  chatId: string,
  id: string,
  content: string,
  createdAt: string,
  updatedAt: string,
  reciverId: string
) => {
  return sendChatMessage({
    action: "send_message",
    chatType,
    chatId,
    content,
    id,
    createdAt,
    updatedAt,
    reciverId,
  });
};

export const sendTyping = (
  chatType: "team" | "direct",
  chatId: string,
  isTyping: boolean
) => {
  return sendChatMessage({ action: "typing", chatType, chatId, isTyping });
};

export default chatSlice.reducer;

//obj used to only return same refernece

// Selectors
export const selectChatStatus = (state: RootState) => state.chat.status;
export const selectChatReadyState = (state: RootState) => state.chat.readyState;
export const selectIsConnected = (state: RootState) =>
  state.chat.status === "connected";
export const selectActiveChats = (state: RootState) => state.chat.activeChats;
export const selectMessagesCache = (state: RootState) =>
  state.chat.messagesCache;
export const selectChatMessagesForChat = (
  state: RootState,
  chatType: "team" | "direct",
  chatId: string
) => state.chat.messagesCache[chatType]?.[chatId]?.messages || [];
export const selectChatCache = (
  state: RootState,
  chatType: "team" | "direct",
  chatId: string
) => {
  return (
    state.chat.messagesCache[chatType]?.[chatId] || {
      messages: [],
      pagination: null,
      currentPage: 1,
      isFetched: false,
    }
  );
};

// Export setup function for use in client app
export { setupWebSocket };
