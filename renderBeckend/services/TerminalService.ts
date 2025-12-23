//@ts-ignore
import { spawn, IPty } from "node-pty";
import { TerminalSession, ServiceResult, GuiSession } from "../types.js";
import config from "../config/index.js";
import sessionManager from "./SessionManager.js";
import path from "path";

/**
 * Port detection patterns for various dev servers
 */
const PORT_DETECTION_PATTERNS = [
  /listening on.*?(?:port\s*)?(\d{4,5})/i,
  /server.*?(?:running|started).*?(?:port\s*)?(\d{4,5})/i,
  /started.*?(?:on|at).*?:(\d{4,5})/i,
  /ready.*?(?:on|at).*?:(\d{4,5})/i,
  /serving.*?(?:on|at).*?:(\d{4,5})/i,
  /https?:\/\/(localhost|127\.0\.0\.1):(\d{4,5})/i,
];

/**
 * Manages PTY terminal processes
 */
export class TerminalService {
  /**
   * Create a new terminal session
   */
  async createTerminal(
    userId: string,
    projectId: string,
    cwd: string,
    gui: GuiSession
  ): Promise<ServiceResult<TerminalSession>> {
    try {
      console.log(`🖥️  Creating terminal for user=${userId} project=${projectId} cwd=${cwd}`);

      // Set environment with DISPLAY variable
      const env = {
        ...process.env,
        DISPLAY: gui.display,
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
      };

      // Spawn PTY process
      const pty: IPty = spawn(config.terminal.shell, [], {
        name: "xterm-color",
        cols: config.terminal.defaultCols,
        rows: config.terminal.defaultRows,
        cwd,
        env,
      });

      const terminal: TerminalSession = {
        pty,
        projectId,
        startedAt: new Date(),
        lastActivity: new Date(),
      };

      console.log(`✅ Terminal created successfully for user=${userId}`);

      return { success: true, data: terminal };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "TERMINAL_CREATE_ERROR",
          message: `Failed to create terminal: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Write data to terminal
   */
  writeToTerminal(terminal: TerminalSession, data: string): ServiceResult<void> {
    try {
      terminal.pty.write(data);
      terminal.lastActivity = new Date();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "TERMINAL_WRITE_ERROR",
          message: `Failed to write to terminal: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Resize terminal
   */
  resizeTerminal(terminal: TerminalSession, cols: number, rows: number): ServiceResult<void> {
    try {
      terminal.pty.resize(cols, rows);
      terminal.lastActivity = new Date();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "TERMINAL_RESIZE_ERROR",
          message: `Failed to resize terminal: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Detect production server port from terminal output
   */
  detectPort(output: string): string | null {
    // Clean ANSI codes for better detection
    const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, "");

    for (const pattern of PORT_DETECTION_PATTERNS) {
      const match = cleanOutput.match(pattern);
      if (match) {
        // Get port from either capture group 1 or 2
        const port = match[2] || match[1];
        if (port && parseInt(port) > 1024 && parseInt(port) < 65536) {
          return port;
        }
      }
    }

    return null;
  }

  /**
   * Kill terminal process
   */
  killTerminal(terminal: TerminalSession): ServiceResult<void> {
    try {
      if (terminal.pty && typeof terminal.pty.kill === 'function') {
        terminal.pty.kill();
        console.log(`🔪 Terminal process killed for project=${terminal.projectId}`);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "TERMINAL_KILL_ERROR",
          message: `Failed to kill terminal: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Generate welcome message for terminal
   */
  generateWelcomeMessage(gui: GuiSession, userId: string): string {
    const messages = [
      `🖼️  GUI Display ready: ${gui.display} (VNC port: ${gui.vncPort})`,
      `💡 Access GUI at: /gui/${userId}`,
      ``,
    ];
    
    return messages.map(msg => `${msg}\r\n`).join('');
  }
}
//checked for refator
export default new TerminalService();