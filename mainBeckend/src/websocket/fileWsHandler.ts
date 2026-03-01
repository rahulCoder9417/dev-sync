import { RawData } from "ws";
import {  BaseWsHandler } from "./baseWsHandler.js";
import { deleteFileOrFolder } from "../lib/action/fileitem/deleteFile.js";
import RoomManager from "../utils/roomManagerFile.js";
import makeRoomId from "../utils/makeRoomId.js";
import { sendFileCreated, sendFileDeleted, sendFileMove, sendFileRenamed, sendFileUpdated } from "../services/renderSyncClient.js";
import { ExtWebSocket } from "../types/ws.js";
import { ClientMessage } from "../types/fileWs.js";
import path from "path";

export class FileWsHandler extends BaseWsHandler {
  private fileVotes: Map<string, Set<string>> = new Map();
  // key = `${projectId}:${fileId}`, value = set of userIds who voted
  private room: RoomManager;

  constructor() {
    super("/ws/file");
    this.room = new RoomManager();
  }
  protected handleDisconnect(ws: ExtWebSocket) {
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
  protected async handleMessage(ws: ExtWebSocket, data: RawData) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(data.toString());
    } catch (err) {
      const error = err as Error;
      ws.send(
        JSON.stringify({ error: "invalid_json", message: error.message })
      );
      return;
    }

    if (!parsed || typeof parsed !== "object" || !("action" in parsed)) {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }

    try {
      switch (parsed.action) {
        case "fileMove":
          this.handleFileMove(ws,parsed)
          break
        case "join":
          this.handleJoinRoom(ws, parsed);
          break;
        case "leave":
          this.handleLeaveRoom(ws, parsed );
          break;
        case "fileOp":
          //file op mainly create and rename
          this.handleFileUpdate(ws, parsed );
          
          break;
        case "cancel_voting":
          //cancel vote
          this.handleCancelVoting(ws, parsed );
          break;
        case "vote_delete":
          //for a file delete voting
          await this.handleVoteDelete(ws, parsed );
          break;
        case "YjsCodeChanges":
          //give yjs code chagnes
          this.handleYjsCodeChanges(ws, parsed );
          break;

        case "syncUserPresence":
          //when a user joins a file he can know the prev joined members and where are they
          this.handleSyncUserPresence(ws, parsed );
          break;
        case "changeAdmin":
          //for a file change admin
          this.handleChangeAdmin(ws, parsed );
          break;
        case "sync":
          //user ask for code sync
          this.handleSync(ws, parsed );
          break;
        case "syncedData":
          //when a user joins a file then it can ask for sync ,this is the synced datat given
          this.handleSyncedData(ws, parsed );
          break;
        case "message":
          this.handleMessageIncoming(ws, parsed );
          break;
        case "fileSave":
          // for file save
          this.handleFileSave(ws, parsed );
          break;
        case "awareness":
          //give awareness updates
          this.handleAwareness(ws, parsed );
          break;
        default:
          ws.send(JSON.stringify({ error: "unknown_action" }));
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error handling message:", err);
      ws.send(
        JSON.stringify({
          error: "internal_error",
          message: err.message || "An unknown error occurred",
        })
      );
    }
  }
  private handleAwareness(ws : ExtWebSocket,parsed : ClientMessage){
    if(!parsed || typeof parsed !== "object" || parsed.action!=="awareness") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId,fileId,type,scroll,cursor,selection} = parsed;
    const room = makeRoomId(projectId,fileId);
    if (!room || typeof room !== "string") {
      ws.send(JSON.stringify({ error: "room_required" }));
      return;
    }
    this.room.broadcastToRoom(
      room,
      {
        type: "awareness",
        room,
        from: {
          userId: ws.userId,
          username: ws.username,
          fullName: ws.fullName,
        },
        projectId: projectId,
        fileId: fileId,
        data:{type,
          userId:ws.userId,
        scroll,
        cursor,
        selection},
      },
      ws
    );
  }

  private handleFileMove(ws:ExtWebSocket,parsed:ClientMessage){
     if(!parsed || typeof parsed !== "object" || parsed.action!=="fileMove") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const {projectId,moveId,moveToId} = parsed
    const room = projectId;
    if (!room || typeof room !== "string") {
      ws.send(JSON.stringify({ error: "room_required" }));
      return;
    }
     this.room.broadcastToRoom(
      room,
      {
        type: "fileMove",
        room,
        from: {
          userId: ws.userId,
          username: ws.username,
          fullName: ws.fullName,
        },
        projectId: projectId,
        moveId,
        moveToId,
      },
      ws
    );
    sendFileMove({
      projectId,
      moveNode:moveId,
      moveToNode:moveToId,
    })
  }

  private handleFileSave(ws: ExtWebSocket, parsed: ClientMessage) {
    if(!parsed || typeof parsed !== "object" || parsed.action!=="fileSave") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId, content } =parsed;
    const room = projectId;
    if (!room || typeof room !== "string") {
      ws.send(JSON.stringify({ error: "room_required" }));
      return;
    }
    this.room.broadcastToRoom(
      room,
      {
        type: "fileSave",
        room,
        from: {
          userId: ws.userId,
          username: ws.username,
          fullName: ws.fullName,
        },
        projectId: projectId,
        fileId: fileId,
        content,
      },
      ws
    );
    sendFileUpdated({
      projectId,
      fileFolderId :fileId!,
      content,
    });
  }
  private handleJoinRoom(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "join") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId } = parsed;
    const room = makeRoomId(projectId, fileId);
    this.room.addToRoom(room, ws);
    //first sync to get the users in the project
    if (!fileId) {
      this.room.getRoomUsers(room).forEach((user) => {
        ws.send(
          JSON.stringify({
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
          })
        );
      });
    }
  }

  private handleLeaveRoom(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "leave") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId } = parsed;
    const room = makeRoomId(projectId, fileId);
    if (!room || typeof room !== "string") {
      ws.send(JSON.stringify({ error: "room_required" }));
      return;
    }
    this.room.removeFromRoom(room, ws);
  }

  private handleFileUpdate(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "fileOp") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId, type, fileName, fullName, avatar, content } =
      parsed;
    const room = projectId;
    if (!room || typeof room !== "string") {
      ws.send(JSON.stringify({ error: "room_required" }));
      return;
    }

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
    if(!parsed.newNode && type==="create"){
      return;
    }
    if(type==="create"){
      sendFileCreated({
        projectId,
        fileName,
        fileFolderId :parsed.newNode.id,
        isDir :parsed.newNode.type==="folder",
        parentId :fileId!,
      });
    }else if(type==="rename"){
      sendFileRenamed({
        projectId,
      fileFolderId :fileId!,
        fileName ,
      });
    }
  }

  private handleCancelVoting(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "cancel_voting") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId, fullName } = parsed;
    const key = `${projectId}:${fileId}:${fullName}`;
    this.fileVotes.delete(key);
  }

  private async handleVoteDelete(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "vote_delete") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }

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
        done: Array.from(votes),
      });
      this.room.broadcastToRoom(projectId, {
        type: "file_deleted",
        projectId,
        fileId,
        deletedBy: key.split(":")[2],
        fileName,
      });
      sendFileDeleted({
        projectId,
        fileFolderId :fileId!,
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
  }

  private handleYjsCodeChanges(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "YjsCodeChanges") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId, data, updateType } = parsed;
    const room = makeRoomId(projectId, fileId);
    this.room.broadcastToRoom(
      room,
      {
        type: "YjsCodeChanges",
        room,
        fileId,
        updateType,
        data,
      },
      ws
    );
  }

  private handleSyncUserPresence(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "syncUserPresence") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId } = parsed;
    const room = projectId;
    this.room.getRoomUsers(room).forEach((user) => {
      ws.send(
        JSON.stringify({
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
        })
      );
    });
  }

  private handleChangeAdmin(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "changeAdmin") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId, userId } = parsed;
    this.room.broadcastToRoom(
      projectId,
      {
        type: "changeAdmin",
        projectId,
        fileId,
        userId,
      },
      ws
    );
  }

  private handleSync(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "sync") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId } = parsed;

    let owner = this.room.getRoomUsers(makeRoomId(projectId, fileId))[0];
    if (owner && owner.userId !== ws.userId) {
      owner.send(
        JSON.stringify({
          type: "sync",
          room: makeRoomId(projectId, fileId),
          fileId,
          to: ws.userId,
        })
      );
    }
  }

  private handleSyncedData(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "syncedData") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
    const { projectId, fileId, data, updateType, include } = parsed;
    let isIn = this.room
      .getRoomUsers(makeRoomId(projectId, fileId))
      .find((user) => user.userId === include);
    if (!isIn) return;
    isIn.send(
      JSON.stringify({
        type: "YjsCodeChangesFirstSync",
        room: makeRoomId(projectId, fileId),
        data,
        fileId,
        updateType,
      })
    );
  }

  private handleMessageIncoming(ws: ExtWebSocket, parsed: ClientMessage) {
    if (parsed.action !== "message") {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }
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
  }

//function for render terminal second way connection
public handleSave(projectId:string,fileId:string,content:string){
  this.room.broadcastToRoom(
    projectId,
    {
      type: "fileSave",
      room:projectId,
      projectId,
      from: {
        userId: "",
        username: "",
        fullName: "From terminal",
      },
      fileId: fileId,
      content,
    })
}

public handleCreate(projectId:string,fileId:string,fileName:string,parentId:string){
  this.room.broadcastToRoom(
    projectId,
    {
      type: "fileOp",
      room:projectId,
      from: {
        userId: "",
        username: "",
        fullName: "From terminal",
      },
      projectId: projectId,
      fileId: parentId,
      action: "create",
      newNode: {
        id: fileId,
        name: fileName,
        type:fileName.endsWith(path.sep) ?"folder" : "file",
        children: [],
        parentId:parentId,
      },
    }
  );
}

public handleRename(projectId:string,fileId:string,fileName:string){
  this.room.broadcastToRoom(
    projectId,
    {
      type: "fileOp",
      room:projectId,
      from: {
        userId: "",
        username: "",
        fullName: "From terminal",
      },
      projectId: projectId,
      fileId: fileId,
      action: "rename",
      fileName: fileName,
    }
  );
}

  public handleDelete(projectId:string,fileId:string,fileName:string){
    this.room.broadcastToRoom(projectId, {
      type: "file_deleted",
      projectId,
      fileId,
      deletedBy: "From terminal",
      fileName,
    });
  
  }

//ignore
  protected sendGlobalUserList(ws: ExtWebSocket){}
}
