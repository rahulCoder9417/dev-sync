// WebSocket event schema (Main → Render)
// Only for one-way sync: UI → Main DB → WS → Render → Disk

export type RenderFileEvent =
  | {
      type: "file:create";
      projectId: string;
      projectName: string; // for resolving folder name on disk
      path: string; // relative to project root (e.g. src/index.ts)
      isDir?: boolean;
      content?: string; // empty or undefined for folder
    }
  | {
      type: "file:update";
      projectId: string;
      projectName: string;
      path: string; // relative path
      content: string; // full content to write
    }
  | {
      type: "file:delete";
      projectId: string;
      projectName: string;
      path: string; // relative path (file or directory)
    }
  | {
      type: "file:rename";
      projectId: string;
      projectName: string;
      from: string; // relative path
      to: string; // relative path
    };

export function isIgnoredPath(relPath: string): boolean {
  const parts = relPath.split("/").filter(Boolean);
  // ignore if the first path segment is any of the ignored ones
  const IGNORED = new Set(["node_modules", "dist", "build", ".next", "out"]);
  if (parts.length === 0) return false;
  const first: string = parts[0]!;
  return IGNORED.has(first);
}
