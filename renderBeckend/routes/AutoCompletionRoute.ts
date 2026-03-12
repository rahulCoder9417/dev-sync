import { Request, Response } from "express";

export async function AutoCompletionRoute(req: Request, res: Response) {
  const {
    projectId,
    fileId,
    filePath,
    language,
    prefix,
    line,
    character,
    lineContent,
    currentContent,
  } = req.body;

  console.log("LSP request received:", {
    projectId,
    filePath,
    language,
    prefix,
    line,
    character,
  });

  res.json({ completions: [] });
}