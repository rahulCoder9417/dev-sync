import {WebSocket as WS,} from "ws"
/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface ExtWebSocket extends WS {
  isAlive: boolean;
  userId: string;
  username: string;
  fullName: string;
  avatar: string | null;
  rooms: Set<string>;
  chatRooms: Set<string>;
}