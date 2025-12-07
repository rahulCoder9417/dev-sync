import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket } from "../types.js";
import { IncomingMessage } from "http";
import RoomManager from "../utils/roomManager.js";
// @ts-ignore
import pty from "node-pty";
import path from "path";
import crypto from "crypto";

class TerminalWS {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private room: RoomManager;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
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
 
 private verifyPreviewToken(token: string, userId: string, port: string) {
   const secret = process.env.PREVIEW_SECRET || "supersecret";
   const recalculated = crypto
     .createHmac("sha256", secret)
     .update(`${userId}:${port}`)
     .digest("hex");
 
   console.log(`🔐 Token verification: userId=${userId}, port=${port}`);
   console.log(`   Received token: ${token}`);
   console.log(`   Expected token: ${recalculated}`);
   console.log(`   Match: ${recalculated === token}`);
 
   return recalculated === token;
 } 

  private setup() {
    this.wss.on("connection", (ws: ExtendedWebSocket, req: IncomingMessage) => {
      console.log(
        `🖥️  Terminal WS connected: user=${ws.userId}, terminal=${ws.terminalId}`
      );

      const session = this.room.getUserSession(ws.userId);
      // ✅ AUTO-ASSIGN GUI: Create GUI session when user opens any terminal
      const gui = this.room.ensureGuiSession(ws.userId);
      console.log(
        `🖼️  GUI session assigned: DISPLAY=${gui.display} VNC=:${gui.vncPort} for user=${ws.userId}`
      );

      // Set environment with DISPLAY variable
      let env = { ...process.env, DISPLAY: gui.display };

      const ptyProcess = pty.spawn("bash", [], {
        name: "xterm-color",
        cols: 80,
        rows: 25,
        cwd: path.join(this.room.PROJECT_ROOT,ws.projectId),
        env,
      });

      ptyProcess.on("data", (data) => {
        ws.send(data);
    
        // Clean ANSI codes for detection
        const cleanData = data.replace(/\x1b\[[0-9;]*m/g, '');
        
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
    
          ws.send(`\n\n✅ Preview ready! Your app is running on port ${detectedPort}\n`);
          ws.send(`PREVIEW:${detectedPort}:${token}\n`);
          console.log(`✅ Preview URL generated: port=${detectedPort} for user=${ws.userId}`);
        }
      });
      session.terminals[ws.terminalId] = ptyProcess;
      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (msg: Buffer) => {
        console.log("[WS] received:", msg.toString());
      });

      ws.on("close", () => {
        console.log(`[WS] client disconnected userId=${ws.userId}`);
      });
    });

    this.wss.on("close", () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
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
    req: IncomingMessage,
    socket: any,
    head: any,
    userId: string,
    terminalId: string,
    projectId: string
  ) {
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
}

const terminalWS = new TerminalWS();
export default terminalWS;
