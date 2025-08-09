import WebSocket from 'ws';

interface ExtendedWebSocket extends WebSocket {
  fileId?: string;
  clientId?: string;
  currentRoom?: string;
}

interface JoinRoomResult {
  success: boolean;
  fileId: string;
  clientId: string;
  roomSize: number;
}

interface RoomsInfo {
  [fileId: string]: number;
}

class RoomManager {
  private rooms: Map<string, Set<ExtendedWebSocket>>;

  constructor() {
    this.rooms = new Map();
  }

  joinRoom(ws: ExtendedWebSocket, fileId: string, userId?: string): JoinRoomResult {
    // Leave current room if already in one
    if (ws.currentRoom) {
      this.leaveRoom(ws.currentRoom, ws);
    }

    // Generate client ID if not provided
    const clientId = userId || `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create room if it doesn't exist
    if (!this.rooms.has(fileId)) {
      this.rooms.set(fileId, new Set());
    }
    
    // Add client to room
    const room = this.rooms.get(fileId)!;
    room.add(ws);
    ws.fileId = fileId;
    ws.clientId = clientId;
    ws.currentRoom = fileId;

    console.log(`Client ${clientId} joined room ${fileId}`);
    
    return {
      success: true,
      fileId,
      clientId,
      roomSize: room.size
    };
  }

  leaveRoom(fileId: string, ws: ExtendedWebSocket): void {
    const room = this.rooms.get(fileId);
    if (!room) return;

    room.delete(ws);
    
    // Notify other clients in the room
    this.broadcastToRoom(fileId, {
      type: 'user_left',
      clientId: ws.clientId,
      roomSize: room.size
    }, ws);

    // Clean up empty rooms
    if (room.size === 0) {
      this.rooms.delete(fileId);
      console.log(`Room ${fileId} deleted (empty)`);
    }
    
    console.log(`Client ${ws.clientId} left room ${fileId}`);
    
    // Clear client room info
    delete ws.currentRoom;
    delete ws.fileId;
    delete ws.clientId;
  }

  broadcastToRoom(fileId: string, message: Record<string, any>, excludeWs: ExtendedWebSocket | null = null): void {
    const room = this.rooms.get(fileId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    
    room.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  getRoomSize(fileId: string): number {
    const room = this.rooms.get(fileId);
    return room ? room.size : 0;
  }

  getAllRooms(): RoomsInfo {
    const roomsInfo: RoomsInfo = {};
    this.rooms.forEach((clients, fileId) => {
      roomsInfo[fileId] = clients.size;
    });
    return roomsInfo;
  }
}

export default RoomManager;
