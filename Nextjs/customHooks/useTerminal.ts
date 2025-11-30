"use client";
import { showToast } from "@/components/main/Toast";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";

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
} = {}) {
  const { wsUrl = process.env.NEXT_PUBLIC_WS_URL_TERMINAL ?? "", autoConnect = true, onMessage } = opts;
  const { getToken } = useAuth();

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
    return `${wsUrl}/ws/terminal?token=${token}`;
  }, [wsUrl, getToken]);

  const connect = useCallback(async () => {
    setStatus("connecting");
    console.log("[WS] connecting...");
    try {
      const url = await buildWsUrl();
      const ws = new WebSocket(url);
      wsRef.current = ws;
      console.log("[WS] connected",url,ws.OPEN);
      ws.onopen = () => {
        setStatus("connected");
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (ev) => {
        try {
          console.log("[WS] received:", JSON.parse(ev.data));
          const payload = JSON.parse(ev.data) 
        } catch (e) {
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
