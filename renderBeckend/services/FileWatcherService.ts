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
  timestamp: Date;
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
  handlers: Set<FileSystemEventHandler>;
  suppressedPaths: Set<string>;
  suppressionTimeouts: Map<string, NodeJS.Timeout>;
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
        config.handlers.add(handler);
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
        handlers: new Set([handler]),
        suppressedPaths: new Set(),
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
        absPath,
        timestamp: new Date(),
      });
    });

    watcher.on("addDir", async (absPath) => {
      await this.handleEvent(config, {
        type: "folder:create",
        projectId,
        absPath,
        timestamp: new Date(),
      });
    });

    watcher.on("change", async (absPath) => {
      await this.handleEvent(config, {
        type: "file:update",
        projectId,
        absPath,
        timestamp: new Date(),
      });
    });

    watcher.on("unlink", async (absPath) => {
      await this.handleEvent(config, {
        type: "file:delete",
        projectId,
        absPath,
        timestamp: new Date(),
      });
    });

    watcher.on("unlinkDir", async (absPath) => {
      await this.handleEvent(config, {
        type: "folder:delete",
        projectId,
        absPath,
        timestamp: new Date(),
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
      console.log(`🔇 Suppressed: ${event.type} ${event.absPath}`);
      return;
    }

    console.log(`📡 FS Event: ${event.type} ${path.basename(event.absPath)}`);

    // Call all registered handlers
    const promises = Array.from(config.handlers).map(handler =>
      handler(event).catch(error => {
        console.error(`❌ Handler error for ${event.type}:`, error);
      })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Suppress events for a path temporarily (used for programmatic changes)
   */
  suppressPath(projectId: string, absPath: string) {
    const config = this.watchers.get(projectId);
    if (!config) return;

    // Add to suppressed set
    config.suppressedPaths.add(absPath);

    // Clear existing timeout
    const existing = config.suppressionTimeouts.get(absPath);
    if (existing) {
      clearTimeout(existing);
    }

    // Auto-remove after timeout
    const timeout = setTimeout(() => {
      config.suppressedPaths.delete(absPath);
      config.suppressionTimeouts.delete(absPath);
    }, this.SUPPRESSION_TIME);

    config.suppressionTimeouts.set(absPath, timeout);

    console.log(`🔇 Suppressing events for: ${absPath}`);
  }

  /**
   * Check if path or any parent is suppressed
   */
  private isPathSuppressed(config: WatcherConfig, absPath: string): boolean {
    // Check exact match
    if (config.suppressedPaths.has(absPath)) {
      return true;
    }

    // Check if any parent directory is suppressed
    let current = absPath;
    while (current !== path.dirname(current)) {
      current = path.dirname(current);
      if (config.suppressedPaths.has(current)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Add additional handler to existing watcher
   */
  addHandler(projectId: string, handler: FileSystemEventHandler): boolean {
    const config = this.watchers.get(projectId);
    if (!config) return false;

    config.handlers.add(handler);
    return true;
  }

  /**
   * Remove handler from watcher
   */
  removeHandler(projectId: string, handler: FileSystemEventHandler): boolean {
    const config = this.watchers.get(projectId);
    if (!config) return false;

    config.handlers.delete(handler);
    return true;
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
      totalHandlers: configs.reduce((sum, c) => sum + c.handlers.size, 0),
      suppressedPaths: configs.reduce((sum, c) => sum + c.suppressedPaths.size, 0),
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