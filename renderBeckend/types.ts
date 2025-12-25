import { WebSocket } from "ws";
// @ts-ignore
import { PtyProcess } from "node-pty";
import type { ChildProcess } from "child_process";

/* ---------- GUI Session ---------- */
export interface GuiSession {
  display: string;
  vncPort: number;
  index: number;
  ready: boolean;
  processes: {
    xvfb: ChildProcess;
    wm?: ChildProcess;
    x11vnc?: ChildProcess;
  };
}

/* ---------- Preview Entry ---------- */
export interface PreviewEntry {
  port: string;
  token: string;
  startedAt: Date;
}
export type ExtendedWebSocket = WebSocket & {
    userId?: string;
    terminalId?: string;
    projectId?: string;
    isAlive?: boolean;
}
export interface Session {
    terminals: {
      [terminalId: string]: PtyProcess;   // from node-pty
    };
    
    gui: GuiSession | null;
    
    previews: {
      [port: string]: PreviewEntry;
    };
  }
  
  export interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: {
      code: string;
      message: string;
      details?: any;
    };
  }
  
  export interface CleanupResult {
    processesKilled: number;
    errors: Error[];
  }
  
export interface ServerConfig {
  port: number;
  projectRoot: string;
  novncPath: string;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  gui: GuiConfig;
  terminal: TerminalConfig;
  proxy: ProxyConfig;
}
/* ==================== Configuration Types ==================== */

export interface GuiConfig {
  baseDisplay: number;
  baseVncPort: number;
  xvfbResolution: string;
  xvfbDepth: number;
  startupTimeout: number;
  windowManager: "fluxbox" | "openbox" | "none";
}

export interface TerminalConfig {
  shell: string;
  defaultCols: number;
  defaultRows: number;
  heartbeatInterval: number;
}

export interface ProxyConfig {
  previewSecret: string;
  tokenExpiry: number;
}