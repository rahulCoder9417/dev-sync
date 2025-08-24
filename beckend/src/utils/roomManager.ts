import { extWebSocket } from "../../types";

export default class RoomManager {
  private roomsCode: Map<string, Set<extWebSocket>>;
  constructor() {
    this.roomsCode = new Map();
  }
  public addToRoom(room: string, ws: extWebSocket) {
    let set = this.roomsCode.get(room);
    if (!set) {
      set = new Set();
      this.roomsCode.set(room, set);
    }
    set.add(ws);
    ws.rooms = ws.rooms ?? new Set();
    ws.rooms.add(room);
  } 

  public removeFromRoom(room: string, ws: extWebSocket) {
    const set = this.roomsCode.get(room);
    if (!set) return;
    set.delete(ws);
    if (set.size === 0) this.roomsCode.delete(room);
    ws.rooms?.delete(room);
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
