import WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";
import { RenderFileEvent } from "../types/renderSync";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const RENDER_WS_URL = (process.env.RENDER_WS_URL || "ws://localhost:4000") +"/ws/file-sync";

class RenderSyncClient {
  private ws: WebSocket | null = null;
  private queue: RenderFileEvent[] = [];
  private connecting = false;

  private ensureConnection() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    if (this.connecting) return;
    this.connecting = true;

    this.ws = new WebSocket(RENDER_WS_URL);

    this.ws.on("open", () => {
      this.connecting = false;
      // flush queued events
      for (const ev of this.queue) {
        try {
          this.ws?.send(JSON.stringify(ev));
        } catch {}
      }
      this.queue = [];
    });

    this.ws.on("close", () => {
      this.connecting = false;
      setTimeout(() => this.ensureConnection(), 1000);
    });

    this.ws.on("error", () => {
      // noop, will retry on close
    });
  }

  public send(event: RenderFileEvent) {
    console.log("sending")
    // ignore prohibited directories early (double safety)
    try {
      const first = (event as any).path?.split("/")[0];
      if (first && ["node_modules", "dist", "build", ".next", "out"].includes(first)) {
        console.log("ignoring",event)
        return;
      }
    } catch {}

    this.ensureConnection();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    } else {
      this.queue.push(event);
    }
  }
}

export const renderSyncClient = new RenderSyncClient();

// Convenience helpers to be called after DB has been updated successfully
export function sendFileCreated(args: {
  projectId: string;
  fileName: string;
  fileFolderId: string;
  isDir: boolean;
  parentId: string;
}) {
  const ev: RenderFileEvent = {
    type: "file:create",
    fileName: args.fileName,
    projectId: args.projectId,
    fileFolderId: args.fileFolderId,
    isDir: args.isDir,
    parentId: args.parentId,
  } as RenderFileEvent;
  renderSyncClient.send(ev);
}

export function sendFileUpdated(args: {
  projectId: string;
      fileFolderId: string;
  content: string;
}) {
  const ev: RenderFileEvent = {
    type: "file:update",
    projectId: args.projectId,
    fileFolderId: args.fileFolderId,
    content: args.content,
  };
  renderSyncClient.send(ev);
}

export function sendFileDeleted(args: {
  projectId: string;
  fileFolderId: string;
}) {
  const ev: RenderFileEvent = {
    type: "file:delete",
    projectId: args.projectId,
    fileFolderId: args.fileFolderId,
  };
  renderSyncClient.send(ev);
}

export function sendFileRenamed(args: {
  projectId: string;
  fileName:string;
  fileFolderId: string;
}) {
  const ev: RenderFileEvent = {
    type: "file:rename",
    projectId: args.projectId,
    fileFolderId: args.fileFolderId,
    fileName: args.fileName,
  };
  renderSyncClient.send(ev);
}
