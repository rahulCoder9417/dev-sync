// fsEventHandlers.ts
import path from "path";
import { cache, getFileIdByAbsPath, reverseCache } from "./filePathCrud.js";
import { db } from "../lib/db/db.js";
// @ts-ignore
import  cuid  from "cuid";
import fs from "fs/promises";
import  fileSyncWS  from "../ws/fileSyncHandler.js";
/**
 * Convert absolute path → project-relative path
 */
const PROJECT_ROOT = "/usr/src/app/projects";
// ---------------- FILE CREATE ----------------

export const checkFileSeprator =(absPath:string)=>{
  //made because in db folder name stored as / at last but ,watcher does not add / at last 
  const hasExt = path.extname(absPath) !== "";
  if (!hasExt && !absPath.endsWith(path.sep)) {
    absPath = absPath + path.sep;
  }
  return absPath;
}

export async function handleFileCreate(
  absPath: string,
  projectDir: string,
  projectId: string
) {

  console.log("[FS] file:create", absPath);

  const parentId =await getFileIdByAbsPath(projectDir, projectId, absPath ||null);
  const id =cuid()
  fileSyncWS.sendFileEvent({
    type:"create",
    projectId,
    fileFolderId: id || null,
    parentId: parentId || null,
    fileName: absPath.split("/")[absPath.split("/").length - 1],
  })
  const newFileItem = await db.fileItem.create({
    data: {
      id,
      name:checkFileSeprator(absPath.split("/")[absPath.split("/").length - 1]),
      type:"file",
      content: "",
      projectId,
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    },

  })
  cache.set(projectId, {
    ...cache.get(projectId),
    [id]: absPath,
  })
  reverseCache.set(projectId, {
    ...reverseCache.get(projectId),
    [absPath]: id,
  })
}

// ---------------- FOLDER CREATE ----------------

export async function handleFolderCreate(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  console.log("[FS] folder:create", absPath);


  const parentId =await getFileIdByAbsPath(projectDir, projectId,absPath ||null);
  const id =cuid()
  fileSyncWS.sendFileEvent({
    type:"create",
    projectId,
    fileFolderId: id || null,
    parentId: parentId || null,
    fileName: absPath.split("/")[absPath.split("/").length - 1] + "/",
  })
  const newFileItem = await db.fileItem.create({
    data: {
      id,
      name:absPath.split("/")[absPath.split("/").length - 1]+"/",
      type:"folder",
      content: "",
      projectId,
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    },

  })
  cache.set(projectId, {
    ...cache.get(projectId),
    [id]: absPath + "/",
  })
  reverseCache.set(projectId, {
    ...reverseCache.get(projectId),
    [absPath + "/"]: id,
  })
}

// ---------------- FILE UPDATE ----------------

export async function handleFileUpdate(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  console.log(absPath)
  const content = await fs.readFile(absPath, "utf8");
  const fileId = reverseCache.get(projectId)?.[absPath] ;
  
  fileSyncWS.sendFileEvent({
    type:"save",
    projectId,
    fileId: fileId || null,
    content,
  })
  await db.fileItem.update({
    where: {
      id: fileId,
    },
    data: {
      content,
      updatedAt: new Date(),
    },
  })
}

// ---------------- FILE DELETE ----------------

export async function handleFileDelete(
  absPath: string,
  projectDir: string,
  projectId: string 
) {
  console.log(reverseCache.get(projectId))
  console.log(absPath)
  const fileId = reverseCache.get(projectId)?.[absPath] ;
  console.log("deleting file--- id" + fileId +" path" + absPath)
  fileSyncWS.sendFileEvent({
    type:"delete",
    projectId,
    fileName: checkFileSeprator(absPath.split("/")[absPath.split("/").length - 1]),
    fileId: fileId || null,
  })
  await db.fileItem.delete({
    where: {
      id: fileId,
    },
  })
  cache.set(projectId, {
    ...cache.get(projectId),
    [fileId]: undefined,
  })
  reverseCache.set(projectId, {
    ...reverseCache.get(projectId),
    [absPath]: undefined,
  })
  console.log("[FS] file:delete", absPath);
}

// ---------------- FOLDER DELETE ----------------

export async function handleFolderDelete(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  console.log(reverseCache.get(projectId))
  console.log(absPath)
  const fileId = reverseCache.get(projectId)?.[absPath + "/"] ;
  console.log("deleting folder--- id" + fileId +" path" + absPath)
  fileSyncWS.sendFileEvent({
    type:"delete",
    fileName: checkFileSeprator(absPath.split("/")[absPath.split("/").length - 1]),
    projectId,
    fileId: fileId || null,
  })
  await db.fileItem.delete({
    where: {
      id: fileId,
    },
  })
  cache.set(projectId, {
    ...cache.get(projectId),
    [fileId]: undefined,
  })
  reverseCache.set(projectId, {
    ...reverseCache.get(projectId),
    [absPath + "/"]: undefined,
  })
}
