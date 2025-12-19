import { UserInfo } from "../types/fileWs";
import { ExtWebSocket } from "../types/ws";
import makeRoomId from "./makeRoomId";


export default class RoomManager {
  private rooms: Map<string, Set<ExtWebSocket>>;

  constructor() {
    this.rooms = new Map();
  }

  public addToRoom(room: string, ws: ExtWebSocket): void {
    this.handlePreviousRoomCleanup(ws);
    this.addClientToRoom(room, ws);
    this.updateClientMetadata(room, ws);
    this.notifyRoomOfJoin(room, ws);
    this.confirmJoinToClient(room, ws);
  }

  public removeFromRoom(room: string, ws: ExtWebSocket): void {
    const roomClients = this.rooms.get(room);
    if (!roomClients) return;

    this.notifyRoomOfLeave(room, ws);
    this.confirmLeaveToClient(room, ws);
    this.removeClientFromRoom(room, ws, roomClients);
    this.clearClientMetadata(room, ws);
  }

  public broadcastToRoom(
    room: string,
    payload: any,
    except?: ExtWebSocket | null
  ): void {
    const roomClients = this.rooms.get(room);
    if (!roomClients) return;

    const message = JSON.stringify(payload);
    
    for (const client of roomClients) {
      if (this.shouldSendToClient(client, except)) {
        client.send(message);
      }
    }
  }

  public getRoomSize(room: string): number {
    return this.rooms.get(room)?.size ?? 0;
  }

  public getRoomUsers(room: string): ExtWebSocket[] {
    return Array.from(this.rooms.get(room) ?? []);
  }

  private handlePreviousRoomCleanup(ws: ExtWebSocket): void {
    if (ws.projectId && ws.fileId) {
      const previousRoom = makeRoomId(ws.projectId, ws.fileId);
      this.removeFromRoom(previousRoom, ws);
    }
  }

  private addClientToRoom(room: string, ws: ExtWebSocket): void {
    let roomClients = this.rooms.get(room);
    
    if (!roomClients) {
      roomClients = new Set();
      this.rooms.set(room, roomClients);
    }
    
    roomClients.add(ws);
    ws.rooms = ws.rooms ?? new Set();
    ws.rooms.add(room);
  }

  private updateClientMetadata(room: string, ws: ExtWebSocket): void {
    const [projectId, fileId] = room.split(":");
    ws.projectId = projectId!;
    ws.fileId = fileId ?? null; // Fixed: was using != instead of =
  }

  private notifyRoomOfJoin(room: string, ws: ExtWebSocket): void {
    const projectId = room.split(":")[0]!;
    
    this.broadcastToRoom(
      projectId,
      {
        type: "user_joined",
        room,
        user: this.getUserInfo(ws),
      },
      ws
    );
  }

  private confirmJoinToClient(room: string, ws: ExtWebSocket): void {
    ws.send(
      JSON.stringify({
        type: "joined",
        room,
        you: this.getUserInfo(ws),
      })
    );
  }

  private notifyRoomOfLeave(room: string, ws: ExtWebSocket): void {
    const projectId = room.split(":")[0]!;
    
    this.broadcastToRoom(
      projectId,
      {
        type: "user_left",
        room,
        user: this.getUserInfo(ws),
      },
      ws
    );
  }

  private confirmLeaveToClient(room: string, ws: ExtWebSocket): void {
    ws.send(
      JSON.stringify({
        type: "left",
        room,
        you: this.getUserInfo(ws),
      })
    );
  }

  private removeClientFromRoom(
    room: string,
    ws: ExtWebSocket,
    roomClients: Set<ExtWebSocket>
  ): void {
    roomClients.delete(ws);
    
    if (roomClients.size === 0) {
      this.rooms.delete(room);
    }
    
    ws.rooms?.delete(room);
  }

  private clearClientMetadata(room: string, ws: ExtWebSocket): void {
    if (room.includes(":")) {
      ws.fileId = null;
    } else {
      ws.projectId = null;
    }
  }

  private getUserInfo(ws: ExtWebSocket): UserInfo {
    return {
      userId: ws.userId,
      username: ws.username,
      fullName: ws.fullName,
      avatar: ws.avatar,
      projectId: ws.projectId || null,
      fileId: ws.fileId || null,
    };
  }

  private shouldSendToClient(
    client: ExtWebSocket,
    except?: ExtWebSocket | null
  ): boolean {
    return client.userId !== except?.userId && client.readyState === 1;
  }
}