import { WebSocket } from "ws";
//@ts-ignore
import { IPty } from "node-pty";
import type { ChildProcess } from "child_process";

/* ==================== Core Domain Types ==================== */

/**
 * GUI session representing an Xvfb display with VNC access
 */
export interface GuiSession {
  display: string;
  vncPort: number;
  index: number;
  ready: boolean;
  startedAt: Date;
  processes: {
    xvfb: ChildProcess;
    wm?: ChildProcess;
    x11vnc?: ChildProcess;
  };
}

/**
 * Terminal session with PTY process
 */
export interface TerminalSession {
  pty: IPty;
  projectId: string;
  startedAt: Date;
  lastActivity: Date;
}

/**
 * Preview server entry with authentication token
 */
export interface PreviewEntry {
  port: string;
  token: string;
  startedAt: Date;
  lastAccessed?: Date;
}

/**
 * Complete user session containing all resources
 */
export interface UserSession {
  userId: string;
  terminals: Map<string, TerminalSession>;
  gui: GuiSession | null;
  previews: Map<string, PreviewEntry>;
  createdAt: Date;
  lastActivity: Date;
}


/* ==================== WebSocket Types ==================== */

export interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  terminalId?: string;
  projectId?: string;
  isAlive?: boolean;
  
  // Explicitly declare WebSocket methods to avoid TypeScript errors
  close(code?: number, reason?: string): void;
  send(data: any, cb?: (err?: Error) => void): void;
  ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
  terminate(): void;
  readyState: number;
  on(event: string, listener: (...args: any[]) => void): this;
}

/* ==================== Message Types ==================== */

export type TerminalMessageType = 
  | "input" 
  | "output" 
  | "resize" 
  | "exit" 
  | "error"
  | "preview";

export interface BaseTerminalMessage {
  type: TerminalMessageType;
}

export interface TerminalInputMessage extends BaseTerminalMessage {
  type: "input";
  data: string;
}

export interface TerminalOutputMessage extends BaseTerminalMessage {
  type: "output";
  data: string;
}

export interface TerminalResizeMessage extends BaseTerminalMessage {
  type: "resize";
  cols: number;
  rows: number;
}

export interface TerminalExitMessage extends BaseTerminalMessage {
  type: "exit";
  code?: number;
}

export interface TerminalErrorMessage extends BaseTerminalMessage {
  type: "error";
  message: string;
}

export interface TerminalPreviewMessage extends BaseTerminalMessage {
  type: "preview";
  port: string;
  token: string;
}

export type TerminalMessage = 
  | TerminalInputMessage 
  | TerminalOutputMessage 
  | TerminalResizeMessage 
  | TerminalExitMessage
  | TerminalErrorMessage
  | TerminalPreviewMessage;

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

/* ==================== Service Response Types ==================== */

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

/* ==================== Utility Types ==================== */

export type AsyncCleanup = () => Promise<void>;

export interface Disposable {
  dispose(): Promise<void>;
}