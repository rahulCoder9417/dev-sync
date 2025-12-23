import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket, TerminalMessage } from "../types.js";
import { IncomingMessage } from "http";
import vncService from "../services/VNCSessionService.js";
import sessionManager from "../services/SessionManager.js";
import terminalService from "../services/TerminalService.js";
import config from "../config/index.js";
import { getRealProjectDir } from "../utils/getProjectDir.js";
import fileSystemService from "../services/FileSystemService.js";
import fileWatcherService from "../services/FileWatcherService.js";
import fsEventHandler from "../utils/fsEventHandler.js";

/**
 * Handles terminal WebSocket connections with proper lifecycle management
 */
export class TerminalWSHandler {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private projectWatcherRefs = new Map<string, number>(); // Track watcher references

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
    this.startHeartbeat();
  }

  private setup() {
    this.wss.on("connection", async (ws: ExtendedWebSocket, req: IncomingMessage) => {
      const { userId, terminalId, projectId } = ws;

      if (!userId || !terminalId || !projectId) {
        console.error("❌ Terminal connection missing required params");
        ws.close(1008, "Missing userId, terminalId, or projectId");
        return;
      }

      console.log(`🖥️  Terminal WS connected: user=${userId}, terminal=${terminalId}, project=${projectId}`);

      try {
        await this.handleNewConnection(ws, userId, terminalId, projectId);
      } catch (error) {
        console.error(`❌ Failed to initialize terminal: ${error.message}`);
        this.sendError(ws, `Failed to initialize terminal: ${error.message}`);
        ws.close(1011, "Initialization failed");
      }
    });

    this.wss.on("close", () => {
      this.cleanup();
    });
  }

  /**
   * Handle new terminal connection
   */
  private async handleNewConnection(
    ws: ExtendedWebSocket,
    userId: string,
    terminalId: string,
    projectId: string
  ) {
    // Get or create user session
    const session = sessionManager.getOrCreateSession(userId);

    // Ensure GUI session
    const guiResult = await vncService.ensureSession(userId);
    if (!guiResult.success || !guiResult.data) {
      throw new Error(guiResult.error?.message || "Failed to create GUI session");
    }
    
    session.gui = guiResult.data;
    const gui = guiResult.data;

    // Get project directory
    const cwd = await getRealProjectDir(config.projectRoot, projectId);

    // Start file watcher if this is first terminal for project
    const watcherCount = this.projectWatcherRefs.get(projectId) ?? 0;
    if (watcherCount === 0) {
      await fileSystemService.loadProject(projectId);
      
      // Start file watcher with event handler
      await fileWatcherService.startWatcher(
        projectId,
        cwd,
        (event) => fsEventHandler.handleEvent(event)
      );
    }
    this.projectWatcherRefs.set(projectId, watcherCount + 1);

    // Create terminal
    const terminalResult = await terminalService.createTerminal(userId, projectId, cwd, gui);
    if (!terminalResult.success || !terminalResult.data) {
      throw new Error(terminalResult.error?.message || "Failed to create terminal");
    }

    const terminal = terminalResult.data;
    sessionManager.addTerminal(userId, terminalId, terminal);

    // Send welcome message
    const welcomeMsg = terminalService.generateWelcomeMessage(gui, userId);
    this.sendOutput(ws, welcomeMsg);

    // Setup PTY data handler
    terminal.pty.onData((data) => {
      this.handlePTYData(ws, userId, data);
    });

    // Setup PTY exit handler
    terminal.pty.onExit(({ exitCode, signal }) => {
      console.log(`🔚 Terminal exited: code=${exitCode}, signal=${signal}`);
      if (ws.readyState === WebSocket.OPEN) {
        this.sendExit(ws, exitCode);
      }
      ws.close();
    });

    // Setup WebSocket message handler
    ws.on("message", (msg: Buffer) => {
      this.handleClientMessage(ws, userId, terminalId, msg);
    });

    // Setup WebSocket close handler
    ws.on("close", () => {
      this.handleDisconnect(userId, terminalId, projectId);
    });

    // Setup WebSocket error handler
    ws.on("error", (error) => {
      console.error(`❌ WebSocket error for user=${userId}:`, error.message);
    });

    // Setup heartbeat
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.isAlive = true;
  }

  /**
   * Handle data from PTY (terminal output)
   */
  private handlePTYData(ws: ExtendedWebSocket, userId: string, data: string) {
    // Send output to client
    this.sendOutput(ws, data);

    // Detect production server port
    const detectedPort = terminalService.detectPort(data);
    if (detectedPort) {
      const session = sessionManager.getSession(userId);
      if (session && !sessionManager.hasPreview(userId, detectedPort)) {
        console.log(`🚀 Production server detected on port: ${detectedPort}`);
        
        // Generate preview token
        const token = sessionManager.generatePreviewToken(userId, detectedPort);
        sessionManager.addPreview(userId, detectedPort, token);

        // Send preview notification to client
        this.sendOutput(ws, `\n\n✅ Preview ready! Your app is running on port ${detectedPort}\n`);
        this.sendPreview(ws, detectedPort, token);
        
        console.log(`✅ Preview URL generated: port=${detectedPort} for user=${userId}`);
      }
    }
  }

  /**
   * Handle message from client
   */
  private handleClientMessage(
    ws: ExtendedWebSocket,
    userId: string,
    terminalId: string,
    msg: Buffer
  ) {
    try {
      const data: TerminalMessage = JSON.parse(msg.toString());
      const terminal = sessionManager.getTerminal(userId, terminalId);

      if (!terminal) {
        console.error(`❌ Terminal not found: user=${userId}, terminal=${terminalId}`);
        return;
      }

      switch (data.type) {
        case "input":
          const writeResult = terminalService.writeToTerminal(terminal, data.data);
          if (!writeResult.success) {
            console.error(`❌ Failed to write to terminal: ${writeResult.error?.message}`);
          }
          break;

        case "resize":
          const resizeResult = terminalService.resizeTerminal(terminal, data.cols, data.rows);
          if (!resizeResult.success) {
            console.error(`❌ Failed to resize terminal: ${resizeResult.error?.message}`);
          }
          break;

        default:
          console.warn(`⚠️  Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error(`❌ Error handling client message: ${error.message}`);
    }
  }

  /**
   * Handle WebSocket disconnect
   */
  private async handleDisconnect(userId: string, terminalId: string, projectId: string) {
    console.log(`🔌 Terminal WS disconnected: user=${userId}, terminal=${terminalId}`);

    // Remove terminal from session
    const terminal = sessionManager.removeTerminal(userId, terminalId);
    if (terminal) {
      terminalService.killTerminal(terminal);
    }

    // Decrease watcher reference count
    const watcherCount = this.projectWatcherRefs.get(projectId) ?? 1;
    const newCount = watcherCount - 1;

    if (newCount <= 0) {
      this.projectWatcherRefs.delete(projectId);
      await fileWatcherService.stopWatcher(projectId);
      await fileSystemService.unloadProject(projectId);
      console.log(`🧹 No active terminals, watcher stopped for project=${projectId}`);
    } else {
      this.projectWatcherRefs.set(projectId, newCount);
    }
  }

  /**
   * Send terminal output to client
   */
  private sendOutput(ws: ExtendedWebSocket, data: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "output", data }));
    }
  }

  /**
   * Send preview notification to client
   */
  private sendPreview(ws: ExtendedWebSocket, port: string, token: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "output", data: `PREVIEW:${port}:${token}\n` }));
    }
  }

  /**
   * Send exit notification to client
   */
  private sendExit(ws: ExtendedWebSocket, code?: number) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "exit", code }));
    }
  }

  /**
   * Send error to client
   */
  private sendError(ws: ExtendedWebSocket, message: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "error", message }));
    }
  }

  /**
   * Start heartbeat to detect stale connections
   */
  private startHeartbeat() {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client: ExtendedWebSocket) => {
        if (client.isAlive === false) {
          console.log(`💔 Terminating stale connection for userId=${client.userId}`);
          return client.terminate();
        }

        client.isAlive = false;
        try {
          client.ping();
        } catch (error) {
          console.error(`❌ Ping error: ${error.message}`);
        }
      });
    }, config.terminal.heartbeatInterval);
  }

  /**
   * Upgrade HTTP connection to WebSocket
   */
  public upgrade(
    req: IncomingMessage,
    socket: any,
    head: any,
    userId: string,
    terminalId: string,
    projectId: string
  ) {
    this.wss.handleUpgrade(req, socket, head, (ws: ExtendedWebSocket) => {
      ws.userId = userId;
      ws.terminalId = terminalId;
      ws.projectId = projectId;
      this.wss.emit("connection", ws, req);
    });
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    console.log("🧹 Cleaning up terminal WebSocket handler...");
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Close WebSocket server
   */
  public close() {
    this.cleanup();
    this.wss.close();
  }
}

export default new TerminalWSHandler();