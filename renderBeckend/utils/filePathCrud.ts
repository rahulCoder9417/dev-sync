import fs from "fs/promises";
import path from "path";
import { loadProjectIntoDisk } from "../controller/diskFileSave.js";

const cache = new Map<string, Record<string, string>>();

export async function loadFile(projectRoot: string, projectId: string) {
  if (cache.has(projectId)) return;
  await loadProjectIntoDisk(projectId, false);
  const mapPath = path.join(projectRoot, projectId, "fileMap.json");
  const raw = await fs.readFile(mapPath, "utf8");
  const fileMap = JSON.parse(raw);

  cache.set(projectId, fileMap);
}

export async function getFilePath(projectRoot: string, projectId: string, fileId: string) {
  await loadFile(projectRoot, projectId);
  console.log(cache.get(projectId)[fileId])
  return cache.get(projectId)?.[fileId] || null;
}

async function saveFileMap(projectRoot: string, projectId: string) {
  const map = cache.get(projectId);
  if (!map) return;

  const mapPath = path.join(projectRoot, projectId, "fileMap.json");
  await fs.writeFile(mapPath, JSON.stringify(map, null, 2), "utf8");
}

// CREATE
export async function setFilePath(projectRoot: string, projectId: string, fileId: string, absPath: string) {
  await loadFile(projectRoot, projectId);
  const map = cache.get(projectId)!;

  map[fileId] = absPath;

  await saveFileMap(projectRoot, projectId);
}

// DELETE
export async function deleteFilePath(projectRoot: string, projectId: string, fileId: string) {
  await loadFile(projectRoot, projectId);
  const map = cache.get(projectId)!;

  delete map[fileId];

  await saveFileMap(projectRoot, projectId);
}

// RENAME (file or folder)
export async function renameFilePaths(projectRoot: string, projectId: string, oldAbs: string, newAbs: string) {
  await loadFile(projectRoot, projectId);
  const map = cache.get(projectId)!;

  const updated = {} as Record<string, string>;

  for (const [id, p] of Object.entries(map)) {
    if (p.startsWith(oldAbs)) {
      updated[id] = p.replace(oldAbs, newAbs);
    }
  }

  for (const [id, newPath] of Object.entries(updated)) {
    map[id] = newPath;
  }

  await saveFileMap(projectRoot, projectId);
}
