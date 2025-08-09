import WebSocket from 'ws';
import RoomManager from '../utils/roomManager.js';

interface ExtendedWebSocket extends WebSocket {
  fileId?: string;
  clientId?: string;
  currentRoom?: string;
}

interface WebSocketMessage {
  type: string;
  fileId?: string;
  userId?: string;
  [key: string]: any;
}

interface RoomsInfo {
  [fileId: string]: number;
}

class WebSocketHandler {
  private roomManager: RoomManager;

  constructor() {
    this.roomManager = new RoomManager();
  }

  handleConnection(ws: ExtendedWebSocket): void {
    console.log('New WebSocket connection established');

    ws.on('message', (message: WebSocket.Data) => {
      try {
        const data: WebSocketMessage = JSON.parse(message.toString());
        this.handleMessage(ws, data);
      } catch (error) {
        console.error('Error parsing message:', error);
        this.sendError(ws, 'Invalid JSON message');
      }
    });

    ws.on('close', () => {
      this.handleDisconnect(ws);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleMessage(ws: ExtendedWebSocket, data: WebSocketMessage): void {
    switch (data.type) {
      case 'join':
        this.handleJoinRoom(ws, data);
        break;
      case 'scroll':
      case 'cursor':
      case 'edit':
        this.handleBroadcast(ws, data);
        break;
      case 'ping':
        this.handlePing(ws);
        break;
      default:
        console.log('Unknown message type:', data.type);
        this.sendError(ws, `Unknown message type: ${data.type}`);
    }
  }

  private handleJoinRoom(ws: ExtendedWebSocket, data: WebSocketMessage): void {
    const { fileId, userId } = data;
    
    if (!fileId) {
      this.sendError(ws, 'fileId is required');
      return;
    }

    const result = this.roomManager.joinRoom(ws, fileId, userId);
    
    if (result.success) {
      // Notify client of successful join
      ws.send(JSON.stringify({
        type: 'joined',
        fileId: result.fileId,
        clientId: result.clientId,
        roomSize: result.roomSize
      }));

      // Notify other clients in the room
      this.roomManager.broadcastToRoom(fileId, {
        type: 'user_joined',
        clientId: result.clientId,
        roomSize: result.roomSize
      }, ws);
    }
  }

  private handleBroadcast(ws: ExtendedWebSocket, data: WebSocketMessage): void {
    if (!ws.currentRoom) {
      this.sendError(ws, 'Not in any room');
      return;
    }

    // Add sender info to the message
    const messageWithSender = {
      ...data,
      senderId: ws.clientId,
      timestamp: Date.now()
    };

    // Broadcast to all other clients in the room
    this.roomManager.broadcastToRoom(ws.currentRoom, messageWithSender, ws);
  }

  private handlePing(ws: ExtendedWebSocket): void {
    ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
  }

  private handleDisconnect(ws: ExtendedWebSocket): void {
    if (ws.currentRoom) {
      this.roomManager.leaveRoom(ws.currentRoom, ws);
    }
  }

  private sendError(ws: ExtendedWebSocket, message: string): void {
    ws.send(JSON.stringify({ type: 'error', message }));
  }

  getRoomStats(): RoomsInfo {
    return this.roomManager.getAllRooms();
  }
}

export default WebSocketHandler;
