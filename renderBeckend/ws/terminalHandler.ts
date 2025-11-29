import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket } from "../types";
import { IncomingMessage } from "http";

class TerminalWS {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;



  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
    this.startHeartbeat();
  }

  private setup() {
    this.wss.on("connection", (ws: ExtendedWebSocket, req: IncomingMessage) => {
      ws.send("connected");

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (msg: Buffer) => {
        console.log("[WS] received:", msg.toString());
      });

      ws.on("close", () => {
        console.log(`[WS] client disconnected userId=${ws.userId}`);
      });
    });

    this.wss.on("close", () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    });
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client: ExtendedWebSocket) => {
        
        if (client.isAlive === false) {
          console.log(`[WS] Terminating stale connection for userId=${client.userId}`);
          return client.terminate();
        }
        client.isAlive = false;
        try {
          client.ping();
        } catch (e) {
          console.error("[WS] ping error", e);
        }
      });
    }, 30000);
  }

  public upgrade(req: IncomingMessage, socket: any, head: any, userId: string) {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      ws.userId = userId;
      ws.isAlive = true;
      this.wss.emit("connection", ws, req);
    });
  }

  public close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.wss.close();
  }
}

const terminalWS = new TerminalWS();
export default terminalWS;
