import { Session } from "../types.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
class RoomManager {
    private sessions: Record<string, Session> = {};
    private nextGuiIndex = 0;
    private GUI_BASE_DISPLAY = 100;
    private GUI_BASE_VNC_PORT = 5900;
    private __filename = fileURLToPath(import.meta.url);
    private __dirname = path.dirname(this.__filename);
    public PROJECT_ROOT = path.join(this.__dirname, "projects");
    public getUserSession(userId: string) {
        if (!this.sessions[userId]) {
          this.sessions[userId] = { terminals: {}, gui: null, previews: {} };
        }
        return this.sessions[userId];
      }
    
    
public ensureGuiSession(userId: string) {
    const session = this.getUserSession(userId);
  
    if (session.gui && session.gui.display && session.gui.vncPort) {
      console.log(`♻️  Reusing existing GUI session: display=${session.gui.display}`);
      return session.gui;
    }
  
    const index = this.nextGuiIndex++;
    const displayNum = this.GUI_BASE_DISPLAY + index;
    const display = `:${displayNum}`;
    const vncPort = this.GUI_BASE_VNC_PORT + index;
  
    console.log(`🎬 Starting Xvfb on display ${display}...`);
  
    const xvfb = spawn("Xvfb", [display, "-screen", "0", "1920x1080x24", "-ac"], {
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    });
  
    xvfb.stdout?.on("data", (data) => console.log(`[Xvfb ${display}] ${data}`));
    xvfb.stderr?.on("data", (data) => console.error(`[Xvfb ${display}] ${data}`));
    xvfb.on("error", (err) => console.error(`❌ Xvfb error on ${display}:`, err));
    xvfb.on("exit", (code) => console.log(`Xvfb ${display} exited with code ${code}`));
  
    // Wait for Xvfb to be ready
    const waitForDisplay = ():Promise<void> => {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const testProcess = spawn("xdpyinfo", ["-display", display], {
            stdio: "ignore",
          });
          testProcess.on("exit", (code) => {
            if (code === 0) {
              clearInterval(checkInterval);
              console.log(`✅ Xvfb ${display} is ready!`);
              resolve();
            }
          });
        }, 100);
  
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          console.warn(`⚠️  Xvfb ${display} timeout, proceeding anyway...`);
          resolve();
        }, 5000);
      });
    };
  
    // Start window manager after Xvfb is ready
    waitForDisplay().then(() => {
      console.log(`🪟 Starting fluxbox on ${display}...`);
      const wm = spawn("fluxbox", [], {
        stdio: ["ignore", "pipe", "pipe"],
        detached: false,
        env: {
          ...process.env,
          DISPLAY: display,
        },
      });
  
      wm.stdout?.on("data", (data) => console.log(`[fluxbox ${display}] ${data}`));
      wm.stderr?.on("data", (data) => console.error(`[fluxbox ${display}] ${data}`));
      wm.on("error", (err) => console.error(`❌ fluxbox error on ${display}:`, err));
  
      console.log(`📡 Starting x11vnc on ${display} port ${vncPort}...`);
      const x11vnc = spawn(
        "x11vnc",
        [
          "-display",
          display,
          "-forever",
          "-nopw",
          "-shared",
          "-quiet",//because novnc hit ws unecesasry and add logs
          "-rfbport",
          String(vncPort),
        ],
        {
          stdio: ["ignore", "pipe", "pipe"],
          detached: false,
        }
      );
  
      x11vnc.stdout?.on("data", (data) => console.log(`[x11vnc ${display}] ${data}`));
      x11vnc.stderr?.on("data", (data) => console.error(`[x11vnc ${display}] ${data}`));
      x11vnc.on("error", (err) => console.error(`❌ x11vnc error on ${display}:`, err));
  
      if (session.gui && session.gui.processes) {
        session.gui.processes.wm = wm;
        session.gui.processes.x11vnc = x11vnc;
      }
    });
  
    const guiSession = {
      display,
      vncPort,
      index,
      processes: { xvfb },
      ready: false,
    };
  
    session.gui = guiSession;
    
    // Mark as ready after wait
    waitForDisplay().then(() => {
      guiSession.ready = true;
      console.log(`✅ GUI session fully initialized for user=${userId} display=${display} vncPort=${vncPort}`);
    });
  
    return guiSession;
  }
}

export default RoomManager;