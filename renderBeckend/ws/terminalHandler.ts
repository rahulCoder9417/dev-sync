import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket } from "../types.js";
import { IncomingMessage } from "http";
import RoomManager from "../utils/roomManager.js";
//@ts-ignore
import { spawn, IPty } from "node-pty";
import path from "path";
import crypto from "crypto";
import { getRealProjectDir } from "../utils/getProjectDir.js";
import { ensureProjectWatcher, stopProjectWatcher } from "../utils/watcher.js";


import net from "net";
class TerminalWS {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private room: RoomManager;
  private vncWss: WebSocketServer;

  private projectTerminalCount = new Map<string, number>();
  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.vncWss = new WebSocketServer({ noServer: true });
    this.setup();
    this.startHeartbeat();
    this.room = new RoomManager();
  }

  // ---- TOKEN GENERATION ----
  private generatePreviewToken(userId: string, port: string) {
    const secret = process.env.PREVIEW_SECRET || "supersecret";
    const data = `${userId}:${port}`;
    return crypto.createHmac("sha256", secret).update(data).digest("hex");
  }

  public guu(userId: string) {
    this.room.ensureGuiSession(userId);
  }

  private async setup() {
    this.wss.on(
      "connection",
      async (ws: ExtendedWebSocket, req: IncomingMessage) => {
        console.log(
          `🖥️  Terminal WS connected: user=${ws.userId}, terminal=${ws.terminalId}`
        );

        const session = this.room.getUserSession(ws.userId);
        // ✅ AUTO-ASSIGN GUI: Create GUI session when user opens any terminal
        const gui = this.room.ensureGuiSession(ws.userId);
        console.log(
          `🖼️  GUI session assigned: DISPLAY=${gui.display} VNC=:${gui.vncPort} for user=${ws.userId}`
        );
        let cwd = await getRealProjectDir(this.room.PROJECT_ROOT, ws.projectId);
        const count = this.projectTerminalCount.get(ws.projectId) ?? 0;
        if (count === 0) {
          ensureProjectWatcher(cwd, ws.projectId);
        }
        this.projectTerminalCount.set(ws.projectId, count + 1);
        // Set environment with DISPLAY variable
        let env = { ...process.env, DISPLAY: gui.display };
        const ptyProcess: IPty = spawn("bash", [], {
          name: "xterm-color",
          cols: 80,
          rows: 25,
          cwd,
          env,
        });
        ws.send(
          JSON.stringify({
            type: "output",
            data: `🖼️  GUI Display ready: ${gui.display} (VNC port: ${gui.vncPort})\r\n`,
          })
        );
        ws.send(
          JSON.stringify({
            type: "output",
            data: `💡 Access GUI at: /gui/${ws.userId}\r\n\r\n`,
          })
        );
        ptyProcess.onData((data) => {
          ws.send(
            JSON.stringify({
              type: "output",
              data,
            })
          );

          // Clean ANSI codes for detection
          const cleanData = data.replace(/\x1b\[[0-9;]*m/g, "");

          // Detect production server patterns (Express, serve, http-server, etc.)
          const productionPatterns = [
            /listening on.*?(?:port\s*)?(\d{4,5})/i,
            /server.*?(?:running|started).*?(?:port\s*)?(\d{4,5})/i,
            /started.*?(?:on|at).*?:(\d{4,5})/i,
            /ready.*?(?:on|at).*?:(\d{4,5})/i,
            /serving.*?(?:on|at).*?:(\d{4,5})/i,
            /https?:\/\/(localhost|127\.0\.0\.1):(\d{4,5})/i,
          ];

          let detectedPort = null;
          for (const pattern of productionPatterns) {
            const match = cleanData.match(pattern);
            if (match) {
              // Get the port from either capture group 1 or 2 (depending on pattern)
              detectedPort = match[2] || match[1];
              break;
            }
          }

          // Only generate preview if we haven't already for this port
          if (detectedPort && !session.previews[detectedPort]) {
            console.log("🚀 Production server detected on port:", detectedPort);
            const token = this.generatePreviewToken(ws.userId, detectedPort);

            // Store preview info
            session.previews[detectedPort] = {
              port: detectedPort,
              token,
              startedAt: new Date(),
            };

            ws.send(
              JSON.stringify({
                type: "output",
                data: `\n\n✅ Preview ready! Your app is running on port ${detectedPort}\n`,
              })
            );
            ws.send(
              JSON.stringify({
                type: "output",
                data: `PREVIEW:${detectedPort}:${token}\n`,
              })
            );
            console.log(
              `✅ Preview URL generated: port=${detectedPort} for user=${ws.userId}`
            );
          }
        });
        session.terminals[ws.terminalId] = ptyProcess;
        ws.on("pong", () => {
          ws.isAlive = true;
        });

        ws.on("message", (msg: Buffer) => {
          console.log("[WS] received:", msg.toString());
          const data = JSON.parse(msg.toString());
          if (data.type === "input") {
            console.log("writing", data.data);
            ptyProcess.write(data.data);
          }
          if (data.type === "resize") {
            ptyProcess.resize(data.cols, data.rows);
          }
        });

        ws.on("close", () => {
          ws.send(
            JSON.stringify({
              type: "exit",
            })
          );
          console.log(`[WS] client disconnected userId=${ws.userId}`);
          // 🧹 TERMINAL CLEANUP
          const count = this.projectTerminalCount.get(ws.projectId) ?? 1;
          const next = count - 1;

          if (next <= 0) {
            this.projectTerminalCount.delete(ws.projectId);
            stopProjectWatcher(ws.projectId);
            console.log(`🧹 No active terminals, watcher stopped for project=${ws.projectId}`);
  } else {
    this.projectTerminalCount.set(ws.projectId, next);
  }
        });
      }
    );

    this.wss.on("close", () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    });

    this.vncWss?.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url, "http://localhost");
      const [, , encodedUserId] = url.pathname.split("/");
      const userId = decodeURIComponent(encodedUserId || "");

      const session = this.room.getUserSession(userId);
      const gui = session && session.gui;
      if (!gui || !gui.vncPort) {
        console.error("No GUI session or VNC port for user:", userId);
        ws.close();
        return;
      }

      const vncPort = gui.vncPort;
      const tcpSocket = net.connect(vncPort, "127.0.0.1");

      tcpSocket.on("error", (err) => {
        console.error("VNC TCP error:", err);
        try {
          ws.close();
        } catch {}
      });

      tcpSocket.on("close", () => {
        try {
          ws.close();
        } catch {}
      });

      ws.on("close", () => {
        try {
          tcpSocket.end();
        } catch {}
      });

      ws.on("message", (msg) => {
        if (Buffer.isBuffer(msg)) {
          tcpSocket.write(msg);
        } else if (typeof msg === "string") {
          tcpSocket.write(Buffer.from(msg));
        } else {
          tcpSocket.write(Buffer.from(msg));
        }
      });

      tcpSocket.on("data", (chunk) => {
        ws.send(chunk);
      });
    });
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client: ExtendedWebSocket) => {
        if (client.isAlive === false) {
          console.log(
            `[WS] Terminating stale connection for userId=${client.userId}`
          );
          return client.terminate();
        }
        client.isAlive = false;
        try {
          client.ping();
        } catch (e) {
          console.error("[WS] ping error", e);
        }
      });
    }, 30000);
  }

  public upgrade(
    
    isVnc: boolean,
    req: IncomingMessage,
    socket: any,
    head: any,
    userId?: string,
    terminalId?: string,
    projectId?: string,
  ) {
    if(isVnc){
      console.log('✅ Matched: VNC WebSocket');
    this.vncWss.handleUpgrade(req, socket, head, (ws) => {
      this.vncWss.emit("connection", ws, req);
    });
      return
    }
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      ws.userId = userId;
      ws.terminalId = terminalId;
      ws.projectId = projectId;
      ws.isAlive = true;
      this.wss.emit("connection", ws, req);
    });
  }

  public close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.wss.close();
  }

  public;
}

const terminalWS = new TerminalWS();
export default terminalWS;
