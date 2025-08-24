// hooks/useCollab.ts
import { showToast } from "@/components/main/Toast";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Assumptions:
 * - Your app will provide a valid JWT token (string) from e.g. cookies/localStorage or next-auth.
 * - The WS server url is in process.env.NEXT_PUBLIC_WS_URL (e.g. "wss://example.com/ws" or "wss://api.example.com")
 *
 * Usage: const collab = useCollab({ token, onServerEvent });
 */

// --- Types (lightweight, match server messages)
export type UserSummary = {
  userId: string;
  username?: string;
  fullName?: string;
};

export type ServerPayload =
  | { type: "joined"; room: string; you: UserSummary }
  | { type: "user_joined"; room: string; user: UserSummary }
  | { type: "user_left"; room: string; user: UserSummary }
  | { type: "message"; room: string; from: UserSummary; data: any }
  | { type: "error"; error: string }
  | { type: string; [k: string]: any }; // fallback

export type ClientMessage =
  | { action: "join"; projectId: string; fileId?: string | null }
  | { action: "leave"; projectId: string; fileId?: string | null }
  | { action: "message"; projectId: string; fileId?: string | null; data: any }
  | { action: string; [k: string]: any }; // fallback

type UseCollabOptions = {
  autoConnect?: boolean; // default true
  wsUrl?: string; // override e.g. process.env.NEXT_PUBLIC_WS_URL
  onEvent?: (payload: ServerPayload) => void;
  maxReconnectAttempts?: number;
};

export default function useCollab(opts: UseCollabOptions = {}) {
  const {
    autoConnect = true,
    wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "",
    onEvent,
    maxReconnectAttempts = 5,
  } = opts;

  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "closed" | "error" | "reconnecting"
  >("idle");

  const [messages, setMessages] = useState<ServerPayload[]>([]);
  const [participants, setParticipants] = useState<Record<string, UserSummary>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const manualClose = useRef(false);
  
  const { getToken } = useAuth();

  const buildWsUrl = useCallback(async() => {
  const token =  getToken({template:"beckend-email-get"});
    if (!wsUrl) {
      showToast(false,"WebSocket URL not configured (NEXT_PUBLIC_WS_URL).");return
    }
    if (!token){
      showToast(true,"No token provided for WebSocket auth.");
      return
    }
    // attach token as query param per server upgrade handler
    let u = wsUrl + `?token=${await token}`;
    return u;
  }, [wsUrl]);

  // push message to local log
  const pushMsg = useCallback((payload: ServerPayload) => {
    setMessages((prev) => {
      const next = [...prev, payload];
      // cap at 200 messages
      if (next.length > 200) next.shift();
      return next;
    });
  }, []);

  // handle incoming server payload
  const handleServer = useCallback(
    (raw: MessageEvent) => {
      let payload: ServerPayload;
      try {
        payload = JSON.parse(raw.data);
      } catch {
        return;
      }

      // local handling for presence
      if (payload.type === "user_joined" && payload.user?.userId) {
        setParticipants((prev) => ({ ...prev, [payload.user.userId]: payload.user }));
        showToast(true,"USer Joined",payload.user.fullName)
      } else if (payload.type === "user_left" && payload.user?.userId) {
        showToast(true,"USer left",payload.user.fullName)
        setParticipants((prev) => {
          const copy = { ...prev };
          delete copy[payload.user.userId];
          return copy;
        });
      } else if (payload.type === "joined" && payload.you?.userId) {
        
        showToast(true,"you Joined",payload.you.fullName)
        // optionally set yourself in participants
        setParticipants((prev) => ({ ...prev, [payload.you.userId]: payload.you }));
      }

      pushMsg(payload);
      onEvent?.(payload);
    },
    [onEvent, pushMsg]
  );

  // open ws
  const connect = useCallback(async() => {
    try {
      const url = await buildWsUrl();
      manualClose.current = false;
      setStatus((s) => (s === "connected" ? s : "connecting"));

      const ws = new WebSocket(url!);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempts.current = 0;
        setStatus("connected");
        // optionally you can send an initial ping or subscribe messages
      };

      ws.onmessage = (ev) => handleServer(ev);

      ws.onerror = (ev) => {
        console.error("[collab] ws error", ev);
        setStatus("error");
      };

      ws.onclose = (ev) => {
        wsRef.current = null;
        if (manualClose.current) {
          setStatus("closed");
          return;
        }

        // attempt reconnect
        reconnectAttempts.current += 1;
        if (reconnectAttempts.current > maxReconnectAttempts) {
          setStatus("closed");
          console.warn("[collab] max reconnect attempts reached");
          return;
        }

        setStatus("reconnecting");
        // exponential backoff + jitter
        const backoff = Math.min(30000, 500 * Math.pow(1.8, reconnectAttempts.current));
        const jitter = Math.floor(Math.random() * 300);
        setTimeout(() => {
          if (!manualClose.current) connect();
        }, backoff + jitter);
      };
    } catch (err) {
      console.error("[collab] connect failed", err);
      setStatus("error");
    }
  }, [buildWsUrl, handleServer, maxReconnectAttempts]);

  // disconnect
  const disconnect = useCallback(() => {
    manualClose.current = true;
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {
        console.warn("[collab] error during close", err);
      }
      wsRef.current = null;
    }
    setStatus("closed");
  }, []);

  useEffect(() => {
    if (autoConnect && reconnectAttempts.current <= maxReconnectAttempts) {
      try {
        connect();
      } catch (err) {
        console.error(err);
      }
    }
    // cleanup on unmount
    return () => {
      manualClose.current = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, buildWsUrl]);

  // helpers for app-level messages
  const send = useCallback((msg: ClientMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[collab] trying to send but socket not open", msg);
      return false;
    }
    try {
      wsRef.current.send(JSON.stringify(msg));
      return true;
    } catch (err) {
      console.error("[collab] send failed", err);
      return false;
    }
  }, []);

  const join = useCallback((projectId: string, fileId?: string | null) => {
    return send({ action: "join", projectId, fileId });
  }, [send]);

  const leave = useCallback((projectId: string, fileId?: string | null) => {
    return send({ action: "leave", projectId, fileId });
  }, [send]);

  const sendMessage = useCallback((projectId: string, fileId: string | undefined, data: any) => {
    return send({ action: "message", projectId, fileId, data });
  }, [send]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    // state
    status,
    messages,
    participants,

    // control
    connect,
    disconnect,
    join,
    leave,
    sendMessage,
    clearMessages,

    // refs (for advanced use)
    ws: wsRef.current,
  };
}
