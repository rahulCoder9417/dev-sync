import { spawn, ChildProcess } from "child_process";
import { GuiSession, ServiceResult, CleanupResult } from "../types.js";
import config from "../config/index.js";
import RoomManager from "./roomManager.js";

/**
 * Manages VNC/Xvfb GUI sessions with proper lifecycle management
 */
export class VNCSessionService {
  private nextGuiIndex = 0;
  private activeSessions = new Map<string, GuiSession>();

  /**
   * Get or create a GUI session for a user
   */
 public async ensureSession(userId: string): Promise<ServiceResult<GuiSession>> {
    try {
      // Return existing session if available and healthy
      const existing = this.activeSessions.get(userId);
      if (existing && this.isSessionHealthy(existing)) {
        console.log(`♻️  Reusing GUI session for user=${userId} display=${existing.display}`);
        return { success: true, data: existing };
      }

      // Create new session
      console.log(`🎬 Creating new GUI session for user=${userId}`);
      const session = await this.createSession(userId);
      
      this.activeSessions.set(userId, session);
      
      return { success: true, data: session };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "GUI_SESSION_ERROR",
          message: `Failed to create GUI session: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Create a new GUI session with Xvfb + VNC + WM
   */
  private async createSession(userId: string): Promise<GuiSession> {
    const index = this.nextGuiIndex++;
    const displayNum = config.gui.baseDisplay + index;
    const display = `:${displayNum}`;
    const vncPort = config.gui.baseVncPort + index;

    console.log(`🚀 Creating GUI session for user=${userId}...`);
    const startTime = Date.now();

    // Start Xvfb
    const xvfb = await this.startXvfb(display);
    
    const session: GuiSession = {
      display,
      vncPort,
      index,
      ready: false,
      processes: { xvfb },
    };

    // Wait for Xvfb to be ready (ONLY ONCE!)
    await this.waitForDisplay(display);

    // Start window manager and VNC server IN PARALLEL for speed
    const [wm, x11vnc] = await Promise.all([
      this.startWindowManager(display),
      this.startVNCServer(display, vncPort),
    ]);

    session.processes.wm = wm;
    session.processes.x11vnc = x11vnc;
    session.ready = true;
    RoomManager.addGui(userId, session);
    const elapsed = Date.now() - startTime;
    console.log(`✅ GUI session ready in ${elapsed}ms: user=${userId} display=${display} vnc=:${vncPort}`);
    
    return session;
  }

  /**
   * Start Xvfb virtual display
   */
  private startXvfb(display: string): Promise<ChildProcess> {
    return new Promise((resolve, reject) => {
      console.log(`🖥️  Starting Xvfb on ${display}...`);

      const xvfb = spawn(
        "Xvfb",
        [display, "-screen", "0", config.gui.xvfbResolution, "-ac", "+extension", "GLX"],
        {
          stdio: ["ignore", "pipe", "pipe"],
          detached: false,
        }
      );

      xvfb.stdout?.on("data", (data) => 
        console.log(`[Xvfb ${display}] ${data.toString().trim()}`)
      );
      
      xvfb.stderr?.on("data", (data) => 
        console.error(`[Xvfb ${display}] ${data.toString().trim()}`)
      );

      xvfb.on("error", (err) => {
        console.error(`❌ Xvfb failed to start on ${display}:`, err);
        reject(err);
      });

      xvfb.on("exit", (code, signal) => {
        if (code !== 0 && code !== null) {
          console.error(`❌ Xvfb ${display} exited with code ${code}`);
        }
      });

      // Give it a moment to start
      setTimeout(() => resolve(xvfb), 500);
    });
  }

  /**
   * Wait for X display to be ready
   */
  private waitForDisplay(display: string): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed > config.gui.startupTimeout) {
          clearInterval(checkInterval);
          console.warn(`⚠️  Xvfb ${display} timeout after ${elapsed}ms, proceeding anyway...`);
          resolve();
          return;
        }

        const testProcess = spawn("xdpyinfo", ["-display", display], {
          stdio: "ignore",
        });

        testProcess.on("exit", (code) => {
          if (code === 0) {
            clearInterval(checkInterval);
            console.log(`✅ Xvfb ${display} ready in ${elapsed}ms`);
            resolve();
          }
        });

        testProcess.on("error", () => {
          // Silently ignore errors during polling
        });
      }, 100);
    });
  }

  /**
   * Start window manager (fluxbox/openbox)
   */
  private startWindowManager(display: string): Promise<ChildProcess | undefined> {
    if (config.gui.windowManager === "none") {
      return Promise.resolve(undefined);
    }

    return new Promise((resolve, reject) => {
      console.log(`🪟 Starting ${config.gui.windowManager} on ${display}...`);

      const wm = spawn(config.gui.windowManager, [], {
        stdio: ["ignore", "ignore", "ignore"],
        detached: false,
        env: { ...process.env, DISPLAY: display },
      });

      

      wm.on("error", (err) => {
        console.error(`❌ Window manager error on ${display}:`, err);
        // Don't reject - WM is optional
      });

      setTimeout(() => resolve(wm), 300);
    });
  }

  /**
   * Start x11vnc VNC server
   */
  private startVNCServer(display: string, vncPort: number): Promise<ChildProcess> {
    return new Promise((resolve, reject) => {
      console.log(`📡 Starting x11vnc on ${display} port ${vncPort}...`);

      const x11vnc = spawn(
        "x11vnc",
        [
          "-display", display,
          "-forever",
          "-nopw",
          "-shared",
          "-rfbport", String(vncPort),
          "-noxdamage", // Disable X damage extension (can cause slowness)
          "-noxfixes",  // Disable X fixes extension (can cause slowness)
          "-noxrecord", // Disable X record extension (can cause slowness)
          "-wait", "10", // Poll every 10ms instead of default 30ms (faster response)
          "-defer", "10", // Defer screen updates by 10ms (reduces lag)
        ],
        {
          stdio: ["ignore", "pipe", "pipe"],
          detached: false,
        }
      );

      let started = false;

      x11vnc.stdout?.on("data", (data) => {
        const msg = data.toString().trim();
        console.log(`[x11vnc ${display}] ${msg}`);
        
        // Detect when VNC is actually ready
        if (!started && msg.includes("Listening for VNC connections")) {
          started = true;
          console.log(`✅ x11vnc ready on port ${vncPort}`);
        }
      });

      x11vnc.stderr?.on("data", (data) => {
        console.error(`[x11vnc ${display}] ${data.toString().trim()}`)
      });

      x11vnc.on("error", (err) => {
        console.error(`❌ x11vnc error on ${display}:`, err);
        reject(err);
      });

      // Wait a bit longer for x11vnc to fully start
      setTimeout(() => resolve(x11vnc), 500);
    });
  }

  /**
   * Check if session is healthy
   */
  private isSessionHealthy(session: GuiSession): boolean {
    const { xvfb, wm, x11vnc } = session.processes;
    
    // Check if critical processes are still running
    const xvfbAlive = xvfb && !xvfb.killed && xvfb.exitCode === null;
    const vncAlive = x11vnc && !x11vnc.killed && x11vnc.exitCode === null;
    
    return !!(xvfbAlive && vncAlive && session.ready);
  }

  /**
   * Get session for user (if exists)
   */
  getSession(userId: string): GuiSession | null {
    return this.activeSessions.get(userId) || null;
  }

  /**
   * Clean up a specific user's GUI session
   */
  async cleanupSession(userId: string): Promise<CleanupResult> {
    const session = this.activeSessions.get(userId);
    if (!session) {
      return { processesKilled: 0, errors: [] };
    }

    console.log(`🧹 Cleaning up GUI session for user=${userId} display=${session.display}`);
    
    const errors: Error[] = [];
    let killed = 0;

    // Kill processes in reverse order
    const processesToKill = [
      { name: "x11vnc", proc: session.processes.x11vnc },
      { name: "wm", proc: session.processes.wm },
      { name: "xvfb", proc: session.processes.xvfb },
    ];

    for (const { name, proc } of processesToKill) {
      if (proc && !proc.killed) {
        try {
          proc.kill("SIGTERM");
          killed++;
          
          // Force kill after 2s if needed
          setTimeout(() => {
            if (proc.exitCode === null) {
              proc.kill("SIGKILL");
            }
          }, 2000);
        } catch (err) {
          errors.push(new Error(`Failed to kill ${name}: ${err.message}`));
        }
      }
    }
    RoomManager.removeGui(userId);
    this.activeSessions.delete(userId);
    
    return { processesKilled: killed, errors };
  }

  /**
   * Clean up all sessions
   */
  async cleanupAll(): Promise<CleanupResult> {
    console.log("🧹 Cleaning up all GUI sessions...");
    
    const results = await Promise.all(
      Array.from(this.activeSessions.keys()).map(userId => 
        this.cleanupSession(userId)
      )
    );

    const totalKilled = results.reduce((sum, r) => sum + r.processesKilled, 0);
    const allErrors = results.flatMap(r => r.errors);

    console.log(`✅ Cleaned up ${totalKilled} processes with ${allErrors.length} errors`);
    RoomManager.removeGui();
    return { processesKilled: totalKilled, errors: allErrors };
  }
}

export default new VNCSessionService();