import chokidar from "chokidar";
import path from "path";
import { ServiceResult } from "../types.js";

/**
 * File system event types
 */
export type FileSystemEventType = 
  | "file:create"
  | "file:update"
  | "file:delete"
  | "folder:create"
  | "folder:delete";

/**
 * File system event
 */
export interface FileSystemEvent {
  type: FileSystemEventType;
  projectId: string;
  absPath: string;
}

/**
 * Event handler callback
 */
export type FileSystemEventHandler = (event: FileSystemEvent) => Promise<void>;

/**
 * Watcher configuration
 */
interface WatcherConfig {
  projectId: string;
  projectDir: string;
  watcher: chokidar.FSWatcher;
  handlers: FileSystemEventHandler;
  suppressionTimeouts: Map<string, number>;
}

/**
 * Service for watching file system changes with proper lifecycle management
 */
export class FileWatcherService {
  private watchers = new Map<string, WatcherConfig>();
  
  // Ignored directories (configurable)
  private readonly IGNORED_PATTERNS = [
    "**/node_modules/**",
    "**/.git/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/out/**",
    "**/.cache/**",
    "**/coverage/**",
  ];

  // Time to suppress events after programmatic changes (ms)
  private readonly SUPPRESSION_TIME = 500;

  /**
   * Start watching a project directory
   */
  async startWatcher(
    projectId: string,
    projectDir: string,
    handler: FileSystemEventHandler
  ): Promise<ServiceResult<void>> {
    try {
      // Return existing watcher if already watching
      if (this.watchers.has(projectId)) {
        const config = this.watchers.get(projectId)!;
        config.handlers = handler;
        console.log(`♻️  Reusing existing watcher for project=${projectId}`);
        return { success: true };
      }

      console.log(`👀 Starting file watcher for project=${projectId} at ${projectDir}`);

      // Create chokidar watcher
      const watcher = chokidar.watch(projectDir, {
        ignoreInitial: true,
        persistent: true,
        depth: 99,
        ignored: this.IGNORED_PATTERNS,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 50,
        },
      });

      const config: WatcherConfig = {
        projectId,
        projectDir,
        watcher,
        handlers: handler,
        suppressionTimeouts: new Map(),
      };

      // Setup event listeners
      this.setupWatcherEvents(config);

      // Wait for watcher to be ready
      await new Promise<void>((resolve, reject) => {
        watcher.on("ready", () => {
          console.log(`✅ Watcher ready for project=${projectId}`);
          resolve();
        });

        watcher.on("error", (error) => {
          console.error(`❌ Watcher error for project=${projectId}:`, error);
          reject(error);
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error("Watcher initialization timeout"));
        }, 10000);
      });

      this.watchers.set(projectId, config);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "WATCHER_START_ERROR",
          message: `Failed to start watcher: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Setup event listeners for watcher
   */
  private setupWatcherEvents(config: WatcherConfig) {
    const { watcher, projectId } = config;

    watcher.on("add", async (absPath) => {
      await this.handleEvent(config, {
        type: "file:create",
        projectId,
        absPath: this.normalize(absPath),
      });
    });

    watcher.on("addDir", async (absPath) => {
      await this.handleEvent(config, {
        type: "folder:create",
        projectId,
        absPath: this.normalize(absPath),
      });
    });

    watcher.on("change", async (absPath) => {
      await this.handleEvent(config, {
        type: "file:update",
        projectId,
        absPath: this.normalize(absPath),
      });
    });

    watcher.on("unlink", async (absPath) => {
      await this.handleEvent(config, {
        type: "file:delete",
        projectId,
        absPath: this.normalize(absPath),
      });
    });

    watcher.on("unlinkDir", async (absPath) => {
      await this.handleEvent(config, {
        type: "folder:delete",
        projectId,
        absPath: this.normalize(absPath),
      });
    });

    watcher.on("error", (error) => {
      console.error(`❌ Watcher error for project=${projectId}:`, error.message);
    });
  }

  /**
   * Handle file system event
   */
  private async handleEvent(config: WatcherConfig, event: FileSystemEvent) {
    // Check if path is suppressed
    if (this.isPathSuppressed(config, event.absPath)) {
      return;
    }

await config.handlers(event).catch(error => {
  console.error(`❌ Handler error for ${event.type}:`, error);
})
  }
  
  private normalize(p: string) {
    return path.resolve(p);
  }

  /**
   * Suppress events for a path temporarily (used for programmatic changes)
   */
  suppressPath(projectId: string, absPath: string) {
    const config = this.watchers.get(projectId);
    if (!config) return;
    config.suppressionTimeouts.set(this.normalize(absPath), Date.now());
  }

  /**
   * Check if path or any parent is suppressed
   */
  private isPathSuppressed(config: WatcherConfig, absPath: string): boolean {


    const key = this.normalize(absPath);
    for (const [p, ts] of config.suppressionTimeouts.entries()) {
      if (Date.now() - ts > this.SUPPRESSION_TIME) {
        config.suppressionTimeouts.delete(p);
        continue;
      }

      if (key === p || key.startsWith(p + path.sep)) {
        return true;
      }
    }

    return false;
  }


  /**
   * Stop watcher for a project
   */
  async stopWatcher(projectId: string): Promise<ServiceResult<void>> {
    try {
      const config = this.watchers.get(projectId);
      if (!config) {
        return { success: true }; // Already stopped
      }

      console.log(`🛑 Stopping watcher for project=${projectId}`);

      // Clear all suppression timeouts
      for (const timeout of config.suppressionTimeouts.values()) {
        clearTimeout(timeout);
      }

      // Close watcher
      await config.watcher.close();

      // Remove from map
      this.watchers.delete(projectId);

      console.log(`✅ Watcher stopped for project=${projectId}`);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "WATCHER_STOP_ERROR",
          message: `Failed to stop watcher: ${error.message}`,
          details: error,
        },
      };
    }
  }

  /**
   * Check if project is being watched
   */
  isWatching(projectId: string): boolean {
    return this.watchers.has(projectId);
  }

  /**
   * Get watcher statistics
   */
  getStats() {
    const configs = Array.from(this.watchers.values());
    return {
      totalWatchers: configs.length,
      suppressedPaths: configs.reduce((sum, c) => sum + c.suppressionTimeouts.size, 0),
    };
  }

  /**
   * Cleanup all watchers
   */
  async cleanup(): Promise<void> {
    console.log("🧹 Cleaning up file watcher service...");

    const promises = Array.from(this.watchers.keys()).map(projectId =>
      this.stopWatcher(projectId)
    );

    await Promise.allSettled(promises);

    this.watchers.clear();

    console.log("✅ File watcher service cleanup complete");
  }
}

export default new FileWatcherService();