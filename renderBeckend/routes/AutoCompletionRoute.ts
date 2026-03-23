import { Request, Response } from "express";
import { autoCompletionManager } from "../utils/AutoCompletionManager.js";
import path from "path";
import filePathCrud from "../utils/filePathCrud.js";
import { existsSync } from "fs";  // ← add this at top of file
import { getRealProjectDir } from "../utils/getProjectDir.js";
import config from "../config/index.js";


// map file extension → LSP languageId
// covers everything common, easy to add more
function getLanguageFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  const map: Record<string, string> = {
    ".ts":   "typescript",
    ".tsx":  "typescriptreact",
    ".js":   "javascript",
    ".jsx":  "javascriptreact",
    ".py":   "python",
    ".go":   "go",
    ".rs":   "rust",
    ".java": "java",
    ".cpp":  "cpp",
    ".c":    "c",
    ".cs":   "csharp",
    ".rb":   "ruby",
    ".php":  "php",
    ".html": "html",
    ".css":  "css",
    ".json": "json",
    ".md":   "markdown",
  };

  return map[ext] ?? "plaintext";
}
export async function AutoCompletionRoute(req: Request, res: Response) {
  const {
    projectId,
    fileId,
    line,        // already 0-indexed (frontend subtracted 1)
    character,   // already 0-indexed
    currentContent,
  } = req.body;

  try {
    // ── 1. get or create LSP instance ──
    // projectRoot is where your project files live inside the container
    const projectRoot = await getRealProjectDir(config.projectRoot, projectId);
    const filePath = await filePathCrud.getFilePath(projectId, fileId);
    const language = getLanguageFromPath(filePath);

    const lsp = await autoCompletionManager.getOrCreate(
      projectId,
      language,
      projectRoot
    );

    // ── 2. wait until LSP is initialized ──
    await lsp.waitUntilReady();

    // ── 3. build the file URI ──
    // LSP spec: URIs must be file:// format
    // e.g. file:///projects/proj-123/src/components/users.tsx
    const uri = "file://" + filePath.replace(/\\/g, "/");

    // ── 4. sync current file content to LSP ──
    // sends didOpen (first time) or didChange (already open)
    // currentContent = full file from model.getValue() — includes unsaved changes
    await lsp.syncFile(uri, language, currentContent);

    // ── 5. get completions at cursor position ──
    const items = await lsp.getCompletions(uri, { line, character });

    // ── 6. return to frontend ──
    res.json({
      completions: items.map((item) => ({
        label:      item.label,
        kind:       item.kind ?? 1,
        detail:     item.detail ?? "",
        insertText: item.insertText ?? item.label,
      })),
    });

  } catch (err) {
    console.error("[LSP Route] error:", err);
    res.status(500).json({ completions: [] });
  }
}