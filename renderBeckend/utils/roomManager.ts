import { GuiSession, Session } from "../types.js";
import { spawn } from "child_process";
import path from "path";

//@ts-ignore
import { PtyProcess } from "node-pty";
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
    
    public addTerminal(userId: string, terminalId: string,ptyProcess:PtyProcess){
      this.sessions[userId].terminals[terminalId] = ptyProcess
    }

    public removeTerminal(userId: string, terminalId: string){
      delete this.sessions[userId].terminals[terminalId]
    }

    public getTerminal(userId: string, terminalId: string){
      return this.sessions[userId].terminals[terminalId] || null
    }

    public addGui(userId: string,gui:GuiSession){
      this.sessions[userId].gui = gui
    }

    public removeGui(userId?: string){
      if(userId){
        this.sessions[userId].gui = null
      }
      else{
        this.sessions = {}
      }
    }

    public getGui(userId: string){
      return this.sessions[userId].gui
    }

    public addPreview(userId: string, port: string, token: string){
      this.sessions[userId].previews[port] = { port, token, startedAt: new Date() }
    }

    public removePreview(userId: string, port: string){
      delete this.sessions[userId].previews[port]
    }
    

}
let room = new RoomManager;
export default room