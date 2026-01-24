// fsEventHandlers.ts
import path from "path";
import FilePathCrud from "./filePathCrud.js";
import { db } from "../lib/db/db.js";
// @ts-ignore
import cuid from "cuid";
import fs from "fs/promises";
import fileSyncWS from "../ws/fileSyncHandler.js";
import { getType } from "./fileOrFolder.js";
import { getRealProjectDir } from "./getProjectDir.js";
/**
 * Convert absolute path → project-relative path
 */
const PROJECT_ROOT = "/usr/src/app/projects";
// ---------------- FILE CREATE ----------------


function isRootChild(absPath: string, projectDir: string): boolean {
  const rel = path.relative(projectDir, absPath);
  return rel !== "." && !rel.startsWith("..") && !rel.includes(path.sep);
}
function normalize(p: string) {
  return p.replace(/\\/g, "/").replace(/\/+$/, "");
}
function folderKey(p: string) {
  return normalize(p) + path.sep;
}
export async function ensureFolder(
  absPath: string,
  projectId: string,
  projectDir: string
): Promise<string | null> {
  //this is used for checking parent folder

  const normalized = normalize(absPath);
  const root = normalize(projectDir);

  // 🟢 Project root → no DB row
  if (normalized === root) {
    return null;
  }

  // 🟢 Already exists (idempotent)
  const cached = await FilePathCrud.getFileIdByPath(
    projectId,
    folderKey(absPath)
  )
  if (cached) {
    return cached;
  }

  // 🟢 ROOT-LEVEL FOLDER
  if (isRootChild(normalized, root)) {
    const id = cuid();

    await db.fileItem.create({
      data: {
        id,
        name: path.basename(normalized) + path.sep,
        type: "folder",
        content: "",
        projectId,
        parentId: null,
      },
    });

    FilePathCrud.setFilePath(projectId, id, folderKey(absPath));
    return id;
  }

  // 🟢 NESTED FOLDER → ensure parent first
  const parentPath = path.dirname(normalized) ;
  const parentId = await ensureFolder(parentPath, projectId, root);

  const id = cuid();
  await db.fileItem.create({
    data: {
      id,
      name: path.basename(normalized) + path.sep,
      type: "folder",
      content: "",
      projectId,
      parentId,
    },
  });

  FilePathCrud.setFilePath(projectId, id, folderKey(absPath));
  return id;
}



export async function handleFileCreate(absPath: string, projectId: string) {
  const parentId =(await ensureFolder(path.dirname(absPath), projectId, await getRealProjectDir(PROJECT_ROOT, projectId))) || null;

  const id = cuid();
  const content = await fs.readFile(absPath, "utf8");
  fileSyncWS.sendFileEvent({
    type: "create",
    projectId,
    fileFolderId: id || null,
    parentId: parentId || null,
    fileName: absPath.split("/")[absPath.split("/").length - 1],
  });
  fileSyncWS.sendFileEvent({
    type: "save",
    projectId,
    fileId: id,
    content,
  });
  try {
    const newFileItem = await db.fileItem.create({
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

    FilePathCrud.setFilePath(projectId, id, absPath);
  } catch (e) {
    console.log("error in handleFileCreate " + absPath + " " + id, e);
  }
}

// ---------------- FOLDER CREATE ----------------

export async function handleFolderCreate(absPath: string, projectId: string) {
  const parentId =
    (await ensureFolder(path.dirname(absPath), projectId, await getRealProjectDir(PROJECT_ROOT, projectId))) || null;
  const id = cuid();
  fileSyncWS.sendFileEvent({
    type: "create",
    projectId,
    fileFolderId: id || null,
    parentId: parentId || null,
    fileName: absPath.split("/")[absPath.split("/").length - 1] + "/",
  });
  try {
    const newFileItem = await db.fileItem.create({
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
    
    FilePathCrud.setFilePath(projectId, id, absPath + "/");
  } catch (e) {
    console.log("error in handleFolderCreate " + absPath + " " + id, e);
  }

}

// ---------------- FILE UPDATE ----------------

export async function handleFileUpdate(absPath: string, projectId: string) {
  const content = await fs.readFile(absPath, "utf8");
  const fileId = await FilePathCrud.getFileIdByPath(projectId, absPath);
  if (!fileId) {
    // File exists on disk but not in DB → treat as create
    await handleFileCreate(absPath, projectId);
    return;
  }

  fileSyncWS.sendFileEvent({
    type: "save",
    projectId,
    fileId: fileId || null,
    content,
  });
  try {
    await db.fileItem.update({
      where: {
        id: fileId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });
  } catch (e) {
    console.log("error in handleFileUpdate " + absPath + " " + fileId, e);
  }
}

// ---------------- FILE DELETE ----------------

export async function handleFileDelete(absPath: string, projectId: string) {
  const fileId = await FilePathCrud.getFileIdByPath(projectId, absPath);

  fileSyncWS.sendFileEvent({
    type: "delete",
    projectId,
    fileName: absPath.split("/")[absPath.split("/").length - 1],
    fileId: fileId || null,
  });
  if (fileId) {
    try {
      await db.fileItem.delete({
        where: {
          id: fileId,
        },
      });
    } catch (e) {
      console.log("error in handleFileDelete " + absPath + " " + fileId, e);
    }

    FilePathCrud.deleteFilePath(projectId, fileId);
  }
}

// ---------------- FOLDER DELETE ----------------

export async function handleFolderDelete(absPath: string, projectId: string) {
  const fileId = await FilePathCrud.getFileIdByPath(projectId, absPath + "/");
  fileSyncWS.sendFileEvent({
    type: "delete",
    fileName: absPath.split("/")[absPath.split("/").length - 1] + path.sep,
    projectId,
    fileId: fileId || null,
  });
  try {
    await db.fileItem.delete({
      where: {
        id: fileId,
      },
    });
  } catch (e) {
    console.log("error in handleFolderDelete " + absPath + " " + fileId, e);
  }
  FilePathCrud.deleteFilePath(projectId, fileId);
}
