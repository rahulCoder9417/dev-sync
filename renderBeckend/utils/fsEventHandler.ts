// fsEventHandlers.ts
import path from "path";

/**
 * Convert absolute path → project-relative path
 */
function toRelative(projectDir: string, absPath: string) {
  return path.relative(projectDir, absPath);
}

// ---------------- FILE CREATE ----------------

export function handleFileCreate(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  const relPath = toRelative(projectDir, absPath);

  console.log("[FS] file:create", relPath);

  // TODO:
  // 1. determine parentId from relPath
  // 2. create DB record (or notify main backend)
  // 3. broadcast to online clients
}

// ---------------- FOLDER CREATE ----------------

export function handleFolderCreate(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  const relPath = toRelative(projectDir, absPath);

  console.log("[FS] folder:create", relPath);
}

// ---------------- FILE UPDATE ----------------

export function handleFileUpdate(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  const relPath = toRelative(projectDir, absPath);

  console.log("[FS] file:update", relPath);
}

// ---------------- FILE DELETE ----------------

export function handleFileDelete(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  const relPath = toRelative(projectDir, absPath);

  console.log("[FS] file:delete", relPath);
}

// ---------------- FOLDER DELETE ----------------

export function handleFolderDelete(
  absPath: string,
  projectDir: string,
  projectId: string
) {
  const relPath = toRelative(projectDir, absPath);

  console.log("[FS] folder:delete", relPath);
}
