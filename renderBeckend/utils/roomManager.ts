import { Session } from "../types.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
class RoomManager {
    private sessions: Record<string, Session> = {};
    public PROJECT_ROOT = "/usr/src/app/projects"
    public getUserSession(userId: string) {
        if (!this.sessions[userId]) {
          this.sessions[userId] = { terminals: {}, gui: null, previews: {} };
        }
        return this.sessions[userId];
      }
    
    

}

export default RoomManager;