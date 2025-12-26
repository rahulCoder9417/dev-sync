// fsEventHandlers.ts
import path from "path";
import  FilePathCrud  from "./filePathCrud.js";
import { db } from "../lib/db/db.js";
// @ts-ignore
import  cuid  from "cuid";
import fs from "fs/promises";
import  fileSyncWS  from "../ws/fileSyncHandler.js";
import { getType } from "./fileOrFolder.js";
/**
 * Convert absolute path → project-relative path
 */
const PROJECT_ROOT = "/usr/src/app/projects";
// ---------------- FILE CREATE ----------------



export async function handleFileCreate(
  absPath: string,
  projectId: string
) {

  const parentId = await FilePathCrud.getFileIdByPath(projectId, path.dirname(absPath) +"/") || null;
  
  const id =cuid()
  const content = await fs.readFile(absPath, "utf8");
  FilePathCrud.setFilePath(projectId, id, absPath)
  fileSyncWS.sendFileEvent({
    type:"create",
    projectId,
    fileFolderId: id || null,
    parentId: parentId || null,
    fileName: absPath.split("/")[absPath.split("/").length - 1] ,
  })
  fileSyncWS.sendFileEvent({
    type:"save",
    projectId,
    fileId: id ,
    content,
  })
  try{
    const newFileItem = await db.fileItem.create({
    data: {
      id,
      name:absPath.split("/")[absPath.split("/").length - 1],
      type:"file",
      content: content,
      projectId,
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    },

  })
}
catch(e){
  console.log("error in handleFileCreate",e)
}
}

// ---------------- FOLDER CREATE ----------------

export async function handleFolderCreate(
  absPath: string,
  projectId: string
) {

  const parentId = await FilePathCrud.getFileIdByPath(projectId, path.dirname(absPath) +"/") || null;
  const id =cuid()
  FilePathCrud.setFilePath(projectId, id, absPath + "/")
  fileSyncWS.sendFileEvent({
    type:"create",
    projectId,
    fileFolderId: id || null,
    parentId: parentId || null,
    fileName: absPath.split("/")[absPath.split("/").length - 1] + "/",
  })
  try{
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
}
catch(e){
  console.log("error in handleFolderCreate",e)
}
}

// ---------------- FILE UPDATE ----------------

export async function handleFileUpdate(
  absPath: string,
  projectId: string
) {
  const content = await fs.readFile(absPath, "utf8");
  const fileId = await FilePathCrud.getFileIdByPath(projectId, absPath) ;
  
  fileSyncWS.sendFileEvent({
    type:"save",
    projectId,
    fileId: fileId || null,
    content,
  })
  try{
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
catch(e){
  console.log("error in handleFileUpdate",e)
}
}

// ---------------- FILE DELETE ----------------

export async function handleFileDelete(
  absPath: string,
  projectId: string 
) {
  const fileId = await FilePathCrud.getFileIdByPath(projectId, absPath) ;

  fileSyncWS.sendFileEvent({
    type:"delete",
    projectId,
    fileName: absPath.split("/")[absPath.split("/").length - 1],
    fileId: fileId || null,
  })
  try{
    await db.fileItem.delete({
    where: {
      id: fileId,
    },
  })
}
catch(e){
  console.log("error in handleFileDelete",e)
}
  FilePathCrud.deleteFilePath(projectId, fileId)
}

// ---------------- FOLDER DELETE ----------------

export async function handleFolderDelete(
  absPath: string,
  projectId: string
) {
  const fileId = await FilePathCrud.getFileIdByPath(projectId, absPath + "/") ;
  fileSyncWS.sendFileEvent({
    type:"delete",  
    fileName: absPath.split("/")[absPath.split("/").length - 1] + path.sep,
    projectId,
    fileId: fileId || null,
  })
  try{
    await db.fileItem.delete({
    where: {
      id: fileId,
    },
  })
}
catch(e){
  console.log("error in handleFolderDelete",e)
}
  FilePathCrud.deleteFilePath(projectId, fileId)
}
