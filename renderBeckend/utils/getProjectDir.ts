import fs from "fs/promises";
import path from "path";
import FilePathCrud from "./filePathCrud.js";

export async function getRealProjectDir(baseDir: string, projectId: string) 
{
  if(!projectId)return
  const root = path.join(baseDir, projectId);

  try {
    await fs.access(root);
  } catch (error) {
  const result =   await FilePathCrud.loadProject(projectId);
 
  if (!result.success) {
    throw new Error(`Failed to load project: ${result.error?.message}`);
  }
  }


  const items = await fs.readdir(root, { withFileTypes: true });

  const folder = items.find((i) => i.isDirectory());

  if (!folder) throw new Error("Project folder not found");

  return path.join(root, folder.name);
}
