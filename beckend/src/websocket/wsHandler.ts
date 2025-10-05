import { RawData, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { ClientMessage, extWebSocket, UserMeta } from "../../types";
import net from "net";
import RoomManager from "../utils/roomManager";
import makeRoomId from "../utils/makeRoomId";
import { json } from "zod";
import { deleteFileOrFolder } from "../../lib/action/fileitem/deleteFile";
import * as Y from "yjs";

export default class WsHandler {
  private wss: WebSocketServer;
  private docs: Map<string, Y.Doc> = new Map();

  private room: RoomManager;
  private fileVotes: Map<string, Set<string>> = new Map();
  // key = `${projectId}:${fileId}`, value = set of userIds who voted

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
        ws.avatar = user.avatar!;
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
            avatar: ws.avatar,
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

  private async handleMessage(ws: extWebSocket, data: RawData) {
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
        const room = makeRoomId(projectId, fileId);
        this.room.addToRoom(room, ws);
        if(!fileId){
          this.room.getRoomUsers(room).forEach((user)=>{
          ws.send(JSON.stringify({
            type: "user_joined",
            room,
            user: {
              userId: user.userId,
              avatar: user.avatar,
              username: user.username,
              fullName: user.fullName,
              projectId: user.projectId,
              fileId: user.fileId,
            },
          }))
        })}
        break;
      }

      case "leave": {
        const { projectId, fileId } = parsed;
        const room = makeRoomId(projectId, fileId);
        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "room_required" }));
          return;
        }
        this.room.removeFromRoom(room, ws);

        break;
      }
      case "fileOp": {
        const { projectId, fileId, type, fileName, fullName, avatar,content } = parsed;
        const room = projectId;
        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "room_required" }));
          return;
        }

        // Broadcast the message to the room (including sender)
        this.room.broadcastToRoom(
          room,
          {
            type: "fileOp",
            room,
            from: {
              userId: ws.userId,
              username: ws.username,
              fullName: ws.fullName,
            },
            projectId: projectId,
            fileId: fileId,
            action: type,
            newNode: parsed.newNode,
            fileName: fileName,
            fullName,
            content,
            avatar,
          },
          ws
        );
        break;
      }
      case "cancel_voting": {
        const { projectId, fileId, fullName } = parsed;
        const key = `${projectId}:${fileId}:${fullName}`;
        this.fileVotes.delete(key);
        break;
      }
      case "vote_delete": {
        const { projectId, fileId, fullName, fileName } = parsed;
        const key = `${projectId}:${fileId}:${fullName}`;

        if (!this.fileVotes.has(key)) {
          this.fileVotes.clear();
          this.fileVotes.set(key, new Set());
        }

        const votes = this.fileVotes.get(key)!;
        votes.add(ws.userId!);
        const roomSize = this.room.getRoomSize(projectId);
        if (votes.size === roomSize) {
          this.fileVotes.delete(key);
          const res = await deleteFileOrFolder(fileId, ws.userId!);
          if (!res.success) {
            this.room.broadcastToRoom(projectId, {
              type: "error",
              projectId,
              fileId,
              message: res.message,
              fileName,
            });
            return;
          }
          this.room.broadcastToRoom(projectId, {
            type: "voting",
            projectId,
            fileId,
            votingBy: key.split(":")[2],
            fileName,
            required: roomSize,
            done: votes.size,
          });
          this.room.broadcastToRoom(projectId, {
            type: "file_deleted",
            projectId,
            fileId,
            deletedBy: key.split(":")[2],
            fileName,
          });
        } else {
          this.room.broadcastToRoom(projectId, {
            type: "voting",
            projectId,
            fileId,
            votingBy: key.split(":")[2],
            fileName,
            required: roomSize,
            done: Array.from(votes),
          });
        }

        break;
      }

      case "update" :{
        const {projectId,fileId,data,updateType} = parsed
        const room = makeRoomId(projectId, fileId);
        this.room.broadcastToRoom(
          room,
          {
          type:"update",
          room,
          fileId,
           updateType,
          data,
        },
        ws
      )
        break;
      }
      case "syncUserPresence":{
        const {projectId} = parsed
        const room = projectId
        if (!room || typeof room !== "string") {
          ws.send(JSON.stringify({ error: "room_required" }));
          return;
        }
        this.room.getRoomUsers(room).forEach((user)=>{
          ws.send(JSON.stringify({
            type: "user_joined",
            room,
            user: {
              userId: user.userId,
              avatar: user.avatar,
              username: user.username,
              fullName: user.fullName,
              projectId: user.projectId,
              fileId: user.fileId,
            },
          }))
        })
        break;
      }

      case "changeAdmin":{
        const {projectId,fileId,userId} = parsed
          this.room.broadcastToRoom(projectId,{
          type:"changeAdmin",
          projectId,
          fileId,
          userId
        },ws)
        break
      }
      case "sync":{
        const {projectId,fileId,} = parsed
        let owner = this.room.getRoomUsers(makeRoomId(projectId, fileId))[0]
        if(owner && owner.userId !== ws.userId){
          owner.send(JSON.stringify({
            type:"sync",
            room:makeRoomId(projectId, fileId),
            fileId,
            to:ws.userId
          }))
        }
        break
      }
       case "syncedData":{
        const {projectId,fileId,data,updateType,include} = parsed
        let isIn = this.room.getRoomUsers(makeRoomId(projectId, fileId)).find((user)=>user.userId === include)
        if(!isIn)break
        isIn.send(JSON.stringify({
          type:"update",
          room:makeRoomId(projectId, fileId),
          data,
          fileId,
          updateType
        })) 
        break
      }
      case "message": {
        const { projectId, fileId, data } = parsed;
        const room = makeRoomId(projectId, fileId);
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
