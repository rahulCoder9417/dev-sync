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
  