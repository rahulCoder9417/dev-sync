import { WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import fs from "fs/promises";
import path from "path";
import { getRealProjectDir } from "../utils/getProjectDir.js";

// Event schema parity with main backend
export type RenderFileEvent =
  | { type: "file:create"; projectId: string; projectName: string; path: string; isDir?: boolean; content?: string }
  | { type: "file:update"; projectId: string; projectName: string; path: string; content: string }
  | { type: "file:delete"; projectId: string; projectName: string; path: string }
  | { type: "file:rename"; projectId: string; projectName: string; from: string; to: string };

const IGNORED = new Set(["node_modules", "dist", "build", ".next", "out"]);

export class FileSyncWS {
  private wss: WebSocketServer;
  private PROJECT_ROOT = "/usr/src/app/projects";

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
  }

  private isIgnored(rel: string) {
    const first = rel.split("/").filter(Boolean)[0];
    return first && IGNORED.has(first);
  }

  private async ensureDirForFile(fileAbs: string) {
    const dir = path.dirname(fileAbs);
    await fs.mkdir(dir, { recursive: true });
  }

  private async handleEvent(ev: RenderFileEvent) {
    // resolve project directory: /projects/<projectId>/<projectName>
    const projectRoot = path.join(this.PROJECT_ROOT, ev.projectId);
    const projectDir = await getRealProjectDir(this.PROJECT_ROOT, ev.projectId);

    switch (ev.type) {
      case "file:create": {
        if (this.isIgnored(ev.path)) return;
        const abs = path.join(projectDir, ev.path);
        if (ev.isDir) {
          await fs.mkdir(abs, { recursive: true });
          await fs.writeFile(abs + "/.keep", ""); // optional marker
        } else {
          await this.ensureDirForFile(abs);
          await fs.writeFile(abs, ev.content ?? "", "utf8");
        }
        break;
      }
      case "file:update": {
        if (this.isIgnored(ev.path)) return;
        const abs = path.join(projectDir, ev.path);
        await this.ensureDirForFile(abs);
        await fs.writeFile(abs, ev.content ?? "", "utf8");
        break;
      }
      case "file:delete": {
        if (this.isIgnored(ev.path)) return;
        const abs = path.join(projectDir, ev.path);
        await fs.rm(abs, { recursive: true, force: true });
        break;
      }
      case "file:rename": {
        if (this.isIgnored(ev.from) || this.isIgnored(ev.to)) return;
        const fromAbs = path.join(projectDir, ev.from);
        const toAbs = path.join(projectDir, ev.to);
        await this.ensureDirForFile(toAbs);
        await fs.rename(fromAbs, toAbs);
        break;
      }
    }
  }

  private setup() {
    this.wss.on("connection", async (ws) => {
      ws.on("message", async (buf) => {
        try {
          const ev = JSON.parse(buf.toString()) as RenderFileEvent;
          await this.handleEvent(ev);
        } catch (e) {
          console.error("file-sync handler error:", e);
        }
      });
    });
  }

  public upgrade(req: IncomingMessage, socket: any, head: any) {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit("connection", ws, req);
    });
  }
}

const fileSyncWS = new FileSyncWS();
export default fileSyncWS;
