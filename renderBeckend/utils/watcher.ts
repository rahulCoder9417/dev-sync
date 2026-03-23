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
    awaitWriteFinish: {
      stabilityThreshold: 200, // wait 200ms of no changes
      pollInterval: 100,
    },
    ignored:(path) => {
    return (
      path.includes("node_modules") ||
      path.includes(".git") ||
      path.includes(".next") ||
      path.includes("dist") ||
      path.includes("build") 
    );
  },
  });
  watcher.on("add", async(absPath) => {
    try {
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFileCreate(absPath, projectId);
    
  } catch (err: any) {
    if (err.code === "ENOENT") return; 
    console.error("add error:", err);
  }
  });

  watcher.on("addDir", async(absPath) => {
    try {
    
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFolderCreate(absPath, projectId);
  } catch (err: any) {
    if (err.code === "ENOENT") return; 
    console.error("add error:", err);
  }
  });

  watcher.on("change", async(absPath) => {
    try {
    
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFileUpdate(absPath, projectId);
  } catch (err: any) {
    if (err.code === "ENOENT") return; 
    console.error("add error:", err);
  }
  });

  watcher.on("unlink", async(absPath) => {
    try {
    
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFileDelete(absPath, projectId);
  } catch (err: any) {
    if (err.code === "ENOENT") return; 
    console.error("add error:", err);
  }
  });

  watcher.on("unlinkDir", async(absPath) => {
    try {
    if (Sup.isSuppressedOrParent(absPath)) return;
    await handleFolderDelete(absPath, projectId);
    
  } catch (err: any) {
    if (err.code === "ENOENT") return; 
    console.error("add error:", err);
  }
  });

  return watcher;
}
