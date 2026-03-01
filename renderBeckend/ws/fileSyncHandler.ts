import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import fs from "fs/promises";
import path from "path";
import { getRealProjectDir } from "../utils/getProjectDir.js";
import FilePathCrud from "../utils/filePathCrud.js";
import { Sup } from "../utils/pathSuppressor.js";
import {
  downloadFile,
  isSupportedMediaFile,
} from "../controller/diskFileSave.js";

// Event schema parity with main backend
type AliveWebSocket = WebSocket & { isAlive?: boolean };

type RenderFileEvent =
  | {
      type: "file:move";
      projectId: string;
      moveNode: string;
      moveToNode: string | null;
    }
  | {
      type: "file:create";
      projectId: string;
      fileFolderId: string;
      fileName: string;
      isDir: boolean;
      parentId: string;
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

type OutGoingFileBroadcast =
  | {
      type: "save";
      projectId: string;
      fileId: string;
      content: string;
    }
  | {
      type: "rename";
      projectId: string;
      fileId: string;
      fileName: string;
    }
  | {
      type: "delete";
      projectId: string;
      fileId: string;
      fileName: string;
    }
  | {
      type: "create";
      projectId: string;
      nodeType: "file" | "folder";
      fileFolderId: string;
      parentId: string;
      fileName: string;
    };
const IGNORED = new Set(["node_modules", "dist", "build", ".next", "out"]);

export class FileSyncWS {
  private wss: WebSocketServer;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
  }

  private isIgnored(rel: string) {
    const first = rel.split(path.sep).filter(Boolean)[0];
    return first && IGNORED.has(first);
  }

  private async ensureDirForFile(fileAbs: string) {
    const dir = path.dirname(fileAbs);
    await fs.mkdir(dir, { recursive: true });
  }

  private async handleEvent(ev: RenderFileEvent) {

    switch (ev.type) {
      // Disappearance events happen instantly.
      //  must suppress before they happen.
      case "file:create": {
        let parentAbs = await FilePathCrud.getFilePath(
          ev.projectId,
          ev.parentId,
        );
        if (!parentAbs) return;

        const newAbs = path.join(parentAbs, ev.fileName);
        if (this.isIgnored(newAbs)) return;

        Sup.suppress(newAbs);
        if (ev.isDir) {
          await fs.mkdir(newAbs, { recursive: true });
        } else {
          await fs.writeFile(newAbs, "", "utf8");
        }

        await FilePathCrud.setFilePath(ev.projectId, ev.fileFolderId, newAbs);
        break;
      }
      case "file:move": {
        let newParent = await FilePathCrud.getFilePath(
          ev.projectId,
          ev.moveToNode,
        );
        let node = await FilePathCrud.getFilePath(
          ev.projectId,
          ev.moveNode,
        );
        if (!newParent || !node) return;
        const fileName = path.basename(node);
        const newPath = path.join(newParent, fileName);
        Sup.suppress(node);
        Sup.suppress(newPath);
        try {
            await fs.rename(node, newPath);
            console.log("Moved successfully");
          } catch (err) {
            console.error("Move failed:", err);
          }
        if (this.isIgnored(newPath)) return;
        await FilePathCrud.setFilePath(ev.projectId, ev.moveNode, newPath);
        break;
      }


      case "file:update": {
        let abs = await FilePathCrud.getFilePath(ev.projectId, ev.fileFolderId);
        if (!abs) return;

        Sup.suppress(abs);
        let fileName = path.basename(abs);
        if (
          isSupportedMediaFile(fileName) &&
          ev.content?.startsWith("http") &&
          ev.content.includes("res.cloudinary.com")
        ) {
          const buffer = await downloadFile(ev.content);
          await fs.writeFile(abs, buffer);
        } else {
          await fs.writeFile(abs, ev.content || "", "utf8");
        }
        break;
      }

      case "file:delete": {
        let abs = await FilePathCrud.getFilePath(ev.projectId, ev.fileFolderId);
        if (!abs) return;
        Sup.suppress(abs);

        await fs.rm(abs, { recursive: true, force: true });
        await FilePathCrud.deleteFilePath(ev.projectId, ev.fileFolderId);
        break;
      }

      case "file:rename": {
        const oldAbs = await FilePathCrud.getFilePath(
          ev.projectId,
          ev.fileFolderId,
        );
        if (!oldAbs) return;

        const dir = path.dirname(oldAbs);
        const newAbs = path.join(dir, ev.fileName);

        if (this.isIgnored(newAbs)) return;
        Sup.suppress(oldAbs);
        Sup.suppress(newAbs);
        await fs.rename(oldAbs, newAbs);
        await FilePathCrud.renameFilePath(ev.projectId, oldAbs, newAbs);
        break;
      }
    }
  }

  private setup() {
    this.wss.on("connection", async (ws) => {
      ws.isAlive = true;

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", async (buf) => {
        try {
          const ev = JSON.parse(buf.toString()) as RenderFileEvent;
          await this.handleEvent(ev);
        } catch (e) {
          console.error("file-sync handler error:", e);
        }
      });
    });
    this.startHeartbeat();
  }
  //there will be only one client connected the main beckend
  private startHeartbeat() {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws: AliveWebSocket) => {
        if (ws.isAlive === false) {
          console.log("[FileSyncWS] stale connection terminated");
          return ws.terminate();
        }

        ws.isAlive = false;
        try {
          ws.ping();
        } catch (e) {
          console.error("[FileSyncWS] ping error", e);
        }
      });
    }, 30000);
  }
  public close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.wss.close();
  }

  public sendFileEvent(ev: OutGoingFileBroadcast) {
    this.wss.clients.forEach((ws) => {
      ws.send(JSON.stringify(ev));
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
