"use client";

if (typeof window === "undefined") {
  throw new Error("useTerminal can only run on the client");
}
import { showToast } from "@/components/main/Toast";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "xterm";
export type TerminalMessage =
  | { type: "output"; data: string }
  | { type: "started"; shell: string; cols: number; rows: number; cwd: string }
  | { type: "exit" }
  | { error: string; [k: string]: any };

export type TerminalClientMessage =
  | { type: "start"; cols?: number; rows?: number; cwd?: string }
  | { type: "input"; data: string }
  | { type: "resize"; cols: number; rows: number }
  | { type: "stop" };

export default function useTerminal(opts: {
  wsUrl?: string;
  autoConnect?: boolean;
  onMessage?: (msg: TerminalMessage) => void;
  projectId?: string;
  termRef?: React.RefObject<XTerminal | null>;
} = {}) {

  const { wsUrl = process.env.NEXT_PUBLIC_WS_URL_TERMINAL ?? "", projectId = "",autoConnect = true, onMessage,termRef } = opts;
  const { getToken } = useAuth();
  const hasConnectedRef = useRef(false);

  // Generate a stable terminalId per hook instance using browser crypto if available
  const genId = () => {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : {};
    const c = g.crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
    // Fallback UUID v4 polyfill
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
      const r = (Math.random() * 16) | 0;
      const v = ch === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  const terminalIdRef = useRef<string>(genId());
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "closed" | "error" | "reconnecting"
  >("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const manualClose = useRef(false);

  const buildWsUrl = useCallback(async () => {
    const token = await getToken({ template: "beckend-email-get" });
    if (!wsUrl) throw new Error("NEXT_PUBLIC_WS_URL_TERMINAL not set");
    if (!token) throw new Error("No auth token available");
    const t = terminalIdRef.current;
    return `wss${wsUrl}/ws/terminal?token=${token}&terminalId=${t}&projectId=${projectId}`;
  }, [wsUrl, projectId, getToken]);

  const connectingRef = useRef(false);

  const connect = useCallback(async () => {
    if (wsRef.current || connectingRef.current) return;
  
    connectingRef.current = true;
    setStatus("connecting");
  
    try {
      const url = await buildWsUrl();
      const ws = new WebSocket(url);
      wsRef.current = ws;
  
      ws.onopen = () => {
        connectingRef.current = false;
        setStatus("connected");
        ws.send(JSON.stringify({ action: "start" }));
        termRef?.current?.write("✓ Connected\r\n");
        showToast(true, "Terminal connected");
        reconnectAttempts.current = 0;
      };
  
      ws.onmessage = (ev) => {
        try {
          onMessage?.(JSON.parse(ev.data));
        } catch {}
      };
  
      ws.onerror = () => {
        connectingRef.current = false;
        setStatus("error");
      };
  
      ws.onclose = () => {
        wsRef.current = null;
        connectingRef.current = false;
  
        if (manualClose.current) {
          setStatus("closed");
          return;
        }
  
        setStatus("reconnecting");
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current++, 10000);
        setTimeout(connect, delay);
      };
    } catch {
      connectingRef.current = false;
      setStatus("error");
    }
  }, [buildWsUrl, onMessage]);
  
  const disconnect = useCallback(() => {
    manualClose.current = true;
    
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const send = useCallback((msg: TerminalClientMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;
    try {
      wsRef.current.send(JSON.stringify(msg));
      return true;
    } catch {
      return false;
    }
  }, []);

  const start = useCallback((cols?: number, rows?: number, cwd?: string) => {
    return send({ type: "start", cols, rows, cwd });
  }, [send]);

  const input = useCallback((data: string) => send({ type: "input", data }), [send]);
  const resize = useCallback((cols: number, rows: number) => send({ type: "resize", cols, rows }), [send]);
  const stop = useCallback(() => send({ type: "stop" }), [send]);

  useEffect(() => {
    if (autoConnect && status === "idle") connect();
    return () => {
  //export it and run on another dismount    disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return { status, connect, disconnect, start, input, resize, stop, ws: wsRef.current };
}
