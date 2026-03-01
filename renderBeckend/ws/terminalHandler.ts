import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket } from "../types.js";
import { IncomingMessage } from "http";
import RoomManager from "../utils/roomManager.js";
import { spawn, IPty } from "node-pty";
import path from "path";
import crypto from "crypto";
import { getRealProjectDir } from "../utils/getProjectDir.js";
import { ensureProjectWatcher, stopProjectWatcher } from "../utils/watcher.js";

import net from "net";
import FilePathCrud from "../utils/filePathCrud.js";
import VNCSessionService from "../utils/VNC.js";

// Binary protocol constants
const MSG_INPUT = 0x01;
const MSG_RESIZE = 0x02;
const MSG_STOP = 0x03;
// Server -> Client
const MSG_OUTPUT = 0x01;
const MSG_EXIT = 0x02;
const MSG_ERROR = 0x03;
class TerminalWS {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private vncWss: WebSocketServer;

  private projectTerminalCount = new Map<string, number>();
  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.vncWss = new WebSocketServer({ noServer: true });
    this.setup();
    this.startHeartbeat();
  }

  // ---- TOKEN GENERATION ----
  private generatePreviewToken(userId: string, port: string) {
    const secret = process.env.PREVIEW_SECRET || "supersecret";
    const data = `${userId}:${port}`;
    return crypto.createHmac("sha256", secret).update(data).digest("hex");
  }

  private async setup() {
    this.wss.on(
      "connection",
      async (ws: ExtendedWebSocket, req: IncomingMessage) => {
        console.log(
          `🖥️  Terminal WS connected: user=${ws.userId}, terminal=${ws.terminalId}`,
        );
        ws.isAlive = true;
        ws.on("pong", () => {
          ws.isAlive = true;
        });

        const session = RoomManager.getUserSession(ws.userId);
        // ✅ AUTO-ASSIGN GUI: Create GUI session when user opens any terminal
        const gui = await VNCSessionService.ensureSession(ws.userId);
        console.log(
          `🖼️  GUI session assigned: DISPLAY=${gui.data?.display} VNC=:${gui.data?.vncPort} for user=${ws.userId}`,
        );
        let cwd = await getRealProjectDir(
          RoomManager.PROJECT_ROOT,
          ws.projectId,
        );
        const count = this.projectTerminalCount.get(ws.projectId) ?? 0;
        if (count === 0) {
          await FilePathCrud.loadProject(ws.projectId);
          ensureProjectWatcher(cwd, ws.projectId);
        }
        this.projectTerminalCount.set(ws.projectId, count + 1);
        // Set environment with DISPLAY variable
        let env = {
          ...process.env,
          DISPLAY: gui.data?.display,
          TERM: "xterm-256color",
        };
        const shell = process.platform === "win32" ? "wsl.exe" : "bash";
        const args =
          process.platform === "win32"
            ? ["-d", "Ubuntu"] 
            : [];
        const ptyProcess: IPty = spawn(shell, args, {
          name: "xterm-256color",
          cols: 80,
          rows: 25,
          cwd,
          env,
        });
        // Helper to send binary output
        const sendOutput = (text: string) => {
          const dataBuffer = Buffer.from(text, "utf8");
          const buffer = Buffer.allocUnsafe(1 + dataBuffer.length);
          buffer[0] = MSG_OUTPUT;
          dataBuffer.copy(buffer, 1);
          ws.send(buffer);
        };

        sendOutput(
          `🖼️  GUI Display ready: ${gui.data?.display} (VNC port: ${gui.data?.vncPort})\r\n`,
        );
        sendOutput(`💡 Access GUI at: /gui/${ws.userId}\r\n\r\n`);
        ptyProcess.onData((data) => {
          sendOutput(data);

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

            RoomManager.addPreview(ws.userId, detectedPort, token);

            sendOutput(
              `\n\n✅ Preview ready! Your app is running on port ${detectedPort}\n`,
            );
            sendOutput(`PREVIEW:${detectedPort}:${token}\n`);
            console.log(
              `✅ Preview URL generated: port=${detectedPort} for user=${ws.userId}`,
            );
          }
        });
        ptyProcess.onExit(() => {
          if (ws.readyState === WebSocket.OPEN) {
            // Send binary exit: 0x02
            ws.send(Buffer.from([MSG_EXIT]));
          }
        });

        RoomManager.addTerminal(ws.userId, ws.terminalId, ptyProcess);
        ws.on("pong", () => {
          ws.isAlive = true;
        });

        ws.on("message", (msg: Buffer) => {
          // Handle binary messages
          if (msg.length > 0 && msg[0] <= 0x03) {
            const type = msg[0];
            if (type === MSG_INPUT) {
              // Input: 0x01 + raw data
              ptyProcess.write(msg.subarray(1));
            } else if (type === MSG_RESIZE) {
              // Resize: 0x02 + cols(2) + rows(2)
              const cols = (msg[1] << 8) | msg[2];
              const rows = (msg[3] << 8) | msg[4];
              ptyProcess.resize(cols, rows);
            } else if (type === MSG_STOP) {
              // Stop: 0x03
              ptyProcess.kill();
            }
            return;
          }
          // Fallback to JSON for start and other commands
          try {
            const data = JSON.parse(msg.toString());
            if (data.type === "input") {
              ptyProcess.write(data.data);
            } else if (data.type === "resize") {
              ptyProcess.resize(data.cols, data.rows);
            }
          } catch {}
        });

        ws.on("close", () => {
          RoomManager.removeTerminal(ws.userId, ws.terminalId);
          console.log(`[WS] client disconnected userId=${ws.userId}`);
          // 🧹 TERMINAL CLEANUP
          const count = this.projectTerminalCount.get(ws.projectId) ?? 1;
          const next = count - 1;

          if (next <= 0) {
            this.projectTerminalCount.delete(ws.projectId);
            stopProjectWatcher(ws.projectId);
            FilePathCrud.unloadProject(ws.projectId);
            FilePathCrud.forceSave(ws.projectId);

            console.log(
              `🧹 No active terminals, watcher stopped for project=${ws.projectId}`,
            );
          } else {
            this.projectTerminalCount.set(ws.projectId, next);
          }
        });
      },
    );

    this.wss.on("close", () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    });

    this.vncWss?.on(
      "connection",
      async (ws: WebSocket, req: IncomingMessage) => {
        const url = new URL(req.url, "http://localhost");
        const [, , encodedUserId] = url.pathname.split("/");
        const userId = decodeURIComponent(encodedUserId || "");

        const session = RoomManager.getUserSession(userId);
        let gui = session.gui;
        if (!gui || !gui.vncPort) {
          await VNCSessionService.cleanupSession(userId);
          const res = await VNCSessionService.ensureSession(userId);
          if (res.success) {
            gui = res.data;
          } else {
            console.log("cannot assign gui ==", res.error);
            return;
          }
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
      },
    );
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client: ExtendedWebSocket) => {
        if (client.isAlive === false) {
          console.log(
            `[WS] Terminating stale connection for userId=${client.userId}`,
          );
          const pty = RoomManager.getTerminal(client.userId, client.terminalId);
          try {
            pty?.kill();
          } catch {}

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
    if (isVnc) {
      console.log("✅ Matched: VNC WebSocket");
      this.vncWss.handleUpgrade(req, socket, head, (ws) => {
        this.vncWss.emit("connection", ws, req);
      });
      return;
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
