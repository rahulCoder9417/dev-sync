"use client";
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
  | { action: "start"; cols?: number; rows?: number; cwd?: string }
  | { action: "input"; data: string }
  | { action: "resize"; cols: number; rows: number }
  | { action: "stop" };

export default function useTerminal(opts: {
  wsUrl?: string;
  autoConnect?: boolean;
  onMessage?: (msg: TerminalMessage) => void;
  projectId?: string;
  termRef?: React.RefObject<XTerminal | null>;
} = {}) {
  const { wsUrl = process.env.NEXT_PUBLIC_WS_URL_TERMINAL ?? "", projectId = "",autoConnect = true, onMessage,termRef } = opts;
  const { getToken } = useAuth();
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

  const connect = useCallback(async () => {
    setStatus("connecting");
    console.log("[WS] connecting...");
    try {
      const url = await buildWsUrl();
      console.log(url,"jjj")
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => {
        setStatus("connected");
        console.log("[WS] connected");
        
      termRef?.current?.write(`✓ Connected \r\n`);
        showToast(true,"Terminal connected")
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (ev) => {
        console.log("[WS] received:", ev);
        try {
          const payload = JSON.parse(ev.data) 
          onMessage?.(payload);
        } catch (e) {
          console.log("[WS] received:", e);
          // ignore non-JSON
        }
      };

      ws.onerror = () => {
        setStatus("error");
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (manualClose.current) {
          setStatus("closed");
          return;
        }
        setStatus("reconnecting");
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
        reconnectAttempts.current += 1;
        setTimeout(() => {
          connect();
        }, delay);
      };
    } catch (e) {
      console.log(e)
      setStatus("error");
    }
  }, [buildWsUrl]);

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
    return send({ action: "start", cols, rows, cwd });
  }, [send]);

  const input = useCallback((data: string) => send({ action: "input", data }), [send]);
  const resize = useCallback((cols: number, rows: number) => send({ action: "resize", cols, rows }), [send]);
  const stop = useCallback(() => send({ action: "stop" }), [send]);

  useEffect(() => {
    console.log("autoConnect", autoConnect);
    if (autoConnect) connect();
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return { status, connect, disconnect, start, input, resize, stop, ws: wsRef.current };
}
