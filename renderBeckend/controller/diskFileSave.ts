// terminalController.ts

import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { db } from "../lib/db/db.js";
import { Request, Response } from "express";

// Base directory where all projects will be stored
const PROJECTS_BASE_DIR = path.join(process.cwd(), "projects");

// Supported media file extensions
const SUPPORTED_EXTS = {
  images: ["png", "jpg", "jpeg", "gif", "webp"],
  videos: ["mp4", "mov", "webm"],
  audio: ["mp3", "wav", "ogg"],
  docs: ["pdf"],
};

/**
 * Check if file is a media file that needs downloading
 */
function isSupportedMediaFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return [
    ...SUPPORTED_EXTS.images,
    ...SUPPORTED_EXTS.videos,
    ...SUPPORTED_EXTS.audio,
    ...SUPPORTED_EXTS.docs,
  ].includes(ext);
}

/**
 * Download file from Cloudinary
 */
async function downloadFile(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

/**
 * Build file tree from flat array
 */
function buildFileTree(files: any[]): any[] {
  const map = new Map<string, any>();
  const roots: any[] = [];
  const folderRoots: any[] = [];

  for (const file of files) {
    map.set(file.id, { ...file, children: [] });
  }

  for (const file of files) {
    if (file.parentId) {
      const parent = map.get(file.parentId);
      if (parent) {
        const node = map.get(file.id);
        node.type === "folder"
          ? parent.children.unshift(node)
          : parent.children.push(node);
      }
    } else {
      const node = map.get(file.id);
      if (file.type === "folder") {
        folderRoots.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  return [...folderRoots, ...roots];
}

/**
 * Recursively create files and folders in directory
 */

async function createFileMap( files: any[],
    basePath: string,
    projectId: string): Promise<any> {

    const fileMap = {}
    async function createFileStructure(
        files: any[],
        basePath: string,
        currentPath: string = ""
      ): Promise<void> {
        for (const file of files) {
          const filePath = path.join(basePath, currentPath, file.name);
      
          if (file.type === "folder") {
            await fs.mkdir(filePath, { recursive: true });
            console.log(`✅ Created folder: ${filePath}`);
            fileMap[file.id] = filePath;
            if (file.children && file.children.length > 0) {
              await createFileStructure(
                file.children,
                basePath,
                path.join(currentPath, file.name)
              );
            }
          } else {
            if (isSupportedMediaFile(file.name) && file.content?.startsWith("http") && file.content.includes("res.cloudinary.com")
            ) {
              console.log(`⬇️  Downloading: ${file.name}`);
              const buffer = await downloadFile(file.content);
              await fs.writeFile(filePath, buffer);
              console.log(`✅ Downloaded file: ${filePath}`);
            } else {
              await fs.writeFile(filePath, file.content || "", "utf8");
              console.log(`✅ Created file: ${filePath}`);
            }
            fileMap[file.id] = filePath;
          }
        }
      
      }
    await createFileStructure(files, basePath, 
        ""
    );
    
    await fs.writeFile(path.join(PROJECTS_BASE_DIR, projectId, "fileMap.json"), JSON.stringify(fileMap));

}

export async function loadProjectIntoDisk(projectId: string,authCheck:boolean, userId?: string) {
  
  try {
      const items = await fs.readdir(path.join(PROJECTS_BASE_DIR, projectId), { withFileTypes: true });
    
      const folder = items.find((i) => i.isDirectory());
    
    return {
      status: "exists",
      projectDir: path.join(PROJECTS_BASE_DIR, projectId,folder?.name),
      projectName: folder.name,
    };
  } catch {
    // continue only if folder does NOT exist
  }
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      team: {
        select: {
          members: { select: { userId: true } }
        }
      },
      files: {
        select: {
          id: true,
          name: true,
          type: true,
          content: true,
          parentId: true,
        }
      }
    }
  });

  if (!project) throw new Error("Project not found.");

  if(authCheck){
    const isOwner = project.ownerId === userId;
    const isTeamMember = project.team?.members.some(m => m.userId === userId);

    if (!isOwner && !isTeamMember) {
      throw new Error("Unauthorized access.");
    }
  }

  const projectDir = path.join(PROJECTS_BASE_DIR, projectId, project.name);


  await fs.mkdir(projectDir, { recursive: true });

  const fileTree = buildFileTree(project.files);
  await createFileMap(fileTree, projectDir, projectId);

  return {
    status: "created",
    projectDir,
    projectName: project.name,
  };
}

   

/**
 * MAIN CONTROLLER WITH MIDDLEWARE
 */
export const initializeTerminalProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        ok: false,
        error: "projectId is required"
      });
    }

    const result = await loadProjectIntoDisk(projectId, true,userId);

    return res.json({
      ok: true,
      success: true,
      ...result
    });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({
      ok: false,
      error: e.message || "Failed to load project"
    });
  }
};
