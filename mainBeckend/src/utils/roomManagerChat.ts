import { RoomId, ChatEvent, ChatHistoryMessage } from '../types/chatRoomManager.js';
import { ExtWebSocket } from '../types/ws.js';

/* -------------------------------------------------------------------------- */
/*                               Room Manager                                 */
/* -------------------------------------------------------------------------- */

export default class RoomManager {
  public readonly chatRooms: Map<RoomId, Map<string, ExtWebSocket>>;
  private readonly messageHistory: Map<RoomId, ChatHistoryMessage[]>;
  private readonly typingUsers: Map<RoomId, Map<string, ExtWebSocket>>;//roomId ->{userId ->ws}
  public readonly users: Map<string, ExtWebSocket>;

  constructor() {
    this.chatRooms = new Map();
    this.messageHistory = new Map();
    this.typingUsers = new Map();
    this.users = new Map();
  }

  /* ---------------- Typing Status ---------------- */

  public addToTypingStatus(roomId: RoomId, ws: ExtWebSocket): void {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Map());
    }

    const roomTyping = this.typingUsers.get(roomId)!;

    if (roomTyping.has(ws.userId!)) return;

    roomTyping.set(ws.userId!, ws);

    this.broadcastToRoom(
      roomId,
      {
        type: 'typingStart',
        chatId: roomId,
        userId: ws.userId!,
        fullName: ws.fullName,
        avatar: ws.avatar,
      },
      ws
    );
  }

  public removeFromTypingStatus(roomId: RoomId, ws: ExtWebSocket): void {
    const roomTyping = this.typingUsers.get(roomId);
    if (!roomTyping) return;

    roomTyping.delete(ws.userId!);

    if (roomTyping.size === 0) {
      this.typingUsers.delete(roomId);
    }

    this.broadcastToRoom(
      roomId,
      {
        type: 'typingEnd',
        chatId: roomId,
        userId: ws.userId!,
      },
      ws
    );
  }

  /* ---------------- Global User Tracking ---------------- */

  public addToGlobalUserList(ws: ExtWebSocket): void {
    this.users.set(ws.userId!, ws);
  }

  public removeFromGlobalUserList(ws: ExtWebSocket): void {
    this.users.delete(ws.userId!);
  }

  /* ---------------- Room Membership ---------------- */

  public addToRoom(
    roomId: RoomId,
    ws: ExtWebSocket,
    skipBroadcast = false
  ): void {
    let room = this.chatRooms.get(roomId);

    if (!room) {
      room = new Map();
      this.chatRooms.set(roomId, room);
      this.messageHistory.set(roomId, []);
      this.typingUsers.set(roomId, new Map());
    }

    room.set(ws.userId!, ws);

    ws.chatRooms ??= new Set();
    ws.chatRooms.add(roomId);

    if (skipBroadcast) return;

    this.broadcastToRoom(
      roomId,
      {
        type: 'user_joined',
        room: roomId,
        user: {
          userId: ws.userId!,
          username: ws.username,
          fullName: ws.fullName,
          avatar: ws.avatar,
        },
        timestamp: new Date().toISOString(),
      },
      ws
    );
  }

  public removeFromRoom(
    roomId: RoomId,
    ws: ExtWebSocket,
    skipBroadcast = false
  ): void {
    const room = this.chatRooms.get(roomId);
    if (!room) return;

    this.clearTypingStatus(roomId, ws);

    room.delete(ws.userId!);
    ws.chatRooms?.delete(roomId);

    if (room.size === 0) {
      this.chatRooms.delete(roomId);
      this.typingUsers.delete(roomId);
      this.messageHistory.delete(roomId);
    }

    if (skipBroadcast) return;

    this.broadcastToRoom(
      roomId,
      {
        type: 'user_left',
        room: roomId,
        userId: ws.userId!,
        timestamp: new Date().toISOString(),
      },
      ws
    );
  }

  /* ---------------- Messaging ---------------- */

  public broadcastToRoom(
    roomId: RoomId,
    message: ChatEvent | Record<string, unknown>,
    except?: ExtWebSocket
  ): void {
    const room = this.chatRooms.get(roomId);
    if (!room) return;

    const payload = JSON.stringify(message);

    for (const client of room.values()) {
      if (except && client.userId === except.userId) continue;
      if (client.readyState === WS_OPEN) {
        client.send(payload);
      }
    }
  }

  public addMessage(
    roomId: RoomId,
    message: ChatHistoryMessage
  ): void {
    const history = this.messageHistory.get(roomId) ?? [];

    history.push(message);

    if (history.length > 100) {
      history.shift();
    }

    this.messageHistory.set(roomId, history);
  }

  /* ---------------- Typing Helpers ---------------- */

  private clearTypingStatus(roomId: RoomId, ws: ExtWebSocket): void {
    const roomTyping = this.typingUsers.get(roomId);
    if (!roomTyping || !roomTyping.has(ws.userId!)) return;

    roomTyping.delete(ws.userId!);

    if (roomTyping.size === 0) {
      this.typingUsers.delete(roomId);
    }

    this.broadcastToRoom(
      roomId,
      {
        type: 'typingEnd',
        chatId: roomId,
        userId: ws.userId!,
      },
      ws
    );
  }

  public isUserTyping(roomId: RoomId, ws: ExtWebSocket): boolean {
    return this.typingUsers.get(roomId)?.has(ws.userId!) ?? false;
  }

  /* ---------------- Queries ---------------- */

  public getRoomUsers(roomId: RoomId): ExtWebSocket[] {
    return Array.from(this.chatRooms.get(roomId)?.values() ?? []);
  }

  public getRoomSize(roomId: RoomId): number {
    return this.chatRooms.get(roomId)?.size ?? 0;
  }

  public getMessageHistory(roomId: RoomId): ChatHistoryMessage[] {
    return this.messageHistory.get(roomId) ?? [];
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Consts                                   */
/* -------------------------------------------------------------------------- */

const WS_OPEN = 1;
