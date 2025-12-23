import fs from "fs/promises";
import path from "path";
import fileSystemService from "../services/FileSystemService.js";
import fileSyncWS from "../ws/FileSyncWSHandler.js";
import { FileSystemEvent } from "../services/FileWatcherService.js";
import cuid from "cuid";
import { db } from "../lib/db/db.js";

/**
 * File system event handler that broadcasts changes to main backend
 */
export class FSEventHandler {
  /**
   * Handle file system event from watcher
   */

  checkFileSeprator(absPath: string) {
    //made because in db folder name stored as / at last but ,watcher does not add / at last
    const hasExt = path.extname(absPath) !== "";
    if (!hasExt && !absPath.endsWith(path.sep)) {
      absPath = absPath + path.sep;
    }
    return absPath;
  }
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
  private async handleFileCreate(
    projectId: string,
    absPath: string
  ): Promise<void> {
    // Get file ID
    const fileId = await fileSystemService.getFileIdByPath(projectId, absPath);
    if (!fileId) {
      console.warn(`⚠️  No file ID found for: ${absPath}`);
      return;
    }

    // Get parent directory
    const parentPath = path.dirname(absPath);
    const parentId = await fileSystemService.getFileIdByPath(
      projectId,
      parentPath + path.sep
    );
    const fileName = path.basename(absPath);
    const id = cuid();
    const content = await fs.readFile(absPath, "utf8");
    fileSystemService.setFilePath(projectId, id, absPath);
    // Broadcast create event
    fileSyncWS.broadcast({
      type: "create",
      projectId,
      fileFolderId: fileId,
      parentId: parentId || "",
      fileName,
    });
    fileSyncWS.broadcast({
      type: "save",
      projectId,
      fileId: id,
      content,
    });
    await db.fileItem.create({
      data: {
        id,
        name: absPath.split("/")[absPath.split("/").length - 1],
        type: "file",
        content: content,
        projectId,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Handle file update
   */
  private async handleFileUpdate(
    projectId: string,
    absPath: string
  ): Promise<void> {
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
    await db.fileItem.update({
      where: {
        id: fileId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Handle file deletion
   */
  private async handleFileDelete(
    projectId: string,
    absPath: string
  ): Promise<void> {
    // Get file ID before it's removed from cache
    const fileId = await fileSystemService.getFileIdByPath(projectId, absPath);
    if (!fileId) {
      console.warn(`⚠️  No file ID found for: ${absPath}`);
      return;
    }

    // Broadcast delete event
    fileSyncWS.broadcast({
      type: "delete",
      projectId,
      fileId,
      fileName: this.checkFileSeprator(
        absPath.split("/")[absPath.split("/").length - 1]
      ),
    });
    await db.fileItem.delete({
      where: {
        id: fileId,
      },
    });
    fileSystemService.deleteFilePath(projectId, absPath);
  }

  /**
   * Handle folder creation
   */
  private async handleFolderCreate(
    projectId: string,
    absPath: string
  ): Promise<void> {
    // Get parent directory
    const parentPath = path.dirname(absPath);
    const parentId = await fileSystemService.getFileIdByPath(
      projectId,
      parentPath + path.sep
    );
    const id = cuid();
    fileSystemService.setFilePath(projectId, id, absPath + path.sep);
    // Broadcast create event
    fileSyncWS.broadcast({
      type: "create",
      projectId,
      fileFolderId: id,
      parentId: parentId || null,
      fileName: absPath.split("/")[absPath.split("/").length - 1] + "/",
    });
    await db.fileItem.create({
      data: {
        id,
        name: absPath.split("/")[absPath.split("/").length - 1] + "/",
        type: "folder",
        content: "",
        projectId,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Handle folder deletion
   */
  private async handleFolderDelete(
    projectId: string,
    absPath: string
  ): Promise<void> {
    const normalizedPath = absPath.endsWith(path.sep)
      ? absPath
      : absPath + path.sep;

    // Get folder ID
    const folderId = await fileSystemService.getFileIdByPath(
      projectId,
      normalizedPath
    );
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
      fileName: this.checkFileSeprator(
        absPath.split("/")[absPath.split("/").length - 1]
      ),
    });

    await db.fileItem.delete({
      where: {
        id: folderId,
      },
    });
    fileSystemService.deleteFilePath(projectId, normalizedPath);
  }
}

export default new FSEventHandler();
