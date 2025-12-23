import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import net from "net";
import sessionManager from "../services/SessionManager.js";

/**
 * Handles VNC WebSocket connections (noVNC client → x11vnc)
 */
export class VNCWSHandler {
  private wss: WebSocketServer;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
  }

  private setup() {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      try {
        // Extract userId from URL path: /websockify/{userId}
        const url = new URL(req.url || "", "http://localhost");
        const [, , encodedUserId] = url.pathname.split("/");
        const userId = decodeURIComponent(encodedUserId || "");

        if (!userId) {
          console.error("❌ VNC connection missing userId");
          ws.close(1008, "Missing userId");
          return;
        }

        console.log(`📺 VNC WS connected for user=${userId}`);
        
        this.handleVNCConnection(ws, userId);
      } catch (error) {
        console.error(`❌ VNC connection error: ${error.message}`);
        ws.close(1011, "Connection initialization failed");
      }
    });
  }

  /**
   * Handle VNC WebSocket connection by proxying to x11vnc TCP socket
   */
  private handleVNCConnection(ws: WebSocket, userId: string) {
    const session = sessionManager.getSession(userId);
    const gui = session?.gui;

    if (!gui || !gui.vncPort) {
      console.error(`❌ No GUI session or VNC port for user=${userId}`);
      ws.close(1008, "No GUI session available");
      return;
    }

    if (!gui.ready) {
      console.warn(`⚠️  GUI session not ready yet for user=${userId}, attempting anyway...`);
    }

    const vncPort = gui.vncPort;

    // Create TCP socket to x11vnc
    const tcpSocket = net.connect(vncPort, "127.0.0.1");

    // Handle TCP socket errors
    tcpSocket.on("error", (err) => {
      console.error(`❌ VNC TCP socket error for user=${userId}:`, err.message);
      try {
        ws.close(1011, "VNC server connection failed");
      } catch (e) {
        // Socket might already be closed
      }
    });

    // Handle TCP socket close
    tcpSocket.on("close", () => {
      console.log(`🔌 VNC TCP socket closed for user=${userId}`);
      try {
        ws.close();
      } catch (e) {
        // Socket might already be closed
      }
    });

    // Handle WebSocket close
    ws.on("close", () => {
      console.log(`🔌 VNC WebSocket closed for user=${userId}`);
      try {
        tcpSocket.end();
      } catch (e) {
        // Socket might already be closed
      }
    });

    // Handle WebSocket errors
    ws.on("error", (err) => {
      console.error(`❌ VNC WebSocket error for user=${userId}:`, err.message);
      try {
        tcpSocket.end();
      } catch (e) {
        // Socket might already be closed
      }
    });

    // Proxy WebSocket messages to TCP socket
    ws.on("message", (msg) => {
      try {
        if (Buffer.isBuffer(msg)) {
          tcpSocket.write(msg);
        } else if (typeof msg === "string") {
          tcpSocket.write(Buffer.from(msg));
        } else if (Array.isArray(msg)) {
          // Handle multiple buffers
          msg.forEach(chunk => {
            if (Buffer.isBuffer(chunk)) {
              tcpSocket.write(chunk);
            }
          });
        } else {
          tcpSocket.write(Buffer.from(msg as any));
        }
      } catch (error) {
        console.error(`❌ Error writing to VNC TCP socket: ${error.message}`);
      }
    });

    // Proxy TCP socket data to WebSocket
    tcpSocket.on("data", (chunk) => {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(chunk);
        }
      } catch (error) {
        console.error(`❌ Error sending to VNC WebSocket: ${error.message}`);
      }
    });

    console.log(`✅ VNC proxy established for user=${userId}`);
  }

  /**
   * Upgrade HTTP connection to WebSocket
   */
  public upgrade(req: IncomingMessage, socket: any, head: any) {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit("connection", ws, req);
    });
  }

  /**
   * Close WebSocket server
   */
  public close() {
    console.log("🧹 Closing VNC WebSocket handler...");
    this.wss.close();
  }
}

export default new VNCWSHandler();