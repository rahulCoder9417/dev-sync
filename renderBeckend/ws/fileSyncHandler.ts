import { WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import fs from "fs/promises";
import path from "path";
import { getRealProjectDir } from "../utils/getProjectDir.js";
import FilePathCrud from "../utils/filePathCrud.js";
import { Sup } from "../utils/pathSuppressor.js";
import { downloadFile, isSupportedMediaFile } from "../controller/diskFileSave.js";

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

  type OutGoingFileBroadcast = {
    type: "save";
    projectId: string;
    fileId: string;
    content: string;
  }
  |{
    type:"rename";
    projectId: string;
    fileId: string;
    fileName: string;
  }
  |{
    type:"delete";
    projectId: string;
    fileId: string;
    fileName: string;
  }
  |{
    type:"create";
    projectId: string;
    fileFolderId: string;
    parentId: string;
    fileName: string;
  }
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
        let parentAbs = await FilePathCrud.getFilePath(ev.projectId, ev.parentId);
        if (!parentAbs) return;
  
        const newAbs = path.join(parentAbs, ev.fileName);
        if (this.isIgnored(newAbs)) return;
  
        Sup.suppress(newAbs);
        if (ev.isDir) {
          await fs.mkdir(newAbs, { recursive: true });
        } else {
          
          await fs.writeFile(newAbs, "", "utf8");
        }

        await FilePathCrud.setFilePath( ev.projectId, ev.fileFolderId, newAbs);
        break;
      }
  
      case "file:update": {
        let abs = await FilePathCrud.getFilePath( ev.projectId, ev.fileFolderId);
        if (!abs) return;
  
        Sup.suppress(abs);
        let fileName = path.basename(abs);
         if (isSupportedMediaFile(fileName) && ev.content?.startsWith("http") && ev.content.includes("res.cloudinary.com") ) {
                      console.log(`⬇️  Downloading: ${fileName}`);
                      const buffer = await downloadFile(ev.content);
                      await fs.writeFile(abs, buffer);
                      console.log(`✅ Downloaded file: ${abs}`);
                    } else {
                      await fs.writeFile(abs, ev.content || "", "utf8");
                      console.log(`✅ Created file: ${abs}`);
                    }
        break;
      }
  
      case "file:delete": {
        let abs = await FilePathCrud.getFilePath( ev.projectId, ev.fileFolderId);
        if (!abs) return;
        Sup.suppress(abs);

        await fs.rm(abs, { recursive: true, force: true });
        await FilePathCrud.deleteFilePath( ev.projectId, ev.fileFolderId);
        break;
      }
  
      case "file:rename": {
        const oldAbs = await FilePathCrud.getFilePath( ev.projectId, ev.fileFolderId);
        if (!oldAbs) return;
  
        const dir = path.dirname(oldAbs);
        const newAbs = path.join(dir, ev.fileName);
  
        if (this.isIgnored(newAbs)) return;
        Sup.suppress(oldAbs);
      Sup.suppress(newAbs);
        await fs.rename(oldAbs, newAbs);
        await FilePathCrud.renameFilePath( ev.projectId, oldAbs, newAbs);
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
//there will be only one client connected the main beckend

  public sendFileEvent(ev: OutGoingFileBroadcast) {
    console.log("[FS] file:send", ev);
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
