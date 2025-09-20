
export default function makeRoomId(projectId?: string , fileId?: string | null) {
    let room :string= "";
    if (projectId ) {
      room = `${projectId}`;
      if (fileId ) {
        room = room+`:${fileId}`;
      }
    }
    return room;
}