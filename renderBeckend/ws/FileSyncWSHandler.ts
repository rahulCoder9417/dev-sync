import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import fs from "fs/promises";
import path from "path";
import config from "../config/index.js";
import fileSystemService from "../services/FileSystemService.js";
import fileWatcherService from "../services/FileWatcherService.js";
import { downloadFile, isSupportedMediaFile } from "../controller/diskFileSave.js";

/**
 * Incoming file events from main backend
 */
type IncomingFileEvent =
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

/**
 * Outgoing file events to main backend
 */
type OutgoingFileEvent =
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
      fileFolderId: string;
      parentId: string;
      fileName: string;
    };

/**
 * Handles file synchronization WebSocket between main and render backends
 */
export class FileSyncWSHandler {
  private wss: WebSocketServer;

  // Directories to ignore during sync
  private readonly IGNORED_DIRS = new Set([
    "node_modules",
    "dist",
    "build",
    ".next",
    "out",
    ".cache",
    "coverage",
  ]);

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setup();
  }

  /**
   * Setup WebSocket connection handler
   */
  private setup() {
    this.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", async (buf: Buffer) => {
        try {
          const event = JSON.parse(buf.toString()) as IncomingFileEvent;
          await this.handleIncomingEvent(event);
        } catch (error) {
          console.error("❌ File sync handler error:", error);
          this.sendError(ws, error.message);
        }
      });

      ws.on("close", () => {
        console.log("🔌 File sync WebSocket disconnected");
      });

      ws.on("error", (error) => {
        console.error("❌ File sync WebSocket error:", error.message);
      });
    });
  }

  /**
   * Handle incoming file event from main backend
   */
  private async handleIncomingEvent(event: IncomingFileEvent): Promise<void> {
    const { projectId } = event;

    try {
      switch (event.type) {
        case "file:create":
          await this.handleCreate(event);
          break;

        case "file:update":
          await this.handleUpdate(event);
          break;

        case "file:delete":
          await this.handleDelete(event);
          break;

        case "file:rename":
          await this.handleRename(event);
          break;

        default:
          console.warn(`⚠️  Unknown event type: ${(event as any).type}`);
      }
    } catch (error) {
      console.error(`❌ Failed to handle ${event.type} for project=${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Handle file/folder creation
   */
  private async handleCreate(event: Extract<IncomingFileEvent, { type: "file:create" }>) {
    const { projectId, fileFolderId, fileName, isDir, parentId } = event;

    // Get parent directory path
    const parentAbs = await fileSystemService.getFilePath(projectId, parentId);
    if (!parentAbs) {
      console.error(`❌ Parent not found: ${parentId}`);
      return;
    }

    const newAbs = path.join(parentAbs, fileName);

    // Check if path should be ignored
    if (this.isIgnored(newAbs)) {
      console.log(`⏭️  Ignoring: ${newAbs}`);
      return;
    }

    // Suppress watcher events for this path
    fileWatcherService.suppressPath(projectId, newAbs);

    // Create file or directory
    if (isDir) {
      await fs.mkdir(newAbs, { recursive: true });
    } else {
      // Ensure parent directory exists
      await fs.mkdir(path.dirname(newAbs), { recursive: true });
      await fs.writeFile(newAbs, "", "utf8");
    }

    // Update file mapping
    await fileSystemService.setFilePath(projectId, fileFolderId, newAbs);
  }

  /**
   * Handle file content update
   */
  private async handleUpdate(event: Extract<IncomingFileEvent, { type: "file:update" }>) {
    const { projectId, fileFolderId, content } = event;

    // Get file path
    const absPath = await fileSystemService.getFilePath(projectId, fileFolderId);
    if (!absPath) {
      console.error(`❌ File not found: ${fileFolderId}`);
      return;
    }

    // Suppress watcher events
    fileWatcherService.suppressPath(projectId, absPath);

    const fileName = path.basename(absPath);

    // Check if this is a media file with Cloudinary URL
    if (
      isSupportedMediaFile(fileName) &&
      content?.startsWith("http") &&
      content.includes("res.cloudinary.com")
    ) {
      const buffer = await downloadFile(content);
      await fs.writeFile(absPath, buffer);
    } else {
      // Regular text file
      await fs.writeFile(absPath, content || "", "utf8");
    }
  }

  /**
   * Handle file/folder deletion
   */
  private async handleDelete(event: Extract<IncomingFileEvent, { type: "file:delete" }>) {
    const { projectId, fileFolderId } = event;

    // Get file path
    const absPath = await fileSystemService.getFilePath(projectId, fileFolderId);
    if (!absPath) {
      console.error(`❌ File not found for deletion: ${fileFolderId}`);
      return;
    }

    // Suppress watcher events
    fileWatcherService.suppressPath(projectId, absPath);

    // Delete file/folder
    await fs.rm(absPath, { recursive: true, force: true });

    // Remove from file mapping
    await fileSystemService.deleteFilePath(projectId, fileFolderId);
  }

  /**
   * Handle file/folder rename
   */
  private async handleRename(event: Extract<IncomingFileEvent, { type: "file:rename" }>) {
    const { projectId, fileFolderId, fileName } = event;

    // Get old path
    const oldAbs = await fileSystemService.getFilePath(projectId, fileFolderId);
    if (!oldAbs) {
      console.error(`❌ File not found for rename: ${fileFolderId}`);
      return;
    }

    const dir = path.dirname(oldAbs);
    const newAbs = path.join(dir, fileName);

    // Check if new path should be ignored
    if (this.isIgnored(newAbs)) {
      console.log(`⏭️  Ignoring rename to: ${newAbs}`);
      return;
    }

    // Suppress watcher events for both paths
    fileWatcherService.suppressPath(projectId, oldAbs);
    fileWatcherService.suppressPath(projectId, newAbs);

    // Rename file/folder
    await fs.rename(oldAbs, newAbs);

    // Update file mappings (handles folders recursively)
    await fileSystemService.renameFilePath(projectId, oldAbs, newAbs);
  }

  /**
   * Check if path should be ignored
   */
  private isIgnored(absPath: string): boolean {
    const parts = absPath.split(path.sep).filter(Boolean);
    
    // Check if any part of the path is in ignored dirs
    for (const part of parts) {
      if (this.IGNORED_DIRS.has(part)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Broadcast file event to main backend
   */
  broadcast(event: OutgoingFileEvent) {
    const message = JSON.stringify(event);

    this.wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  /**
   * Send error message to connected clients
   */
  private sendError(ws: WebSocket, message: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "error", message }));
    }
  }

  /**
   * Upgrade HTTP connection to WebSocket
   */
  upgrade(req: IncomingMessage, socket: any, head: any) {
    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit("connection", ws, req);
    });
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.wss.clients.size;
  }

  /**
   * Close WebSocket server
   */
  close() {
    console.log("🧹 Closing file sync WebSocket handler...");
    this.wss.close();
  }
}

export default new FileSyncWSHandler();