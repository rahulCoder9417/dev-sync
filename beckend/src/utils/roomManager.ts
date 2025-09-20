import { extWebSocket } from "../../types";
import makeRoomId from "./makeRoomId";

export default class RoomManager {
  private roomsCode: Map<string, Set<extWebSocket>>;
  constructor() {
    this.roomsCode = new Map();
  }
  public addToRoom(room: string, ws: extWebSocket) {
    if(ws.projectId && ws.fileId){
      const del = makeRoomId(ws.projectId,ws.fileId)
      this.removeFromRoom(del,ws)
    }
    let set = this.roomsCode.get(room);
    if (!set) {
      set = new Set();
      this.roomsCode.set(room, set);
    }
    set.add(ws);
    ws.rooms = ws.rooms ?? new Set();
    ws.rooms.add(room);
    ws.projectId=room.split(":")[0]!
    ws.fileId=room.split(":")[1] || null
    this.broadcastToRoom(
      room.split(":")[0]!,
      {
        type: "user_joined",
        room,
        user: {
          userId: ws.userId,
          avatar: ws.avatar,
          username: ws.username,
          fullName: ws.fullName,
          projectId: ws.projectId,
          fileId: ws.fileId,
        },
      },
      ws
    );
    ws.send(JSON.stringify({ type: "joined", room, you: {
      userId: ws.userId,
      username: ws.username,
      fullName: ws.fullName,
      avatar: ws.avatar,
      projectId: ws.projectId,
      fileId: ws.fileId,
    },}));
  } 
  public getRoomSize(room: string): number {
    const set = this.roomsCode.get(room);
    return set ? set.size : 0;
  }
  public getRoomUsers(room: string): extWebSocket[] {
    const set = this.roomsCode.get(room);
    return set ? Array.from(set) : [];
  }

  public removeFromRoom(room: string, ws: extWebSocket) {
    const set = this.roomsCode.get(room);
    if (!set) return;
    this.broadcastToRoom(
      room.split(":")[0]!,
      {
        type: "user_left",
        room,
        user: {
          userId: ws.userId,
          avatar: ws.avatar,
          username: ws.username,
          fullName: ws.fullName,
          projectId: ws.projectId,
          fileId: ws.fileId,
        },
      },
      ws
    );
    ws.send(JSON.stringify({ type: "left", room, you: {
      userId: ws.userId,
      username: ws.username,
      fullName: ws.fullName,
      avatar: ws.avatar,
      projectId: ws.projectId,
      fileId: ws.fileId,
    },}));
    set.delete(ws);
    if (set.size === 0) this.roomsCode.delete(room);
    ws.rooms?.delete(room);
    if(room.includes(":")){
      ws.fileId=null
    }else{
      ws.projectId=null
    }
  }

  public broadcastToRoom(
    room: string,
    payload: any,
    except?: extWebSocket | null
  ) {
    
    const set = this.roomsCode.get(room);
    if (!set) return;
    const raw = JSON.stringify(payload);
    for (const client of set) {
      if (client.readyState === 1 && client !== except) {
        client.send(raw);
      }
    }
  }
}
