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

  watcher.on("add", (absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    handleFileCreate(absPath, projectDir, projectId);
  });

  watcher.on("addDir", (absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    handleFolderCreate(absPath, projectDir, projectId);
  });

  watcher.on("change", (absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    handleFileUpdate(absPath, projectDir, projectId);
  });

  watcher.on("unlink", (absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    handleFileDelete(absPath, projectDir, projectId);
  });

  watcher.on("unlinkDir", (absPath) => {
    if (Sup.isSuppressedOrParent(absPath)) return;
    handleFolderDelete(absPath, projectDir, projectId);
  });

  return watcher;
}
