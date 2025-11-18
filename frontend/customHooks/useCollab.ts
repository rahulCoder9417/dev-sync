"use client"
import { showToast } from "@/components/main/Toast";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import { ServerPayload, UserSummary } from "@/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { changeAdmin, updatePresence } from "@/lib/redux/features/collabCodeUserState";
import { addFileOp, addSaveFileOp } from "@/lib/redux/features/collabCodeFileOp";
import { updateCode } from "@/lib/redux/features/collabCodeEditorUpdate";
import { parseRoomKey ,makeRoomKey} from "@/lib/mainUtils/roomParser";

export type ClientMessage =
  | { action: "join"; projectId: string; fileId?: string | null }
  | { action: "leave"; projectId: string; fileId?: string | null }
  | { action: "message"; projectId: string; fileId?: string | null; data: any }
  | { action: string; [k: string]: any };

type UseCollabOptions = {
  autoConnect?: boolean;
  wsUrl?: string;
  onEvent?: (payload: ServerPayload) => void;
  maxReconnectAttempts?: number;
};

export default function useCollab(opts: UseCollabOptions = {}) {
  const {
    autoConnect = true,
    wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "",
    onEvent,
    maxReconnectAttempts = 15,
  } = opts;

  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "closed" | "error" | "reconnecting"
  >("idle");
  const [messages, setMessages] = useState<ServerPayload[]>([]);
  const [readyState, setReadyState] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Record<string, UserSummary>>(
    {}
  );
  const [deletionMenu, setdeletionMenu] = useState<{
    id: string;
    fileId: string;
    fileName: string;
    votingBy: string;
    required: number;
    done: string[];
  } | null>(null);
  const participantsRef = useRef<Map<string, UserSummary>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const manualClose = useRef(false);

  const { getToken } = useAuth(); //clerk setup

  // ---------- utils + setup ----------
  const buildWsUrl = useCallback(async () => {
    const token = await getToken({ template: "beckend-email-get" }); //check env sample for more details
    if (!wsUrl) {
      showToast(false, "WebSocket URL not configured (NEXT_PUBLIC_WS_URL).");
      return;
    }

    if (!token) {
      showToast(true, "No token provided for WebSocket auth.");
      return;
    }
    // attach token as query param per server upgrade handler
    let u = wsUrl+"/ws/file" + `?token=${token}`;
    return u;
  }, [wsUrl, getToken]);

  // push message to local log
  const pushMsg = useCallback((payload: ServerPayload) => {
    setMessages((prev) => {
      const next = [...prev, payload];
      if (next.length > 50) next.shift();
      return next;
    });
  }, []);

  // ----------------- Incoming payload buffering -----------------
  // Queue incoming payloads and process them in a macrotask so dispatches occur after render
  const pendingPayloadsRef = useRef<ServerPayload[]>([]);
  const payloadFlushScheduledRef = useRef<number | null>(null);
  const deletionRef = useRef<number>(-1);
  // Move the switch-case payload processor here (it does the actual state updates)
  const processPayload = useCallback(
    (payload: ServerPayload) => {
      const performUpdates = () => {
        try {
          switch (payload.type) {
            case "update":
              dispatch(
                updateCode({
                  fileId: payload.fileId,
                  type: payload.updateType,
                  data: payload.data,
                })
              );
              break;
            case "fileSave":
              showToast(true,"File saved by ii" )
              dispatch(
                addSaveFileOp({
                  projectId: payload.projectId,
                  fileId: payload.fileId,
                  content: payload.content,
                })
              );
              break;
            case "sync":
              dispatch(
                updateCode({
                  fileId: payload.fileId,
                  type: "sync",
                  data: payload.to,
                  stateDiff: payload.data,
                })
              );
              break;
            case "file_deleted":
              setTimeout(() => {
                setdeletionMenu(null)
              }, 500)
              showToast(
                true,
                "File deleted by" +
                  payload.deletedBy +
                  "on file" +
                  payload.fileName
              );
              dispatch(
                addFileOp({
                  type: "delete",
                  name: payload.fileName,
                  id: payload.fileId,
                  projectId: payload.projectId,
                })
              );
              break;
            case "voting":
              setdeletionMenu({
                id: payload.fileId,
                fileId: payload.fileId,
                fileName: payload.fileName,
                votingBy: payload.votingBy,
                required: payload.required,
                done: payload.done,
              });
              break;
            case "fileOp":
              showToast(
                true,
                "File Operation " +
                  payload.action +
                  " done by" +
                  payload.from.fullName +
                  "on file" +
                  payload.fileName
              );
              dispatch(
                addFileOp({
                  type: payload.action,
                  content:payload.content,
                  name: payload.fileName,
                  id: payload.fileId,
                  newNode: payload.newNode,
                  projectId: payload.projectId,
                })
              );
              break;
            case "user_joined":
              // showToast(true,"User joined " + payload.user.fullName)
              // setParticipants((prev) => ({
              //   ...prev,
              //   [payload.user.userId]: payload.user,

              // }));
              dispatch(
                updatePresence({
                  projectId: payload.user.projectId,
                  fileId: payload.user.fileId || null,
                  userId: payload.user.userId,
                  avatar: payload.user.avatar,
                  fullName: payload.user.fullName,
                  action: "join",
                })
              );
              !payload.room.includes(":") && participantsRef.current.set(payload.user.userId,payload.user);
              break;

            case "user_left":
         //     showToast(true,"User left " + payload.user.fullName)
              // setParticipants((prev) => {
              //   const copy = { ...prev };
              //   delete copy[payload.user.userId];
              //   return copy;
              // });
              dispatch(
                updatePresence({
                  projectId: payload.user.projectId,
                  fileId: payload.user.fileId || null,
                  userId: payload.user.userId,
                  avatar: payload.user.avatar,
                  fullName: payload.user.fullName,
                  action: "leave",
                })
              );
              !payload.room.includes(":") && participantsRef.current.delete(payload.user.userId);
              break;

            case "joined":
              // showToast(true,"You joined " + payload.you.fullName)
              // setParticipants((prev) => ({
              //   ...prev,
              //   [payload.you.userId]: payload.you,
              // }));
              dispatch(
                updatePresence({
                  projectId: payload.you.projectId,
                  fileId: payload.you.fileId || null,
                  userId: payload.you.userId,
                  avatar: payload.you.avatar,
                  fullName: payload.you.fullName,
                  action: "join",
                })
              );
              
              !payload.room.includes(":") && participantsRef.current.set(payload.you.userId,payload.you);
              break;

            case "left":
              // showToast(true,"You left " + payload.you.fullName)
              // setParticipants((prev) => {
              //   const copy = { ...prev };
              //   delete copy[payload.you.userId];
              //   return copy;
              // });
              dispatch(
                updatePresence({
                  projectId: payload.you.projectId,
                  fileId: payload.you.fileId || null,
                  userId: payload.you.userId,
                  avatar: payload.you.avatar,
                  fullName: payload.you.fullName,
                  action: "leave",
                })
              );
              !payload.room.includes(":")
                ? (participantsRef.current.delete(payload.you.userId))
                : null;
              break;
            case "changeAdmin":
              dispatch(
                changeAdmin({
                  projectId: payload.projectId,
                  fileId: payload.fileId,
                  userId: payload.userId,
                })
              );
              break;
            case "error":
              showToast(true, "Error", payload.message);
              break;

            default:
              // handle other payload types if needed
              break;
          }

          // push to local message log and call optional external handler
      //    pushMsg(payload);
          onEvent?.(payload);
        } catch (err) {
          console.error("[useCollab] performUpdates error", err);
        }
      };

      // DOUBLE-DEFER: first macrotask already enqueues flushPayloads,
      // now run performUpdates in a fresh macrotask so React has fully finished
      // any synchronous render/commit work before we mutate state.
      window.setTimeout(() => {
        performUpdates();
      }, 0);
    },
    [dispatch, onEvent, pushMsg]
  );

  const flushPayloads = useCallback(() => {
    // clear scheduled marker first
    if (payloadFlushScheduledRef.current) {
      clearTimeout(payloadFlushScheduledRef.current);
      payloadFlushScheduledRef.current = null;
    }

    // process FIFO
    while (pendingPayloadsRef.current.length > 0) {
      const p = pendingPayloadsRef.current.shift()!;
      try {
        processPayload(p);
      } catch (err) {
        console.error("[collab] processPayload error", err);
      }
    }
  }, [processPayload]);

  // handle incoming server payload (enqueue, schedule flush)
  const handleServer = useCallback(
    (raw: MessageEvent) => {
      let payload: ServerPayload;
      try {
        payload = JSON.parse(raw.data);
      } catch {
        return;
      }

      // Enqueue payload and schedule a macrotask flush
      pendingPayloadsRef.current.push(payload);

      if (payloadFlushScheduledRef.current == null) {
        // schedule as a macrotask so flush happens after current render/commit
        payloadFlushScheduledRef.current = window.setTimeout(() => {
          payloadFlushScheduledRef.current = null;
          flushPayloads();
        }, 0);
      }
    },
    [flushPayloads]
  );

  // ----------------- WebSocket lifecycle -----------------
  const connect = useCallback(async () => {
    try {
      const url = await buildWsUrl();
      manualClose.current = false;
      const ws = new WebSocket(url!);
      wsRef.current = ws;
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        setReadyState(true)
        setStatus("connected");
        // optionally you can send an initial ping or subscribe messages
      };

      ws.onmessage = (ev) => handleServer(ev);

      ws.onerror = (ev) => {
        console.error("[collab] ws error", ev);
        setReadyState(false)
        setStatus("error");
        reconnectAttempts.current += 1;
      };

      ws.onclose = (ev) => {
        console.log("WebSocket connection closed");
        wsRef.current = null;
        setReadyState(false)
        if (manualClose.current) {
          setStatus("closed");
          return;
        }

        // attempt reconnect
        if (reconnectAttempts.current > maxReconnectAttempts) {
          setReadyState(false)
          setStatus("closed");
          showToast(false, "max reconnect attempts reached", ev.reason);
          console.warn("[collab] max reconnect attempts reached");
          return;
        }

        setStatus("reconnecting");
        // exponential backoff + jitter
        const backoff = Math.min(
          30000,
          500 * Math.pow(1.8, reconnectAttempts.current)
        );
        const jitter = Math.floor(Math.random() * 300);
        setTimeout(() => {
          if (!manualClose.current) connect();
        }, backoff + jitter);
      };
    } catch (err) {
      console.error("[collab] connect failed", err);
      setStatus("error");
      setReadyState(false)
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
    setReadyState(false)
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
      // cleanup pending payloads and flush timers
      if (payloadFlushScheduledRef.current) {
        clearTimeout(payloadFlushScheduledRef.current);
        payloadFlushScheduledRef.current = null;
      }
      pendingPayloadsRef.current.length = 0;
    };
  }, [autoConnect, buildWsUrl, connect]);

  // helpers for app-level messages
  const send = useCallback((msg: ClientMessage) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("[collab] trying to send but socket not open");
      setTimeout(() => {
        send(msg);
      }, 20);
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

  // ----------------- Outgoing join/leave buffering -----------------
  const pendingJoinsRef = useRef<Set<string>>(new Set());
  const pendingLeavesRef = useRef<Set<string>>(new Set());
  const flushScheduledRef = useRef<number | null>(null);

  // flush function uses `send`
  const flushPending = useCallback(() => {
    if (!wsRef.current || (wsRef.current.readyState !== WebSocket.OPEN && !readyState)) {
      setTimeout(() => {
        flushPending();
      }, 0);
      return} ;

    // process leaves first
    for (const key of Array.from(pendingLeavesRef.current)) {
      console.log("leave")
      const { projectId, fileId } = parseRoomKey(key);
      const ok = send({ action: "leave", projectId, fileId: fileId ?? null });
      if (ok) pendingLeavesRef.current.delete(key);
      // if send fails (socket closed) we keep the key to retry later
    }
    // then joins
    for (const key of Array.from(pendingJoinsRef.current)) {
      console.log("join")
      const { projectId, fileId } = parseRoomKey(key);
      const ok = send({ action: "join", projectId, fileId: fileId ?? null });
      if (ok) pendingJoinsRef.current.delete(key);
    }
  }, [send]);

  const scheduleFlush = () => {
    if (flushScheduledRef.current != null) return;
    flushScheduledRef.current = window.setTimeout(() => {
      if (flushScheduledRef.current) {
        clearTimeout(flushScheduledRef.current);
        flushScheduledRef.current = null;
      }
      flushPending();
    }, 0);
  };

  // flush queued sends when socket becomes connected
  useEffect(() => {
    if (status === "connected" ) {
      let a = flushPending();
     
    }
  }, [status, flushPending,readyState]);

  const join = useCallback((projectId: string, fileId?: string | null) => {
    const key = makeRoomKey(projectId, fileId);
    // cancel any pending leave
    pendingLeavesRef.current.delete(key);
    pendingJoinsRef.current.add(key);
    scheduleFlush();
    return true;
  }, []);

  const leave = useCallback((projectId: string, fileId?: string | null) => {
    const key = makeRoomKey(projectId, fileId);
    // cancel any pending join
    pendingJoinsRef.current.delete(key);
    pendingLeavesRef.current.add(key);
    scheduleFlush();
    return true;
  }, []);

  const sendMessage = useCallback(
    (
      message: string,
      projectId: string,
      fileId?: string ,
      data?: any
    ) => {
      return send({ action: message, projectId, fileId, ...data });
    },
    [send]
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  // cleanup of timers/queues on unmount
  useEffect(() => {
    return () => {
      if (flushScheduledRef.current) {
        clearTimeout(flushScheduledRef.current);
        flushScheduledRef.current = null;
      }
      pendingJoinsRef.current.clear();
      pendingLeavesRef.current.clear();

      if (payloadFlushScheduledRef.current) {
        clearTimeout(payloadFlushScheduledRef.current);
        payloadFlushScheduledRef.current = null;
      }
      pendingPayloadsRef.current.length = 0;
    };
  }, []);

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
    setdeletionMenu,
    deletionMenu,
    clearMessages,
    deletionRef,
    participantsRef,

    // refs (for advanced use)
    ws: wsRef.current,
  };
}
