import { WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import fs from "fs/promises";
import path from "path";
import { getRealProjectDir } from "../utils/getProjectDir.js";
import { deleteFilePath, getFilePath, renameFilePaths, setFilePath } from "../utils/filePathCrud.js";
import { Sup } from "../utils/pathSuppressor.js";

// Event schema parity with main backend

 type RenderFileEvent =
  | {
      type: "file:create";
      projectId: string;
      fileFolderId: string;
      fileName :string;
      isDir: boolean;
      parentId :string;
    }
  | {
      type: "file:update";
      projectId: string;
      fileFolderId: string;
      content: string;
    }
  | {
      type: "file:delete";
      projectId: string;
      fileFolderId: string;
    }
  | {
      type: "file:rename";
      projectId: string;
      fileFolderId: string;
      fileName: string;
    };

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
    const projectDir = this.PROJECT_ROOT
  
    switch (ev.type) {
      // Disappearance events happen instantly.
      //  must suppress before they happen.
      case "file:create": {
        let parentAbs = await getFilePath(projectDir, ev.projectId, ev.parentId);
        if (!parentAbs) return;
  
        const newAbs = path.join(parentAbs, ev.fileName);
        if (this.isIgnored(newAbs)) return;
  
        if (ev.isDir) {
          await fs.mkdir(newAbs, { recursive: true });
        } else {
          await fs.writeFile(newAbs, "", "utf8");
        }
   Sup.suppress(newAbs);

        await setFilePath(projectDir, ev.projectId, ev.fileFolderId, newAbs);
        break;
      }
  
      case "file:update": {
        let abs = await getFilePath(projectDir, ev.projectId, ev.fileFolderId);
        if (!abs) return;
  
        await fs.writeFile(abs, ev.content ?? "", "utf8");
        Sup.suppress(abs);
        break;
      }
  
      case "file:delete": {
        let abs = await getFilePath(projectDir, ev.projectId, ev.fileFolderId);
        if (!abs) return;
        Sup.suppress(abs);

        await fs.rm(abs, { recursive: true, force: true });
        await deleteFilePath(projectDir, ev.projectId, ev.fileFolderId);
        break;
      }
  
      case "file:rename": {
        const oldAbs = await getFilePath(projectDir, ev.projectId, ev.fileFolderId);
        if (!oldAbs) return;
  
        const dir = path.dirname(oldAbs);
        const newAbs = path.join(dir, ev.fileName);
  
        if (this.isIgnored(newAbs)) return;
        Sup.suppress(oldAbs);
      Sup.suppress(newAbs);
        await fs.rename(oldAbs, newAbs);
        await renameFilePaths(projectDir, ev.projectId, oldAbs, newAbs);
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
