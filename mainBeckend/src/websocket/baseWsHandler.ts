import { WebSocket as WS, WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'http';
import { UserMeta } from '../types/user';
import { ExtWebSocket } from '../types/ws';



/* -------------------------------------------------------------------------- */
/*                             Base WS Handler                                 */
/* -------------------------------------------------------------------------- */

export abstract class BaseWsHandler {
  protected readonly wss: WebSocketServer;
  protected readonly path: string;

  constructor(path: string) {
    this.path = path;
    this.wss = new WebSocketServer({ noServer: true });
    this.setupEventHandlers();
  }

  /* ---------------- Connection Lifecycle ---------------- */

  protected setupEventHandlers(): void {
    this.wss.on(
      'connection',
      (ws: ExtWebSocket, req: IncomingMessage, user: UserMeta) => {
        this.initializeConnection(ws, user);

        this.sendGlobalUserList(ws);

        ws.on('message', (data: RawData) => {
          this.safeHandleMessage(ws, data);
        });

        ws.on('close', () => {
          this.handleDisconnect(ws);
        });
      }
    );

    this.setupHeartbeat();
  }

  protected initializeConnection(ws: ExtWebSocket, user: UserMeta): void {
    ws.rooms = new Set();
    ws.chatRooms = new Set();

    ws.userId = user.userId;
    ws.username = user.username;
    ws.fullName = user.fullName;
    ws.avatar = user.avatar ?? null;

    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });
  }

  /* ---------------- Heartbeat ---------------- */

  protected setupHeartbeat(): void {
    const interval = setInterval(() => {
      this.wss.clients.forEach((client) => {
        const ws = client as ExtWebSocket;

        if (!ws.isAlive) {
          console.log(
            `[WS] Terminating stale connection userId=${ws.userId}`
          );
          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  /* ---------------- Upgrade ---------------- */

  public handleUpgrade(
    request: IncomingMessage,
    socket: unknown,
    head: Buffer,
    user: UserMeta
  ): void {
    this.wss.handleUpgrade(request, socket as any, head, (ws) => {
      this.wss.emit('connection', ws, request, user);
    });
  }

  /* ---------------- Safe Message Wrapper ---------------- */

  protected async safeHandleMessage(
    ws: ExtWebSocket,
    data: RawData
  ): Promise<void> {
    try {
      await this.handleMessage(ws, data);
    } catch (error) {
      console.error(
        `[WS] Message handler error userId=${ws.userId}`,
        error
      );
    }
  }

  /* ---------------- Shutdown ---------------- */

  public close(): void {
    this.wss.close();
  }

  /* ---------------- Abstract API ---------------- */

  protected abstract handleMessage(
    ws: ExtWebSocket,
    data: RawData
  ): Promise<void>;

  protected abstract handleDisconnect(ws: ExtWebSocket): void;

  protected abstract sendGlobalUserList(ws: ExtWebSocket): void;
}
