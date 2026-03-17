import { Request, Response } from "express";
import  AutoCompletionManager from "../utils/AutoCompletionManager.js";

export async function AutoCompletionRoute(req: Request, res: Response) {
 const {
    projectId,
    language,
  } = req.body;

  // step 1 — get or create LSP instance
  const lsp = await AutoCompletionManager.getOrCreate(projectId, language);
  
  // step 2 — wait until LSP is initialized
  await lsp.waitUntilReady();
  
  console.log("LSP ready for project:", projectId);

  res.json({ completions: [] });
}