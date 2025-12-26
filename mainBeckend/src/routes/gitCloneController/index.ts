import { Request, Response } from "express";
import { Octokit } from "@octokit/core";
import { unzipSync, strFromU8 } from "fflate";
import fetch from "node-fetch";

import { db } from "../../lib/db/db.js";
import {
  cleanupCloudinaryFiles,
  uploadToCloudinary,
  UploadedAsset,
} from "../../utils/cloudinary/cloudinary.js";
import { decrypt } from "../../utils/decrypt/decrypt.js";

// Constants
const FILE_EXTENSIONS = {
  IMAGE: ["png", "jpg", "jpeg", "gif", "webp"],
  VIDEO: ["mp4", "mov", "avi", "mkv", "webm"],
  AUDIO: ["mp3", "wav", "ogg"],
  DOCUMENT: ["pdf", "docx", "pptx", "xlsx"],
  BINARY: ["exe", "dll", "so", "bin", "zip", "rar", "tar", "7z"],
} as const;

const MAX_REPO_SIZE = 50 * 1024 * 1024; // 50MB
const FILE_UPLOAD_BATCH_SIZE = 10;

// Types
interface StreamData {
  step: number;
  status: "start" | "done" | "error";
  message: string;
  project?: string;
}

interface FileContent {
  path: string;
  content: string | null;
  type: string;
}

interface ProjectData {
  name: string;
  description?: string;
  type: string;
  packages: string;
}

interface TeamMember {
  userId: string;
  role?: string;
}

// Utility Functions
const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

const getResourceType = (
  ext: any
): "image" | "video" | "bin" | "raw" | null => {
  if (FILE_EXTENSIONS.IMAGE.includes(ext)) return "image";
  if (FILE_EXTENSIONS.VIDEO.includes(ext) || FILE_EXTENSIONS.AUDIO.includes(ext))
    return "video";
  if (FILE_EXTENSIONS.DOCUMENT.includes(ext)) return "raw";
  if (FILE_EXTENSIONS.BINARY.includes(ext)) return "bin";
  return null;
};

const isTextFile = (buffer: Uint8Array): boolean => {
  return !/\x00/.test(strFromU8(buffer));
};

const stripRootPrefix = (path: string): string => {
  const rootPrefix = path.split("/")[0] + "/";
  return path.startsWith(rootPrefix) ? path.slice(rootPrefix.length) : path;
};

// Stream Helper
class StreamHelper {
  constructor(private res: Response) {
    this.setupHeaders();
  }

  private setupHeaders() {
    this.res.setHeader("Content-Type", "text/event-stream");
    this.res.setHeader("Cache-Control", "no-cache");
    this.res.setHeader("Connection", "keep-alive");
  }

  send(data: StreamData) {
    this.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  end() {
    this.res.end();
  }
}

// Step Handlers
class GitCloneProcessor {
  private stream: StreamHelper;
  private uploadedAssets: UploadedAsset[] = [];
  private projectId?: string;
  private teamId?: string;

  constructor(private req: Request, private res: Response) {
    this.stream = new StreamHelper(res);
  }

  async process() {
    try {
      const validationResult = await this.validateAndPrepareData();
      if (!validationResult.success) return;

      const repoData = await this.fetchRepository(validationResult.data);
      if (!repoData.success) return;

      const dbResult = await this.createTeamAndProject(validationResult.data);
      if (!dbResult.success) return;

      const extractResult = await this.extractAndProcessFiles(
        repoData.zipData!,
        dbResult.projectId!
      );
      if (!extractResult.success) {
        await this.cleanupAfterError(dbResult.projectId, dbResult.teamId);
        return;
      }

      await this.uploadFilesToDatabase(
        extractResult.folders!,
        extractResult.files!,
        dbResult.projectId!
      );
    } catch (error) {
      this.stream.send({
        step: 0,
        status: "error",
        message: `Unexpected error: ${(error as Error).message}`,
      });
      this.stream.end();
    }
  }

  private async validateAndPrepareData() {
    this.stream.send({
      step: 1,
      status: "start",
      message: "Checking Incoming data",
    });

    try {
      const { userId, userAuth: encryptedAuth, ownerName, repoName, team, project, own } = this.req.body;

      // Decrypt auth token
      let userAuth: string;
      try {
        userAuth = decrypt(encryptedAuth?.toString() || "");
      } catch (e) {
        this.stream.send({
          step: 1,
          status: "error",
          message: "Invalid token",
        });
        this.stream.end();
        return { success: false };
      }

      // Validate required fields
      if (!userAuth || !ownerName || !repoName) {
        throw new Error("Missing GitHub auth token and git repo details");
      }

      const parsedTeam: TeamMember[] = JSON.parse(team?.toString() || "[]");
      const parsedProject: ProjectData = JSON.parse(project?.toString() || "{}");

      if (Object.keys(parsedProject).length < 4) {
        throw new Error("Missing project details");
      }

      // Get user from database
      const dbUser = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
        },
      });

      if (!dbUser) {
        this.stream.send({
          step: 1,
          status: "error",
          message: "User not found",
        });
        this.stream.end();
        return { success: false };
      }

      // Check ownership if required
      let isOwner = false;
      if (own === "true") {
        isOwner = await this.verifyRepoOwnership(userAuth, ownerName, repoName);
        if (!isOwner) {
          this.stream.send({
            step: 1,
            status: "error",
            message: "You are not the owner",
          });
          this.stream.end();
          return { success: false };
        }
      }

      this.stream.send({
        step: 1,
        status: "done",
        message: "Checked Incoming Data",
      });

      return {
        success: true,
        data: {
          userAuth,
          ownerName,
          repoName,
          team: parsedTeam,
          project: parsedProject,
          dbUser,
          isOwner,
        },
      };
    } catch (err) {
      this.stream.send({
        step: 1,
        status: "error",
        message: `Incoming Data error: ${(err as Error).message}`,
      });
      this.stream.end();
      return { success: false };
    }
  }

  private async verifyRepoOwnership(
    userAuth: string,
    ownerName: string,
    repoName: string
  ): Promise<boolean> {
    const octokit = new Octokit({ auth: userAuth });

    const [repo, user] = await Promise.all([
      octokit.request("GET /repos/{owner}/{repo}", {
        owner: ownerName,
        repo: repoName,
      }),
      octokit.request("GET /user"),
    ]);

    return repo.data.owner.login === user.data.login;
  }

  private async fetchRepository(data: any) {
    this.stream.send({
      step: 2,
      status: "start",
      message: "Looking For Repo",
    });

    try {
      const octokit = new Octokit({ auth: data.userAuth });
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/zipball",
        {
          owner: data.ownerName,
          repo: data.repoName,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      if (!response?.url) {
        throw new Error("GitHub repo not found or inaccessible");
      }

      const zipRes = await fetch(response.url);
      if (!zipRes.ok) {
        throw new Error("GitHub ZIP download failed");
      }

      const zipArrayBuffer = await zipRes.arrayBuffer();

      if (zipArrayBuffer.byteLength > MAX_REPO_SIZE) {
        throw new Error("Repo too large to process in-memory");
      }

      const zipData = new Uint8Array(zipArrayBuffer);

      this.stream.send({
        step: 2,
        status: "done",
        message: "Found Repo",
      });

      return { success: true, zipData };
    } catch (err) {
      this.stream.send({
        step: 2,
        status: "error",
        message: `Repo Finding Error: ${(err as Error).message}`,
      });
      this.stream.end();
      return { success: false };
    }
  }

  private async createTeamAndProject(data: any) {
    this.stream.send({
      step: 3,
      status: "start",
      message: "Project Making",
    });

    try {
      // Create team
      const teamRes = await db.team.create({
        data: {
          name: `${data.project.name} Team`,
          type: "PRIVATE",
          members: {
            create: [
              {
                user: { connect: { id: data.dbUser.id } },
                role: "ADMIN",
              },
              ...data.team.map((member: TeamMember) => ({
                user: { connect: { id: member.userId } },
                role: member.role || "MEMBER",
              })),
            ],
          },
        },
      });

      // Prepare project data
      const projectData: any = {
        name: data.project.name,
        gitRepo: `${data.ownerName}\\${data.repoName}`,
        description: data.project.description || "",
        type: data.project.type,
        packages: data.project.packages,
        ownerId: data.dbUser.id,
        teamId: teamRes.id,
      };

      if (data.isOwner) {
        projectData.isGitImport = true;
        projectData.gitKey = data.userAuth;
      }

      // Create project
      const projectRes = await db.project.create({
        data: projectData,
      });

      if (!projectRes) {
        await db.team.deleteMany({ where: { id: teamRes.id } });
        throw new Error("Project creation failed");
      }

      this.stream.send({
        step: 3,
        status: "done",
        message: "Project made",
      });

      return {
        success: true,
        projectId: projectRes.id,
        teamId: teamRes.id,
      };
    } catch (err) {
      this.stream.send({
        step: 3,
        status: "error",
        message: `Project Making error: ${(err as Error).message}`,
      });
      this.stream.end();
      return { success: false };
    }
  }

  private async extractAndProcessFiles(zipData: Uint8Array, projectId: string) {
    this.stream.send({
      step: 4,
      status: "start",
      message: "Checking Data in the repo",
    });

    try {
      const extractedFiles = unzipSync(zipData);
      const folders: FileContent[] = [];
      const files: FileContent[] = [];

      for (const path in extractedFiles) {
        const isFolder = path.endsWith("/");
        const filename = stripRootPrefix(path);

        if (isFolder) {
          if (filename === "") continue;
          folders.push({
            path: filename,
            type: "folder",
            content: null,
          });
          continue;
        }

        const fileResult = await this.processFile(
          path,
          filename,
          extractedFiles[path]!,
          projectId
        );
        files.push(fileResult);
      }

      this.stream.send({
        step: 4,
        status: "done",
        message: "Repo Processed Going To make project",
      });

      return { success: true, folders, files };
    } catch (err) {
      this.stream.send({
        step: 4,
        status: "error",
        message: `Repo Processing error: ${(err as Error).message}`,
      });
      this.stream.end();
      return { success: false };
    }
  }

  private async processFile(
    originalPath: string,
    filename: string,
    buffer: Uint8Array,
    projectId: string
  ): Promise<FileContent> {
    const ext = getFileExtension(originalPath);
    const resourceType = getResourceType(ext);

    if (resourceType) {
      // Handle media/document files
      if (!buffer || buffer.length === 0) {
        return {
          path: filename,
          type: "file",
          content: `Skipped empty file: ${filename}`,
        };
      }

      if (resourceType === "bin") {
        return {
          path: filename.replace(/\.[^/.]+$/, "") + ".txt",
          type: "file",
          content: `Skipped bin file: ${filename}`,
        };
      }

      const uploadRes = await uploadToCloudinary({
        buffer,
        filename,
        folder: "/projects/" + projectId,
        type: resourceType,
      });

      if (uploadRes.success) {
        this.uploadedAssets.push({
          public_id: uploadRes.public_id!,
          resource_type: resourceType,
        });
        return {
          path: filename,
          type: "file",
          content: uploadRes.secure_url!,
        };
      } else {
        return {
          path: filename.replace(/\.[^/.]+$/, "") + ".txt",
          type: "file",
          content: `Upload failed: ${uploadRes.error}`,
        };
      }
    } else {
      // Handle text files
      const isValid = isTextFile(buffer);
      return {
        path: isValid ? filename : filename.replace(/\.[^/.]+$/, "") + ".txt",
        type: "file",
        content: isValid
          ? strFromU8(buffer)
          : "Skipped because of binary data",
      };
    }
  }

  private async uploadFilesToDatabase(
    folders: FileContent[],
    files: FileContent[],
    projectId: string
  ) {
    this.stream.send({
      step: 5,
      status: "start",
      message: "Copying data",
    });

    try {
      const pathToIdMap = new Map<string, string>();

      // Sort folders by depth
      folders.sort(
        (a, b) => a.path.split("/").length - b.path.split("/").length
      );

      // Create folders
      for (const folder of folders) {
        const pathParts = folder.path.split("/").filter(Boolean);
        const name = pathParts[pathParts.length - 1] + "/";
        const parentPath =
          pathParts.slice(0, -1).length === 0
            ? null
            : pathParts.slice(0, -1).join("/") + "/";

        const fileItem = await db.fileItem.create({
          data: {
            type: "folder",
            name,
            content: "",
            projectId,
            parentId: parentPath ? pathToIdMap.get(parentPath)! : null,
          },
        });

        pathToIdMap.set(folder.path, fileItem.id);
      }

      // Upload files in batches
      for (let i = 0; i < files.length; i += FILE_UPLOAD_BATCH_SIZE) {
        const chunk = files.slice(i, i + FILE_UPLOAD_BATCH_SIZE);
        await Promise.all(
          chunk.map(async (file) => {
            let pathParts = [file.path];
            if (file.path.includes("/")) {
              pathParts = file.path.split("/").filter(Boolean);
            }

            const name = pathParts[pathParts.length - 1];
            const parentPath = pathParts.slice(0, -1).join("/") + "/";
            let parentId: string | null = null;

            if (parentPath !== "/") {
              parentId = pathToIdMap.get(parentPath) || null;
            }

            await db.fileItem.create({
              data: {
                type: file.type,
                name: name!,
                content: file.content || "",
                projectId,
                parentId: parentId!,
              },
            });
          })
        );
      }

      this.stream.send({
        step: 5,
        project: projectId,
        status: "done",
        message: "Copied Data",
      });

      this.stream.end();
    } catch (err) {
      await this.cleanupAfterError(projectId, this.teamId);
      this.stream.send({
        step: 5,
        status: "error",
        message: `Copying error: ${(err as Error).message}`,
      });
      this.stream.end();
    }
  }

  private async cleanupAfterError(projectId?: string, teamId?: string) {
    if (projectId) {
      await db.fileItem.deleteMany({ where: { projectId } });
      await db.project.delete({ where: { id: projectId } });
    }
    if (teamId) {
      await db.team.deleteMany({ where: { id: teamId } });
    }
    await cleanupCloudinaryFiles(this.uploadedAssets);
  }
}

// Main Controller
export async function gitCloneController(req: Request, res: Response) {
  const processor = new GitCloneProcessor(req, res);
  await processor.process();
}