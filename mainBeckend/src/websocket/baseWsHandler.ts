import { WebSocket as WS, WebSocketServer, RawData } from "ws";
import { IncomingMessage } from "http";
import { UserMeta } from "../../types";;

export interface ExtWebSocket extends WS {
  isAlive: boolean;
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
  rooms: Set<string>;
  chatRooms: Set<string>;
}

export abstract class BaseWsHandler {
  protected wss: WebSocketServer;
  protected readonly path: string;

  constructor(path: string) {
    this.path = path;
    this.wss = new WebSocketServer({ noServer: true });
    this.setupEventHandlers();
  }

  protected setupEventHandlers() {
    this.wss.on("connection", (ws: ExtWebSocket, req: IncomingMessage, user: UserMeta) => {
      this.initializeConnection(ws, user);
      this.GlobalUserList(ws);
      ws.on("message", (data: RawData) => this.handleMessage(ws, data));
      ws.on("close", () => this.handleDisconnect(ws));
    });

    const interval = setInterval(() => {
      this.wss.clients.forEach((client: any) => {
        if (!client.isAlive) {
          console.log(`[WS] Terminating stale connection for userId=${client.userId}`);
          return client.terminate();
        }
        client.isAlive = false;
        client.ping();
      });
    }, 30000);

    this.wss.on("close", () => clearInterval(interval));
  }

  protected initializeConnection(ws: ExtWebSocket, user: UserMeta) {
    ws.rooms = new Set();
    ws.chatRooms = new Set();
    ws.userId = user.userId;
    ws.username = user.username;
    ws.fullName = user.fullName;
    ws.avatar = user.avatar!;
    ws.isAlive = true;
    
    ws.on("pong", () => {
      ws.isAlive = true;
    });
  }

  protected abstract handleDisconnect(ws: ExtWebSocket): void;
  public handleUpgrade(
    request: IncomingMessage,
    socket: any,
    head: Buffer,
    user: UserMeta
  ) {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit("connection", ws, request, user);
    });
  }

  public close() {
    this.wss.close();
  }

  protected abstract handleMessage(ws: ExtWebSocket, data: RawData): Promise<void>;


protected abstract GlobalUserList(ws: ExtWebSocket): void;}
