import fs from "fs/promises";
import path from "path";
import fileSystemService from "../services/FileSystemService.js";
import fileSyncWS from "../ws/FileSyncWSHandler.js";
import { FileSystemEvent } from "../services/FileWatcherService.js";

/**
 * File system event handler that broadcasts changes to main backend
 */
export class FSEventHandler {
  /**
   * Handle file system event from watcher
   */
  async handleEvent(event: FileSystemEvent): Promise<void> {
    const { type, projectId, absPath } = event;

    try {
      switch (type) {
        case "file:create":
          await this.handleFileCreate(projectId, absPath);
          break;

        case "file:update":
          await this.handleFileUpdate(projectId, absPath);
          break;

        case "file:delete":
          await this.handleFileDelete(projectId, absPath);
          break;

        case "folder:create":
          await this.handleFolderCreate(projectId, absPath);
          break;

        case "folder:delete":
          await this.handleFolderDelete(projectId, absPath);
          break;

        default:
          console.warn(`⚠️  Unknown event type: ${type}`);
      }
    } catch (error) {
      console.error(`❌ Failed to handle ${type} for ${absPath}:`, error);
    }
  }

  /**
   * Handle file creation
   */
  private async handleFileCreate(projectId: string, absPath: string): Promise<void> {
    console.log(`📄 File created: ${path.basename(absPath)}`);

    // Get file ID
    const fileId = await fileSystemService.getFileIdByPath(projectId, absPath);
    if (!fileId) {
      console.warn(`⚠️  No file ID found for: ${absPath}`);
      return;
    }

    // Get parent directory
    const parentPath = path.dirname(absPath);
    const parentId = await fileSystemService.getFileIdByPath(projectId, parentPath + path.sep);
    const fileName = path.basename(absPath);

    // Broadcast create event
    fileSyncWS.broadcast({
      type: "create",
      projectId,
      fileFolderId: fileId,
      parentId: parentId || "",
      fileName,
    });
  }

  /**
   * Handle file update
   */
  private async handleFileUpdate(projectId: string, absPath: string): Promise<void> {
    console.log(`📝 File updated: ${path.basename(absPath)}`);

    // Get file ID
    const fileId = await fileSystemService.getFileIdByPath(projectId, absPath);
    if (!fileId) {
      console.warn(`⚠️  No file ID found for: ${absPath}`);
      return;
    }

    // Read file content
    let content: string;
    try {
      content = await fs.readFile(absPath, "utf8");
    } catch (error) {
      // File might be binary or unreadable
      console.warn(`⚠️  Could not read file: ${absPath}`, error.message);
      return;
    }

    // Broadcast save event
    fileSyncWS.broadcast({
      type: "save",
      projectId,
      fileId,
      content,
    });
  }

  /**
   * Handle file deletion
   */
  private async handleFileDelete(projectId: string, absPath: string): Promise<void> {
    console.log(`🗑️  File deleted: ${path.basename(absPath)}`);

    // Get file ID before it's removed from cache
    const fileId = await fileSystemService.getFileIdByPath(projectId, absPath);
    if (!fileId) {
      console.warn(`⚠️  No file ID found for: ${absPath}`);
      return;
    }

    const fileName = path.basename(absPath);

    // Broadcast delete event
    fileSyncWS.broadcast({
      type: "delete",
      projectId,
      fileId,
      fileName,
    });
  }

  /**
   * Handle folder creation
   */
  private async handleFolderCreate(projectId: string, absPath: string): Promise<void> {
    console.log(`📁 Folder created: ${path.basename(absPath)}`);

    // Normalize folder path (ensure trailing separator)
    const normalizedPath = absPath.endsWith(path.sep) ? absPath : absPath + path.sep;

    // Get folder ID
    const folderId = await fileSystemService.getFileIdByPath(projectId, normalizedPath);
    if (!folderId) {
      console.warn(`⚠️  No folder ID found for: ${normalizedPath}`);
      return;
    }

    // Get parent directory
    const parentPath = path.dirname(absPath);
    const parentId = await fileSystemService.getFileIdByPath(projectId, parentPath + path.sep);
    const folderName = path.basename(absPath);

    // Broadcast create event
    fileSyncWS.broadcast({
      type: "create",
      projectId,
      fileFolderId: folderId,
      parentId: parentId || "",
      fileName: folderName,
    });
  }

  /**
   * Handle folder deletion
   */
  private async handleFolderDelete(projectId: string, absPath: string): Promise<void> {
    console.log(`🗑️  Folder deleted: ${path.basename(absPath)}`);

    // Normalize folder path
    const normalizedPath = absPath.endsWith(path.sep) ? absPath : absPath + path.sep;

    // Get folder ID
    const folderId = await fileSystemService.getFileIdByPath(projectId, normalizedPath);
    if (!folderId) {
      console.warn(`⚠️  No folder ID found for: ${normalizedPath}`);
      return;
    }

    const folderName = path.basename(absPath);

    // Broadcast delete event
    fileSyncWS.broadcast({
      type: "delete",
      projectId,
      fileId: folderId,
      fileName: folderName,
    });
  }
}

export default new FSEventHandler();