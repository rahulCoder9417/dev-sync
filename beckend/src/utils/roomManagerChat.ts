import { extWebSocket } from "../../types";

export default class RoomManager {
  public chatRooms: Map<string, Map<string,extWebSocket>>;
  private messageHistory: Map<string, any[]>;
  private typingUsers: Map<string, Set<extWebSocket>>;
  public users: Map<string, extWebSocket>;
  constructor() {
    this.chatRooms = new Map();
    this.messageHistory = new Map();
    this.typingUsers = new Map();
    this.users = new Map();
  }
  
  public addToTypingStatus(roomId: string, ws: extWebSocket) {
    if(!this.typingUsers.has(roomId)){this.typingUsers.set(roomId, new Set())}
    let room = this.typingUsers.get(roomId);
    if(room!.has(ws)){return}
    room!.add(ws);
    this.broadcastToRoom(roomId,{type:"typingStart", chatId:roomId, userId:ws.userId,fullName:ws.fullName,avatar:ws.avatar},ws);
  }

  public removeFromTypingStatus(roomId: string, ws: extWebSocket) {
    this.typingUsers.get(roomId)?.delete(ws);
    if(this.typingUsers.get(roomId)?.size === 0){
      this.typingUsers.delete(roomId);
    }
    this.broadcastToRoom(roomId,{type:"typingEnd", chatId:roomId, userId:ws.userId},ws);
  }

  public addToGlobalUserList(ws: extWebSocket) {
    this.users.set(ws.userId!, ws);
  }

  public removeFromGlobalUserList(ws: extWebSocket) {
    this.users.delete(ws.userId!);
  }

  public addToRoom(roomId: string, ws: extWebSocket,notBroad ?:boolean) {
    let room = this.chatRooms.get(roomId);
    if (!room) {
      room = new Map();
      this.chatRooms.set(roomId, room);
      this.messageHistory.set(roomId, []);
      this.typingUsers.set(roomId, new Set());
    }

    room.set(ws.userId!,ws);
    ws.chatRooms = ws.chatRooms || new Set();
    ws.chatRooms.add(roomId);
    if(notBroad)return
    // Notify others in the room
    this.broadcastToRoom(
      roomId,
      {
        type: "user_joined",
        room: roomId,
        user: {
          userId: ws.userId,
          avatar: ws.avatar,
          username: ws.username,
          fullName: ws.fullName,
        },
        timestamp: new Date().toISOString(),
      },
      ws
    );
  }

  public removeFromRoom(roomId: string, ws: extWebSocket,notBroad?:boolean) {
    const room = this.chatRooms.get(roomId);
    if (!room) return;

    // Remove user from typing status
    this.clearTypingStatus(roomId,ws);

    // Remove from room
    room.delete(ws.userId!);
    ws.chatRooms?.delete(roomId);

    // Clean up empty rooms
    if (room.size === 0) {
      this.chatRooms.delete(roomId);
      this.typingUsers.delete(roomId);
    }
    if (notBroad) {
      return
    }
    // Notify others in the room
    this.broadcastToRoom(
      roomId,
      {
        type: "user_left",
        room: roomId,
        userId: ws.userId,
        timestamp: new Date().toISOString(),
      },
      ws
    );
  }

  public broadcastToRoom(roomId: string, message: any, except?: extWebSocket) {
    const room = this.chatRooms.get(roomId);
    if (!room) return;

    const messageString = JSON.stringify(message);
    for (const client of room.values()  ) {
      if (except && client.userId === except.userId) continue;
      if (client.readyState === 1) {
        // 1 = OPEN
        client.send(messageString);
      }
    }
  }

  public addMessage(roomId: string, message: any) {
    const history = this.messageHistory.get(roomId) || [];
    history.push(message);
    // Keep only the last 100 messages
    if (history.length > 100) {
      history.shift();
    }
    this.messageHistory.set(roomId, history);
  }

  public setTypingStatus(roomId: string, ws: extWebSocket, status: boolean) {
    const roomTypingUsers = this.typingUsers.get(roomId);
    if (!roomTypingUsers){
        this.typingUsers.set(roomId, new Set());
    }
    this.typingUsers.get(roomId)?.add(ws);
  }

  private clearTypingStatus(roomId: string, ws: extWebSocket) {
    const roomTypingUsers = this.typingUsers.get(roomId);
    if (!roomTypingUsers || !roomTypingUsers.has(ws)) return;

    this.broadcastToRoom(roomId,{type:"typingEnd",userId:ws.userId},ws);
    this.typingUsers.get(roomId)?.delete(ws);
    if(this.typingUsers.get(roomId)?.size === 0){
      this.typingUsers.delete(roomId);
    }
  }

  public isUserTyping(roomId: string, ws: extWebSocket): boolean {
    const roomTypingUsers = this.typingUsers.get(roomId);
    return roomTypingUsers ? roomTypingUsers.has(ws) : false;
  }

  public getRoomUsers(roomId: string): extWebSocket[] {
    const room = this.chatRooms.get(roomId);
    return room ? Array.from(room.values()) : [];
  }

  public getRoomSize(roomId: string): number {
    const room = this.chatRooms.get(roomId);
    return room ? room.size : 0;
  }

  public getMessageHistory(roomId: string): any[] {
    return this.messageHistory.get(roomId) || [];
  }
}
