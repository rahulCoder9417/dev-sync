// WebSocket event schema (Main → Render)
// Only for one-way sync: UI → Main DB → WS → Render → Disk

export type RenderFileEvent =
  | {
    type: "file:move";
    projectId: string;
    moveNode: string;
    moveToNode: string | null;
  }
  | {
      type: "file:create";
      projectId: string;
      fileFolderId: string;
      isDir: boolean;
      parentId: string;
      fileName: string;
    }
  | {
      type: "file:update";
      projectId: string;
      fileFolderId: string;
      content: string;
    }
  | {
      type: "file:delete";
      projectId: string;
      fileFolderId: string;
    }
  | {
      type: "file:rename";
      projectId: string;
      fileFolderId: string;
      fileName: string;
    };

export type IncomingFileBroadcast = {
  type: "save";
  projectId: string;
  fileId: string;
  content: string;
}
|{
  type:"rename";
  projectId: string;
  fileId: string;
  fileName: string;
}
|{
  type:"delete";
  projectId: string;
  fileId: string;
  fileName: string;
}
|{
  type:"create";
  projectId: string;
  fileFolderId: string;
  parentId: string;
  fileName: string;
}
;

export function isIgnoredPath(relPath: string): boolean {
  const parts = relPath.split("/").filter(Boolean);
  // ignore if the first path segment is any of the ignored ones
  const IGNORED = new Set(["node_modules", "dist", "build", ".next", "out"]);
  if (parts.length === 0) return false;
  const first: string = parts[0]!;
  return IGNORED.has(first);
}
