"use client"
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "./hooks";
import { connectChat, setupWebSocket, disconnectChat, setStatus } from "./features/chatSlice";
import { AppDispatch, RootState, store } from "./store";

/**
 * Chat Initializer Hook
 * This hook should be called once in the main app component to initialize WebSocket chat
 */

export async function currTokenUpdate() {
  
  const { getToken } = useAuth();
  const token = await getToken({ template: "beckend-email-get" });
  return token
}
export function useChatInitializer(isLoaded:boolean) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const chatStatus = useAppSelector((state) => state.chat.status);
  const initializingRef = useRef(false);
  const initializedRef = useRef(false);
  const { user } = useUser();
  useEffect(() => {
    // Prevent multiple initializations
    if(chatStatus === "reconnecting")initializedRef.current = false
    if (initializingRef.current || initializedRef.current || !isLoaded || !chatStatus || !user) {
      return;
    }

    // Only initialize if idle or reconnecting
    if (!["idle", "reconnecting"].includes(chatStatus)) {
      return;
    }

    const initializeChat = async () => {
      initializingRef.current = true;

      try {
        const token = await getToken({ template: "beckend-email-get" });
        if (!token) {
          console.warn("[chatInitializer] No token available");
          initializingRef.current = false;
          return;
        }

        // Build and connect
        const result = await dispatch(connectChat({ token }));
        if (connectChat.fulfilled.match(result)) {
          const url = result.payload;

          setupWebSocket(url, dispatch, store.getState);
          initializedRef.current = true;
        }
      } catch (err) {
        console.error("[chatInitializer] Failed to initialize chat:", err);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeChat();
  }, [dispatch, getToken, chatStatus,isLoaded,user]);
}

/**
 * Cleanup hook - call this when you want to disconnect chat (e.g., on logout)
 */
export function useChatCleanup() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    return () => {
      dispatch(disconnectChat());
    };
  }, [dispatch]);
}

/**
 * Manual connect function for use in components
 */
export async function connectChatManually(dispatch: any, getToken: any, getState: any) {
  try {
    const token = await getToken({ template: "beckend-email-get" });
    if (!token) {
      console.warn("[chatInitializer] No token available");
      return false;
    }

    const result = await dispatch(connectChat({ token }));
    
    if (connectChat.fulfilled.match(result)) {
      const url = result.payload;
      setupWebSocket(url, dispatch, getState);
      return true;
    }
    return false;
  } catch (err) {
    console.error("[chatInitializer] Failed to connect:", err);
    return false;
  }
}
