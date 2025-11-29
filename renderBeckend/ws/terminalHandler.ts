import { WebSocketServer, WebSocket } from "ws";

class TerminalWS {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Local extension type for extra fields
  private static asExt(ws: WebSocket) {
    return ws as WebSocket & { userId?: string; isAlive?: boolean };
  }

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
    this.startHeartbeat();
  }

  private setup() {
    this.wss.on("connection", (ws: WebSocket, userId: string) => {
      const ext = TerminalWS.asExt(ws);
      ext.userId = userId;
      ext.isAlive = true;
      ext.send("connected");

      ext.on("pong", () => {
        ext.isAlive = true;
      });

      ext.on("message", (msg: Buffer) => {
        console.log("[WS] received:", msg.toString());
      });

      ext.on("close", () => {
        console.log(`[WS] client disconnected userId=${userId}`);
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
      this.wss.clients.forEach((client: WebSocket) => {
        const ext = TerminalWS.asExt(client);
        if (ext.isAlive === false) {
          console.log(`[WS] Terminating stale connection for userId=${ext.userId}`);
          return ext.terminate();
        }
        ext.isAlive = false;
        try {
          ext.ping();
        } catch (e) {
          console.error("[WS] ping error", e);
        }
      });
    }, 30000);
  }

  public upgrade(req: any, socket: any, head: any, userId: string) {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit("connection", ws, userId);
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
export const close = async () => {
  terminalWS.close();
};
export default terminalWS;
