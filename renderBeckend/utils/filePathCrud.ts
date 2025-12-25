import fs from "fs/promises";
import path from "path";
import { ServiceResult } from "../types.js";
import config from "../config/index.js";
import { loadProjectIntoDisk } from "../controller/diskFileSave.js";
import { getRealProjectDir } from "../utils/getProjectDir.js";

/**
 * File metadata for tracking
 */
export interface FileMetadata {
  fileFolderId: string;
  absPath: string;
  isDir: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project file map cache
 */
interface ProjectFileMap {
  projectId: string;
  fileMap: Record<string, string>; // fileId -> absPath
  reverseMap: Record<string, string>; // absPath -> fileId
  lastLoaded: Date;
  dirty: boolean; // Needs to be saved
}

/**
 * Service for file system operations with proper caching and error handling
 */
export class FileSystemService {
  private cache = new Map<string, ProjectFileMap>();
  private saveQueue = new Map<string, NodeJS.Timeout>();
  
  // Debounce time for saving fileMap (avoid excessive writes)
  private readonly SAVE_DEBOUNCE_MS = 10000;

  /**
   * Load project file map into cache
   */
  async loadProject(projectId: string): Promise<ServiceResult<void>> {
    try {
      // Return if already loaded
      if (this.cache.has(projectId)) {
        return { success: true };
      }

      await loadProjectIntoDisk(projectId, false);
      const mapPath = path.join(config.projectRoot, projectId, "fileMap.json");
      
      // Load existing map
      const raw = await fs.readFile(mapPath, "utf8");
      const fileMap = JSON.parse(raw);

      // Build reverse map
      const reverseMap = Object.fromEntries(
        Object.entries(fileMap).map(([fileId, absPath]) => [absPath as string, fileId])
      );

      const projectMap: ProjectFileMap = {
        projectId,
        fileMap,
        reverseMap,
        lastLoaded: new Date(),
        dirty: false,
      };

      this.cache.set(projectId, projectMap);
      console.log(`✅ Loaded fileMap for project=${projectId} (${Object.keys(fileMap).length} entries)`);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "LOAD_PROJECT_ERROR",
          message: `Failed to load project ${projectId}: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Get absolute path for a file/folder ID
   */
  async getFilePath(projectId: string, fileId: string | null): Promise<string | null> {
    await this.loadProject(projectId);

    // Root directory case
    if (!fileId) {
      
    return await getRealProjectDir(config.projectRoot, projectId);
    }

    const projectMap = this.cache.get(projectId);
    return projectMap?.fileMap[fileId] || null;
  }

  /**
   * Get file ID by absolute path
   */
  async getFileIdByPath(projectId: string, absPath: string): Promise<string | null> {
    await this.loadProject(projectId);

    const projectMap = this.cache.get(projectId);
    if (!projectMap) return null;
    // Normalize folder paths (ensure trailing separator)
    const hasExt = path.extname(absPath) !== "";
    if (!hasExt && !absPath.endsWith(path.sep)) {
      absPath = absPath + path.sep;
    }

    return projectMap.reverseMap[absPath] || null;
  }

  /**
   * Set file path mapping (CREATE)
   */
  async setFilePath(
    projectId: string,
    fileId: string,
    absPath: string
  ): Promise<ServiceResult<void>> {
    try {
      await this.loadProject(projectId);

      const projectMap = this.cache.get(projectId);
      if (!projectMap) {
        throw new Error("Project map not loaded");
      }

      // Update maps
      projectMap.fileMap[fileId] = absPath;
      projectMap.reverseMap[absPath] = fileId;
      projectMap.dirty = true;

      // Debounced save
      this.scheduleSave(projectId);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "SET_FILE_PATH_ERROR",
          message: `Failed to set file path: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Delete file path mapping (DELETE)
   */
  async deleteFilePath(projectId: string, fileId: string): Promise<ServiceResult<void>> {
    try {
      await this.loadProject(projectId);

      const projectMap = this.cache.get(projectId);
      if (!projectMap) {
        throw new Error("Project map not loaded");
      }

      const oldPath = projectMap.fileMap[fileId];

      // Remove from both maps
      delete projectMap.fileMap[fileId];
      if (oldPath) {
        delete projectMap.reverseMap[oldPath];
      }

      projectMap.dirty = true;
      this.scheduleSave(projectId);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "DELETE_FILE_PATH_ERROR",
          message: `Failed to delete file path: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Rename file/folder and update all child paths (RENAME)
   */
  async renameFilePath(
    projectId: string,
    oldAbs: string,
    newAbs: string
  ): Promise<ServiceResult<void>> {
    try {
      await this.loadProject(projectId);

      const projectMap = this.cache.get(projectId);
      if (!projectMap) {
        throw new Error("Project map not loaded");
      }

      const updated: Record<string, string> = {};

      // Find all paths that start with oldAbs (handles folders)
      for (const [id, p] of Object.entries(projectMap.fileMap)) {
        if (p.startsWith(oldAbs)) {
          updated[id] = p.replace(oldAbs, newAbs);
        }
      }

      // Update both maps
      for (const [id, newPath] of Object.entries(updated)) {
        const oldPath = projectMap.fileMap[id];
        projectMap.fileMap[id] = newPath;

        if (oldPath) {
          delete projectMap.reverseMap[oldPath];
        }
        projectMap.reverseMap[newPath] = id;
      }

      projectMap.dirty = true;
      this.scheduleSave(projectId);

      console.log(`📝 Renamed ${Object.keys(updated).length} paths from ${oldAbs} to ${newAbs}`);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "RENAME_FILE_PATH_ERROR",
          message: `Failed to rename file path: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Schedule debounced save of project map
   */
  private scheduleSave(projectId: string) {
    // Clear existing timeout
    const existing = this.saveQueue.get(projectId);
    if (existing) {
      clearTimeout(existing);
    }

    // Schedule new save
    const timeout = setTimeout(async () => {
      await this.saveProjectMap(projectId);
      this.saveQueue.delete(projectId);
    }, this.SAVE_DEBOUNCE_MS);

    this.saveQueue.set(projectId, timeout);
  }

  /**
   * Save project map to disk
   */
  private async saveProjectMap(projectId: string): Promise<void> {
    const projectMap = this.cache.get(projectId);
    if (!projectMap) return;

    try {
      const mapPath = path.join(config.projectRoot, projectId, "fileMap.json");
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(mapPath), { recursive: true });

      // Save only the fileMap (not reverse map)
      await fs.writeFile(
        mapPath,
        JSON.stringify(projectMap.fileMap, null, 2),
        "utf8"
      );

      projectMap.dirty = false;
      console.log(`💾 Saved fileMap for project=${projectId}`);
    } catch (error) {
      console.error(`❌ Failed to save fileMap for project=${projectId}:`, error);
    }
  }

  /**
   * Force immediate save (used during shutdown)
   */
  async forceSave(projectId: string): Promise<void> {
    const timeout = this.saveQueue.get(projectId);
    if (timeout) {
      clearTimeout(timeout);
      this.saveQueue.delete(projectId);
    }
    await this.saveProjectMap(projectId);
  }

  /**
   * Unload project from cache (cleanup)
   */
  async unloadProject(projectId: string): Promise<void> {
    // Save before unloading
    await this.forceSave(projectId);
    
    this.cache.delete(projectId);
    console.log(`🧹 Unloaded project=${projectId} from cache`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const projects = Array.from(this.cache.values());
    return {
      totalProjects: projects.length,
      totalFiles: projects.reduce((sum, p) => sum + Object.keys(p.fileMap).length, 0),
      dirtyProjects: projects.filter(p => p.dirty).length,
      pendingSaves: this.saveQueue.size,
    };
  }

  /**
   * Cleanup all cached projects
   */
  async cleanup(): Promise<void> {
    console.log("🧹 Cleaning up file system service...");

    // Force save all dirty projects
    const savePromises = Array.from(this.cache.keys()).map(projectId =>
      this.forceSave(projectId)
    );

    await Promise.all(savePromises);

    // Clear caches
    this.cache.clear();
    this.saveQueue.clear();

    console.log("✅ File system service cleanup complete");
  }
}

export default new FileSystemService();