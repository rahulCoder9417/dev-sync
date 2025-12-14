import fs from "fs/promises";
import path from "path";
import { loadProjectIntoDisk } from "../controller/diskFileSave.js";
import { getRealProjectDir } from "./getProjectDir.js";
//use absolute path
type FileMap = Record<string, string>;
type ReverseMap = Record<string, string>;
export const cache = new Map<string, FileMap>();
// Internal, transient reverse map cache (not persisted)
export const reverseCache = new Map<string, ReverseMap>();

export async function loadFile(projectRoot: string, projectId: string) {
  if (cache.has(projectId)) return;
  await loadProjectIntoDisk(projectId, false);
  const mapPath = path.join(projectRoot, projectId, "fileMap.json");
  const raw = await fs.readFile(mapPath, "utf8");
  const fileMap = JSON.parse(raw);
  cache.set(projectId, fileMap);
  // Build transient reverse cache
  const reverseMap = Object.fromEntries(
    Object.entries(fileMap).map(([fileId, absPath]) => [absPath as string, fileId])
  );
  reverseCache.set(projectId, reverseMap);
}

export async function getFilePath(projectRoot: string, projectId: string, fileId: string) {
  await loadFile(projectRoot, projectId);
  if(!fileId){
    //it is in root 
    return await getRealProjectDir(projectRoot, projectId,);
  }
  return cache.get(projectId)?.[fileId] || null;
}

async function saveFileMap(projectRoot: string, projectId: string) {
  const map = cache.get(projectId);
  if (!map) return;

  const mapPath = path.join(projectRoot, projectId, "fileMap.json");
  await fs.writeFile(mapPath, JSON.stringify(map, null, 2), "utf8");
  // Do NOT persist reverse map; keep it only in memory
}

// CREATE
export async function setFilePath(projectRoot: string, projectId: string, fileId: string, absPath: string) {
  await loadFile(projectRoot, projectId);
  const map = cache.get(projectId)!;
  const reverse = reverseCache.get(projectId) ?? {};

  map[fileId] = absPath;
  reverse[absPath] = fileId;
  reverseCache.set(projectId, reverse);

  await saveFileMap(projectRoot, projectId);
}

// DELETE
export async function deleteFilePath(projectRoot: string, projectId: string, fileId: string) {
  await loadFile(projectRoot, projectId);
  const map = cache.get(projectId)!;
  const reverse = reverseCache.get(projectId) ?? {};
  const oldPath = map[fileId];

  delete map[fileId];
  if (oldPath) {
    delete reverse[oldPath];
  }
  reverseCache.set(projectId, reverse);

  await saveFileMap(projectRoot, projectId);
}

// RENAME (file or folder)
export async function renameFilePaths(projectRoot: string, projectId: string, oldAbs: string, newAbs: string) {
  await loadFile(projectRoot, projectId);
  const map = cache.get(projectId)!;
  const reverse = reverseCache.get(projectId) ?? {};

  const updated = {} as Record<string, string>;

  for (const [id, p] of Object.entries(map)) {
    if (p.startsWith(oldAbs)) {
      updated[id] = p.replace(oldAbs, newAbs);
    }
  }

  for (const [id, newPath] of Object.entries(updated)) {
    const oldPath = map[id];
    map[id] = newPath;
    if (oldPath) delete reverse[oldPath];
    reverse[newPath] = id;
  }
  reverseCache.set(projectId, reverse);

  await saveFileMap(projectRoot, projectId);
}

export async function getFileIdByAbsPath(projectRoot: string, projectId: string, absPath: string) {
  await loadFile(projectRoot, projectId);
  const reverse = reverseCache.get(projectId) ?? {};
  // If the absPath points to a folder (no extension) ensure it ends with a path separator ,because / is added while saving

  const hasExt = path.extname(absPath) !== "";
  if (!hasExt && !absPath.endsWith(path.sep)) {
    absPath = absPath + path.sep;
  }
  return reverse[absPath] || null;
  //folder will end with /,src/home/,src/index.ts
}
