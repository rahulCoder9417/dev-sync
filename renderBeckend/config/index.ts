import { ServerConfig } from "../types.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
/**
 * Centralized configuration with validation and defaults
 */
class Config {
  private config: ServerConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validate();
  }

  private loadConfig(): ServerConfig {
    // Resolution presets for different use cases
    const resolutionPresets = {
      high: "1920x1080x24",    // Full HD - Best quality, slower
      medium: "1280x720x24",   // 720p - Good balance (RECOMMENDED)
      low: "1024x768x16",      // XGA - Faster, lower quality
      minimal: "800x600x16",   // SVGA - Fastest, minimal quality
    };

    const resolutionMode = process.env.VNC_RESOLUTION_MODE || "medium";
    const customResolution = process.env.XVFB_RESOLUTION;

    return {
      port: parseInt(process.env.PORT || "3002", 10),
      projectRoot: process.env.PROJECT_ROOT || "/usr/src/app/projects",
      novncPath: process.env.NOVNC_PATH || "/usr/share/novnc",
      isGarib: process.env.IS_GARIB==="true",
      cors: {
        origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
        credentials: true,
      },

      gui: {
        baseDisplay: parseInt(process.env.GUI_BASE_DISPLAY || "100", 10),
        baseVncPort: parseInt(process.env.GUI_BASE_VNC_PORT || "5900", 10),
        xvfbResolution: customResolution || resolutionPresets[resolutionMode] || resolutionPresets.medium,
        xvfbDepth: 24,
        startupTimeout: parseInt(process.env.GUI_STARTUP_TIMEOUT || "5000", 10),
        windowManager: (process.env.WINDOW_MANAGER || "fluxbox") as any,
      },

      terminal: {
        shell: process.env.TERMINAL_SHELL || "bash",
        defaultCols: parseInt(process.env.TERMINAL_COLS || "80", 10),
        defaultRows: parseInt(process.env.TERMINAL_ROWS || "25", 10),
        heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL || "30000", 10),
      },

      proxy: {
        previewSecret: process.env.PREVIEW_SECRET || "supersecret",
        tokenExpiry: parseInt(process.env.PREVIEW_TOKEN_EXPIRY || "86400", 10), // 24h
      },
    };
  }

  private validate() {
    const { port, gui, terminal, proxy } = this.config;

    if (port < 1024 || port > 65535) {
      throw new Error(`Invalid port: ${port}. Must be between 1024-65535`);
    }

    if (gui.baseDisplay < 0 || gui.baseDisplay > 999) {
      throw new Error(`Invalid GUI_BASE_DISPLAY: ${gui.baseDisplay}`);
    }

    if (gui.baseVncPort < 5900 || gui.baseVncPort > 65535) {
      throw new Error(`Invalid GUI_BASE_VNC_PORT: ${gui.baseVncPort}`);
    }

    if (terminal.heartbeatInterval < 1000) {
      throw new Error("HEARTBEAT_INTERVAL must be at least 1000ms");
    }

    if (!proxy.previewSecret || proxy.previewSecret === "supersecret") {
      console.warn("⚠️  WARNING: Using default PREVIEW_SECRET. Set a secure value in production!");
    }
  }

  // Getters for clean access
  get port() { return this.config.port; }
  get projectRoot() { return this.config.projectRoot; }
  get novncPath() { return this.config.novncPath; }
  get cors() { return this.config.cors; }
  get gui() { return this.config.gui; }
  get terminal() { return this.config.terminal; }
  get proxy() { return this.config.proxy; }
  get isGarib() { return this.config.isGarib; }
  // Full config for special cases
  getAll(): Readonly<ServerConfig> {
    return Object.freeze({ ...this.config });
  }
}

// Singleton instance
export default new Config();