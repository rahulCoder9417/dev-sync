import fs from "fs/promises";
import path from "path";
import { loadFile } from "./filePathCrud.js";

export async function getRealProjectDir(baseDir, projectId) 
{
  let root;
  try {
     root = path.join(baseDir, projectId);
  } catch (error) {
    await loadFile(baseDir, projectId);
    root = path.join(baseDir, projectId);
  }

  const items = await fs.readdir(root, { withFileTypes: true });

  // the only folder = the project folder
  const folder = items.find((i) => i.isDirectory());

  if (!folder) throw new Error("Project folder not found");

  return path.join(root, folder.name);
}
