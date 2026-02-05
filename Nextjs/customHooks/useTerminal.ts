"use client";

if (typeof window === "undefined") {
  throw new Error("useTerminal can only run on the client");
}
import { showToast } from "@/components/main/Toast";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "xterm";

// Binary protocol constants
const MSG_INPUT = 0x01;
const MSG_RESIZE = 0x02;
const MSG_STOP = 0x03;
// Server -> Client
const MSG_OUTPUT = 0x01;
const MSG_EXIT = 0x02;
const MSG_ERROR = 0x03;

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
        manualClose.current = false;
        connectingRef.current = false;
        setStatus("connected");
        ws.send(JSON.stringify({ action: "start" }));
        termRef?.current?.write("✓ Connected\r\n");
        showToast(true, "Terminal connected");
        reconnectAttempts.current = 0;
      };
  
      ws.onmessage = async (ev) => {
        try {
          // Handle binary messages
          if (ev.data instanceof Blob) {
            const buffer = await ev.data.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const type = bytes[0];

            if (type === MSG_OUTPUT) {
              // Output: 0x01 + raw data
              const data = new TextDecoder().decode(bytes.subarray(1));
              onMessage?.({ type: "output", data });
            } else if (type === MSG_EXIT) {
              // Exit: 0x02
              onMessage?.({ type: "exit" });
            } else if (type === MSG_ERROR) {
              // Error: 0x03 + error message
              const error = new TextDecoder().decode(bytes.subarray(1));
              onMessage?.({ error });
            }
            return;
          }
          // Fallback to JSON for start/other messages
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
      // Use binary for hot-path messages
      if (msg.type === "input") {
        const data = new TextEncoder().encode(msg.data);
        const buffer = new Uint8Array(1 + data.length);
        buffer[0] = MSG_INPUT;
        buffer.set(data, 1);
        wsRef.current.send(buffer);
        return true;
      }
      if (msg.type === "resize") {
        const buffer = new Uint8Array(5);
        buffer[0] = MSG_RESIZE;
        buffer[1] = (msg.cols >> 8) & 0xff;
        buffer[2] = msg.cols & 0xff;
        buffer[3] = (msg.rows >> 8) & 0xff;
        buffer[4] = msg.rows & 0xff;
        wsRef.current.send(buffer);
        return true;
      }
      if (msg.type === "stop") {
        wsRef.current.send(new Uint8Array([MSG_STOP]));
        return true;
      }
      // JSON for start and other commands
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
