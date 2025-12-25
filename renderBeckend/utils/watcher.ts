//@ts-ignore
import chokidar from "chokidar";
import path from "path";
import { Sup } from "./pathSuppressor.js";
import { handleFileCreate, handleFileDelete, handleFileUpdate, handleFolderCreate, handleFolderDelete } from "./fsEventHandler.js";

/**
 * One watcher per project
 */
const projectWatchers = new Map<string, chokidar.FSWatcher>();

export function ensureProjectWatcher(
  projectDir: string,
  projectId: string
) {
  if (projectWatchers.has(projectId)) {
    return projectWatchers.get(projectId)!;
  }

  const watcher = startFsWatcher(projectDir, projectId);
  projectWatchers.set(projectId, watcher);

  console.log(`👀 FS Watcher started for project=${projectId}`);
  return watcher;
}

/**
 * Stop watcher when project fully closes (optional)
 */
export function stopProjectWatcher(projectId: string) {
  const watcher = projectWatchers.get(projectId);
  if (watcher) {
    watcher.close();
    projectWatchers.delete(projectId);
    console.log(`🛑 FS Watcher stopped for project=${projectId}`);
  }
}

/**
 * Actual watcher logic
 */
function startFsWatcher(projectDir: string, projectId: string) {
  const watcher = chokidar.watch(projectDir, {
    ignoreInitial: true,
    persistent: true,
    depth: 99,
    ignored: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
    ],
  });
  watcher.on("add", async(absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFileCreate(absPath, projectId);
  });

  watcher.on("addDir", async(absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFolderCreate(absPath, projectId);
  });

  watcher.on("change", async(absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFileUpdate(absPath, projectId);
  });

  watcher.on("unlink", async(absPath) => {
    console.log("unlinking  file---",absPath)
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFileDelete(absPath, projectId);
  });

  watcher.on("unlinkDir", async(absPath) => {
    console.log("unlinking  folder---",absPath)
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFolderDelete(absPath, projectId);
  });

  return watcher;
}
