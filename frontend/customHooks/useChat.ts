"use client"
//Use for reference
import { showToast } from "@/components/main/Toast";
import { addOnlineUser, removeOnlineUser, clearOnlineUsers } from "@/lib/redux/features/onlineUserSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import { shallowEqual, useSelector } from "react-redux";

// Chat message types
export type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  chatType: "team" | "direct";
  chatId: string;
  createdAt: Date;
};

// Client message types for WebSocket
export type ClientChatMessage =
  | { action: "join"; chatType: "team" | "direct"; chatId: string }
  | { action: "leave"; chatType: "team" | "direct"; chatId: string }
  | { action: "send_message"; chatType: "team" | "direct"; chatId: string; content: string ;id:string}
  | { action: "typing"; chatType: "team" | "direct"; chatId: string; isTyping: boolean }
  | { action: string; [k: string]: any };

// Server payload types
export type ServerChatPayload =
  | { type: "message_received"; message: ChatMessage }
  | { type: "user_online"; userId: string }
  | { type: "user_offline"; userId: string }
  | { type: "user_joined"; chatType: "team" | "direct"; chatId: string; userId: string; userName: string }
  | { type: "user_left"; chatType: "team" | "direct"; chatId: string; userId: string; userName: string }
  | { type: "joined"; chatType: "team" | "direct"; chatId: string }
  | { type: "left"; chatType: "team" | "direct"; chatId: string }
  | { type: "typing"; chatType: "team" | "direct"; chatId: string; userId: string; isTyping: boolean }
  | { type: "error"; message: string }
  | { type: string; [k: string]: any };

type UseChatOptions = {
  autoConnect?: boolean;
  wsUrl?: string;
  onMessage?: (message: ChatMessage) => void;
  onEvent?: (payload: ServerChatPayload) => void;
  maxReconnectAttempts?: number;
};

export default function useChat(opts: UseChatOptions = {}) {
  const {
    autoConnect = true,
    wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "",
    onMessage,
    onEvent,
    maxReconnectAttempts = 15,
  } = opts;
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "closed" | "error" | "reconnecting"
  >("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [readyState, setReadyState] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const manualClose = useRef(false);
  const activeChatsRef = useRef<Set<string>>(new Set());

  const { getToken } = useAuth(); // Clerk setup

  // ---------- Utils + Setup ----------
  const buildWsUrl = useCallback(async () => {
    const token = await getToken({ template: "beckend-email-get" });
    if (!wsUrl) {
      showToast(false, "WebSocket URL not configured (NEXT_PUBLIC_WS_URL).");
      return;
    }

    if (!token) {
      showToast(true, "No token provided for WebSocket auth.");
      return;
    }
    
    // Attach token as query param
    let u = wsUrl + "/ws/chat" + `?token=${token}`;
    return u;
  }, [wsUrl, getToken]);

  // Push message to local log
  const pushMsg = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, message];
      // Keep only last 100 messages in memory
      if (next.length > 100) next.shift();
      return next;
    });
  }, []);

  // ----------------- Incoming Payload Processing -----------------
  const pendingPayloadsRef = useRef<ServerChatPayload[]>([]);
  const payloadFlushScheduledRef = useRef<number | null>(null);

  const processPayload = useCallback(
    (payload: ServerChatPayload) => {
      const performUpdates = () => {
        try {
          switch (payload.type) {
            case "message_received":
              pushMsg(payload.message);
              onMessage?.(payload.message);
              break;

            case "user_joined":
              showToast(true, `User ${payload.userName} joined ${payload.chatType} chat ${payload.chatId}`);
              break;

            case "user_left":
              showToast(true, `User ${payload.userName} left ${payload.chatType} chat ${payload.chatId}`);
              break;

            case "user_online":
              dispatch(addOnlineUser(payload.userId));
              break;

            case "user_offline":
              dispatch(removeOnlineUser(payload.userId));
              break;

            case "left":
              showToast(true, `You left ${payload.chatType} chat ${payload.chatId}`);
              activeChatsRef.current.delete(`${payload.chatType}:${payload.chatId}`);
              break;

            case "typing":
              // Handle typing indicators
              showToast(true, `User ${payload.userId} is ${payload.isTyping ? 'typing' : 'stopped typing'}`);
              break;

            case "error":
              showToast(false, "Chat Error", payload.message);
              break;

            default:
              console.log("[useChat] Unknown payload type:", payload.type);
              break;
          }

          onEvent?.(payload);
        } catch (err) {
          console.error("[useChat] performUpdates error", err);
        }
      };

      // Run in next macrotask
      window.setTimeout(() => {
        performUpdates();
      }, 0);
    },
    [onMessage, onEvent, pushMsg]
  );

  const flushPayloads = useCallback(() => {
    if (payloadFlushScheduledRef.current) {
      clearTimeout(payloadFlushScheduledRef.current);
      payloadFlushScheduledRef.current = null;
    }

    // Process FIFO
    while (pendingPayloadsRef.current.length > 0) {
      const p = pendingPayloadsRef.current.shift()!;
      try {
        processPayload(p);
      } catch (err) {
        console.error("[useChat] processPayload error", err);
      }
    }
  }, [processPayload]);

  // Handle incoming server payload
  const handleServer = useCallback(
    (raw: MessageEvent) => {
      let payload: ServerChatPayload;
      try {
        payload = JSON.parse(raw.data);
      } catch {
        return;
      }

      // Enqueue payload and schedule flush
      pendingPayloadsRef.current.push(payload);

      if (payloadFlushScheduledRef.current == null) {
        payloadFlushScheduledRef.current = window.setTimeout(() => {
          payloadFlushScheduledRef.current = null;
          flushPayloads();
        }, 0);
      }
    },
    [flushPayloads]
  );

  // ----------------- WebSocket Lifecycle -----------------
  const connect = useCallback(async () => {
    try {
      const url = await buildWsUrl();
      if (!url) return;

      manualClose.current = false;
      setStatus("connecting");
      let ws = new WebSocket(url);
      
      wsRef.current = ws;
      ws.onopen = () => {
        console.log("[useChat] WebSocket connection opened");
        showToast(true, "Chat connected");
        setReadyState(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (ev) => handleServer(ev);

      ws.onerror = (ev) => {
        console.error("[useChat] ws error", ev);
        setReadyState(false);
        setStatus("error");
        reconnectAttempts.current += 1;
      };

      ws.onclose = (ev) => {
        console.log("[useChat] WebSocket connection closed");
        wsRef.current = null;
        setReadyState(false);

        if (manualClose.current) {
          setStatus("closed");
          return;
        }

        // Attempt reconnect
        if (reconnectAttempts.current > maxReconnectAttempts) {
          setStatus("closed");
          showToast(false, "Chat disconnected. Max reconnect attempts reached.", ev.reason);
          console.warn("[useChat] max reconnect attempts reached");
          return;
        }

        setStatus("reconnecting");
        // Exponential backoff + jitter
        const backoff = Math.min(
          30000,
          500 * Math.pow(1.8, reconnectAttempts.current)
        );
        const jitter = Math.floor(Math.random() * 300);
        
        setTimeout(() => {
          if (!manualClose.current) {
            console.log(`[useChat] Reconnecting... Attempt ${reconnectAttempts.current + 1}`);
            connect();
          }
        }, backoff + jitter);
      };
    } catch (err) {
      console.error("[useChat] connect failed", err);
      setStatus("error");
      setReadyState(false);
    }
  }, [buildWsUrl, handleServer, maxReconnectAttempts]);

  // Disconnect
  const disconnect = useCallback(() => {
    manualClose.current = true;
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {
        console.warn("[useChat] error during close", err);
      }
      wsRef.current = null;
    }
    setStatus("closed");
    setReadyState(false);
    activeChatsRef.current.clear();
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && reconnectAttempts.current <= maxReconnectAttempts) {
      try {
        connect();
      } catch (err) {
        console.error(err);
      }
    }

    // Cleanup on unmount
    return () => {
      manualClose.current = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      // Cleanup pending payloads and flush timers
      if (payloadFlushScheduledRef.current) {
        clearTimeout(payloadFlushScheduledRef.current);
        payloadFlushScheduledRef.current = null;
      }
      pendingPayloadsRef.current.length = 0;
    };
  }, [autoConnect, connect, maxReconnectAttempts]);

  // ----------------- Outgoing Messages -----------------
  const send = useCallback((msg: ClientChatMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[useChat] trying to send but socket not open");
      // Optionally retry after a delay
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          send(msg);
        }
      }, 100);
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(msg));
      return true;
    } catch (err) {
      console.error("[useChat] send failed", err);
      return false;
    }
  }, []);

  // Join a chat room
  const joinChat = useCallback((chatType: "team" | "direct", chatId: string) => {
    return send({ action: "join", chatType, chatId });
  }, [send]);

  // Leave a chat room
  const leaveChat = useCallback((chatType: "team" | "direct", chatId: string) => {
    return send({ action: "leave", chatType, chatId });
  }, [send]);

  // Send a message
  const sendMessage = useCallback((
    chatType: "team" | "direct",
    chatId: string,
    id:string,
    content: string
  ) => {
    return send({ action: "send_message", chatType, chatId, content ,id});
  }, [send]);

  // Send typing indicator
  const sendTyping = useCallback((
    chatType: "team" | "direct",
    chatId: string,
    isTyping: boolean
  ) => {
    return send({ action: "typing", chatType, chatId, isTyping });
  }, [send]);

  // Clear local messages
  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    // State
    status,
    messages,
    readyState,
    isConnected: status === "connected",
    activeChats: Array.from(activeChatsRef.current),
    
    // Control
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    clearMessages,
  };
}
