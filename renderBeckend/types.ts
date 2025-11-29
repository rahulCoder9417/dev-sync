import { WebSocket } from "ws";

export type ExtendedWebSocket = WebSocket & {
    userId?: string;
    isAlive?: boolean;
}