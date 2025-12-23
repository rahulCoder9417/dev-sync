import { UserSession, TerminalSession, PreviewEntry, CleanupResult } from "../types.js";
import crypto from "crypto";
import config from "../config/index.js";

/**
 * Manages user sessions with terminals, previews, and GUI references
 */
export class SessionManager {
  private sessions = new Map<string, UserSession>();

  /**
   * Get or create a user session
   */
  getOrCreateSession(userId: string): UserSession {
    let session = this.sessions.get(userId);
    
    if (!session) {
      session = {
        userId,
        terminals: new Map(),
        gui: null,
        previews: new Map(),
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      this.sessions.set(userId, session);
      console.log(`📝 Created new session for user=${userId}`);
    }

    session.lastActivity = new Date();
    return session;
  }

  /**
   * Get existing session (returns null if not found)
   */
  getSession(userId: string): UserSession | null {
    return this.sessions.get(userId) || null;
  }

  /**
   * Add terminal to user session
   */
  addTerminal(userId: string, terminalId: string, terminal: TerminalSession): void {
    const session = this.getOrCreateSession(userId);
    session.terminals.set(terminalId, terminal);
    console.log(`📝 Added terminal ${terminalId} to user=${userId} session`);
  }

  /**
   * Remove terminal from user session
   */
  removeTerminal(userId: string, terminalId: string): TerminalSession | null {
    const session = this.getSession(userId);
    if (!session) return null;

    const terminal = session.terminals.get(terminalId);
    if (terminal) {
      session.terminals.delete(terminalId);
      console.log(`🗑️  Removed terminal ${terminalId} from user=${userId} session`);
    }
    
    return terminal || null;
  }

  /**
   * Get terminal from session
   */
  getTerminal(userId: string, terminalId: string): TerminalSession | null {
    const session = this.getSession(userId);
    return session?.terminals.get(terminalId) || null;
  }

  /**
   * Generate preview token for port
   */
  generatePreviewToken(userId: string, port: string): string {
    const data = `${userId}:${port}:${Date.now()}`;
    return crypto
      .createHmac("sha256", config.proxy.previewSecret)
      .update(data)
      .digest("hex");
  }

  /**
   * Add or update preview entry
   */
  addPreview(userId: string, port: string, token: string): PreviewEntry {
    const session = this.getOrCreateSession(userId);
    
    const preview: PreviewEntry = {
      port,
      token,
      startedAt: new Date(),
      lastAccessed: new Date(),
    };

    session.previews.set(port, preview);
    console.log(`🔗 Added preview for user=${userId} port=${port}`);
    
    return preview;
  }

  /**
   * Get preview by port
   */
  getPreview(userId: string, port: string): PreviewEntry | null {
    const session = this.getSession(userId);
    if (!session) return null;

    const preview = session.previews.get(port);
    if (preview) {
      preview.lastAccessed = new Date();
    }
    
    return preview || null;
  }

  /**
   * Check if port already has a preview
   */
  hasPreview(userId: string, port: string): boolean {
    const session = this.getSession(userId);
    return session?.previews.has(port) || false;
  }

  /**
   * Get all active terminal count for a project
   */
  getProjectTerminalCount(projectId: string): number {
    let count = 0;
    
    for (const session of this.sessions.values()) {
      for (const terminal of session.terminals.values()) {
        if (terminal.projectId === projectId) {
          count++;
        }
      }
    }
    
    return count;
  }

  /**
   * Clean up specific user session
   */
  async cleanupSession(userId: string): Promise<CleanupResult> {
    const session = this.sessions.get(userId);
    if (!session) {
      return { processesKilled: 0, errors: [] };
    }

    console.log(`🧹 Cleaning up session for user=${userId}`);
    
    const errors: Error[] = [];
    let killed = 0;

    // Kill all terminal PTY processes
    for (const [terminalId, terminal] of session.terminals) {
      try {
        if (terminal.pty && typeof terminal.pty.kill === 'function') {
          terminal.pty.kill();
          killed++;
        }
      } catch (err) {
        errors.push(new Error(`Failed to kill terminal ${terminalId}: ${err.message}`));
      }
    }

    this.sessions.delete(userId);
    
    return { processesKilled: killed, errors };
  }

  /**
   * Clean up all sessions
   */
  async cleanupAll(): Promise<CleanupResult> {
    console.log("🧹 Cleaning up all user sessions...");
    
    const results = await Promise.all(
      Array.from(this.sessions.keys()).map(userId => 
        this.cleanupSession(userId)
      )
    );

    const totalKilled = results.reduce((sum, r) => sum + r.processesKilled, 0);
    const allErrors = results.flatMap(r => r.errors);

    console.log(`✅ Cleaned up ${totalKilled} terminal processes with ${allErrors.length} errors`);
    
    return { processesKilled: totalKilled, errors: allErrors };
  }

  /**
   * Get session statistics
   */
  getStats() {
    let totalTerminals = 0;
    let totalPreviews = 0;
    let sessionsWithGui = 0;

    for (const session of this.sessions.values()) {
      totalTerminals += session.terminals.size;
      totalPreviews += session.previews.size;
      if (session.gui) sessionsWithGui++;
    }

    return {
      totalSessions: this.sessions.size,
      totalTerminals,
      totalPreviews,
      sessionsWithGui,
    };
  }
}

export default new SessionManager();