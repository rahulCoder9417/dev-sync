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



/**
 * MAIN CONTROLLER WITH MIDDLEWARE
 */
export const initializeTerminalProject = async (req: Request, res: Response) => {
  try {
  
    console.log(req.body);
    // STEP 1: Extract projectId from body
    const { projectId ,userId} = req.body;

    // STEP 2: Validate projectId
    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({
        ok: false,
        error: "projectId is required and must be a string",
      });
    }
      // STEP 3: Check if project directory already exists
      try {
        await fs.access(path.join(PROJECTS_BASE_DIR, projectId));
        return res.json({
          ok: true,
          success: true,
          message: "Project directory already exists",
          projectPath: path.join(PROJECTS_BASE_DIR, projectId),
          status: "exists",
        });
      } catch {
        // Directory doesn't exist, continue
      }

    // STEP 4: Fetch project from database
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        team: {
          select: {
            members: {
              select: {
                userId: true,
              },
            },
          },
        },
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            content: true,
            parentId: true,
          },
        },
      },
    });

    // STEP 5: Check if project exists
    if (!project) {
      return res.status(404).json({
        ok: false,
        error: "Project not found",
      });
    }

    // STEP 6: Check authorization (owner or team member)
    const isOwner = project.ownerId ===userId;
    const teamMembers = project.team?.members ?? [];
    const isTeamMember = teamMembers.some((m) => m.userId === userId);

    if (!isOwner && !isTeamMember) {
      return res.status(403).json({
        ok: false,
        error: "You don't have access to this project",
      });
    }

    // STEP 7: Define project directory path
    const projectDir = path.join(PROJECTS_BASE_DIR, projectId,project.name);



    // STEP 8: Create project directory
    await fs.mkdir(projectDir, { recursive: true });
    console.log(`📁 Created project directory: ${projectDir}`);

    // STEP 9: Build file tree
    const fileTree = buildFileTree(project.files);

    // STEP 10: Create all files and folders
    await createFileMap(fileTree, projectDir,projectId);

    // STEP 11: Return success response
    const mapData = await fs.readFile(
        path.join(PROJECTS_BASE_DIR,projectId, "fileMap.json"),
        "utf8"
      );
      
    res.json({
      ok: true,
      success: true,
      message: "Project directory created successfully",
      projectPath: projectDir,
      projectName: project.name,
      map:mapData,
      totalFiles: project.files.length,
      status: "created",
    });
  } catch (error: any) {
    console.error("Error initializing terminal project:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to initialize project",
      details: error.message,
    });
  }
};