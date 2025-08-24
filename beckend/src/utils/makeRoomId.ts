import { extWebSocket } from "../../types";

export default function makeRoomId(ws:extWebSocket,projectId?: string, fileId?: string) {
    let room :string= "";
    if (projectId ) {
      ws.projectId=projectId
      room = `${projectId}`;
      if (fileId ) {
        ws.fileId=fileId
        room = room+`-${fileId}`;
      }
    }
    return room;
}