import { RawData } from "ws";
import { ExtWebSocket, BaseWsHandler } from "./baseWsHandler";
import { ClientMessage } from "../../types";

export class ChatWsHandler extends BaseWsHandler {
  private messageHistory: Map<string, any[]> = new Map();
  // key = roomId, value = array of messages

  constructor() {
    super('/ws/chat');
  }

  protected async handleMessage(ws: ExtWebSocket, data: RawData) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(data.toString());
    } catch (err) {
      const error = err as Error;
      ws.send(JSON.stringify({ error: "invalid_json", message: error.message }));
      return;
    }

    if (!parsed || typeof parsed !== "object" || !("action" in parsed)) {
      ws.send(JSON.stringify({ error: "invalid_message" }));
      return;
    }

    try {
      switch (parsed.action) {
        case 'join_room':
          await this.handleJoinRoom(ws, parsed as any);
          break;
        case 'leave_room':
          this.handleLeaveRoom(ws, parsed as any);
          break;
        case 'send_message':
          await this.handleSendMessage(ws, parsed as any);
          break;
        case 'typing_status':
          await this.handleTypingStatus(ws, parsed as any);
          break;
        case 'message_read':
          await this.handleMessageRead(ws, parsed as any);
          break;
        default:
          ws.send(JSON.stringify({ error: "unknown_action" }));
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error handling chat message:', err);
      ws.send(JSON.stringify({ 
        error: "internal_error", 
        message: err.message || 'An unknown error occurred' 
      }));
    }
  }

  private async handleJoinRoom(ws: ExtWebSocket, message: any) {
    const { roomId } = message;
    if (!roomId) {
      ws.send(JSON.stringify({ error: "room_id_required" }));
      return;
    }

    // Remove from previous rooms
    const previousRooms = Array.from(ws.rooms);
    for (const room of previousRooms) {
      this.room.removeFromRoom(room, ws);
    }

    // Join new room
    this.room.addToRoom(roomId, ws);
    ws.rooms.add(roomId);

    // Initialize message history for the room if it doesn't exist
    if (!this.messageHistory.has(roomId)) {
      this.messageHistory.set(roomId, []);
    }

    // Send message history to the joining user
    ws.send(JSON.stringify({
      type: "message_history",
      messages: this.messageHistory.get(roomId) || []
    }));

    // Notify others in the room
    this.room.broadcastToRoom(
      roomId,
      {
        type: "user_joined",
        room: roomId,
        user: {
          userId: ws.userId,
          username: ws.username,
          fullName: ws.fullName,
          avatar: ws.avatar,
        },
        timestamp: new Date().toISOString(),
      },
      ws
    );
  }

  private handleLeaveRoom(ws: ExtWebSocket, message: any) {
    const { roomId } = message;
    if (!roomId) {
      ws.send(JSON.stringify({ error: "room_id_required" }));
      return;
    }

    this.room.removeFromRoom(roomId, ws);
    ws.rooms.delete(roomId);

    // Notify others in the room
    this.room.broadcastToRoom(
      roomId,
      {
        type: "user_left",
        room: roomId,
        user: {
          userId: ws.userId,
          username: ws.username,
          fullName: ws.fullName,
          avatar: ws.avatar,
        },
        timestamp: new Date().toISOString(),
      },
      ws
    );
  }

  private async handleSendMessage(ws: ExtWebSocket, message: any) {
    const { roomId, content, type = 'text' } = message;
    if (!roomId || !content) {
      ws.send(JSON.stringify({ error: "missing_parameters" }));
      return;
    }

    const messageData = {
      id: Date.now().toString(),
      type,
      content,
      sender: {
        userId: ws.userId,
        username: ws.username,
        fullName: ws.fullName,
        avatar: ws.avatar,
      },
      timestamp: new Date().toISOString(),
      readBy: [ws.userId],
    };

    // Add to message history
    if (!this.messageHistory.has(roomId)) {
      this.messageHistory.set(roomId, []);
    }
    this.messageHistory.get(roomId)?.push(messageData);

    // Broadcast to all in the room except sender
    this.room.broadcastToRoom(
      roomId,
      {
        type: "new_message",
        message: messageData,
      },
      ws
    );

    // Send confirmation to sender
    ws.send(JSON.stringify({
      type: "message_sent",
      message: messageData,
    }));
  }

  private async handleTypingStatus(ws: ExtWebSocket, message: any) {
    const { roomId, isTyping } = message;
    if (roomId === undefined || isTyping === undefined) {
      ws.send(JSON.stringify({ error: "missing_parameters" }));
      return;
    }

    // Broadcast typing status to others in the room
    this.room.broadcastToRoom(
      roomId,
      {
        type: "user_typing",
        userId: ws.userId,
        username: ws.username,
        isTyping,
      },
      ws
    );
  }

  private async handleMessageRead(ws: ExtWebSocket, message: any) {
    const { roomId, messageId } = message;
    if (!roomId || !messageId) {
      ws.send(JSON.stringify({ error: "missing_parameters" }));
      return;
    }

    const roomMessages = this.messageHistory.get(roomId);
    if (!roomMessages) return;

    const messageToUpdate = roomMessages.find(msg => msg.id === messageId);
    if (messageToUpdate && !messageToUpdate.readBy.includes(ws.userId)) {
      messageToUpdate.readBy.push(ws.userId);
      
      // Broadcast read receipt to all in the room
      this.room.broadcastToRoom(roomId, {
        type: "message_read",
        messageId,
        readBy: messageToUpdate.readBy,
        readByUser: {
          userId: ws.userId,
          username: ws.username,
          fullName: ws.fullName,
          avatar: ws.avatar,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}
