import { RawData, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { ClientMessage, extWebSocket, UserMeta } from "../../types";
import net from "net";
import RoomManager from "../utils/roomManager";
import makeRoomId from "../utils/makeRoomId";

export default class WsHandler {
  private wss: WebSocketServer;
  private room: RoomManager;
  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.room = new RoomManager();
    this.wss.on(
      "connection",
      (ws: extWebSocket, req: IncomingMessage, user: UserMeta) => {
        ws.rooms = new Set();
        ws.userId = user.userId;
        ws.username = user.username;
        ws.fullName = user.fullName;

        ws.isAlive = true;
        ws.on("pong", () => {
          ws.isAlive = true;
        });

        ws.on("message", (message: RawData) => this.handleMessage(ws, message));
        ws.on("close", () => this.handleDisconnect(ws));
      }
    );

    const interval = setInterval(() => {
      this.wss.clients.forEach((client: any) => {
        if (!client.isAlive) {
          console.log(
            `[WS] Terminating stale connection for userId=${client.userId}`
          );
          return client.terminate();
        }
        client.isAlive = false;
        client.ping();
      });
    }, 30000);

    this.wss.on("close", () => clearInterval(interval));
  }

  private handleDisconnect(ws: extWebSocket) {
    const roomsToRemove = Array.from(ws.rooms ?? []);
    for (const room of roomsToRemove) {
      this.room.removeFromRoom(room, ws);
      this.room.broadcastToRoom(
        room,
        {
          type: "user_left",
          room,
          user: {
            userId: ws.userId,
            username: ws.username,
            fullName: ws.fullName,
          },
        },
        ws
      );
    }
  }

  public handleUpdate(
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

  
  private handleMessage(ws: extWebSocket, data: RawData) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(data.toString());
    } catch (err) {
      ws.send(JSON.stringify({ error: "invalid_json" }));
      return;
    }

    if (!parsed || typeof parsed !== "object" || !("action" in parsed)) {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }

    switch (parsed.action) {
      case "join": {
        const { projectId, fileId } = parsed;
        const room = makeRoomId(ws, projectId, fileId);
        this.room.addToRoom(room, ws);
        this.room.broadcastToRoom(
          room,
          {
            type: "user_joined",
            room: room.split("-")[0],
            user: {
              userId: ws.userId,
              username: ws.username,
              fullName: ws.fullName,
              projectId: ws.projectId,
              fileId: ws.fileId,
            },
          },
          ws
        );

        // Acknowledge to joiner
        ws.send(
          JSON.stringify({
            type: "joined",
            room,
            you: {
              userId: ws.userId,
              username: ws.username,
              fullName: ws.fullName,
            },
          })
        );
        break;
      }

      case "leave": {
        const { projectId, fileId } = parsed;
        const room = makeRoomId(ws, projectId, fileId);
        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "room_required" }));
          return;
        }
        this.room.removeFromRoom(room, ws);

        this.room.broadcastToRoom(
          room,
          {
            type: "user_left",
            room: room.split("-")[0],
            user: {
              userId: ws.userId,
              username: ws.username,
              fullName: ws.fullName,
            },
          },
          ws
        );

        ws.send(JSON.stringify({ type: "left", room }));
        break;
      }

      case "message": {
        const { projectId, fileId, data } = parsed;
        const room = makeRoomId(ws, projectId, fileId);
        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "room_required" }));
          return;
        }
        // Broadcast the message to the room (including sender)
        this.room.broadcastToRoom(room, {
          type: "message",
          room,
          from: {
            userId: ws.userId,
            username: ws.username,
            fullName: ws.fullName,
          },
          data: data ?? null,
        });
        break;
      }

      default:
        ws.send(JSON.stringify({ error: "unknown_action" }));
    }
  }
}
