import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import { setupPreviewProxy } from "./middleware/previewProxy.js";
import { setupAssetRedirect } from "./middleware/assetRedirect.js";
import vncService from "./services/VNCSessionService.js";
import sessionManager from "./services/SessionManager.js";
import fileSystemService from "./services/FileSystemService.js";
import fileWatcherService from "./services/FileWatcherService.js";
import terminalWSHandler from "./ws/TerminalWSHandler.js";
import vncWSHandler from "./ws/VNCWSHandler.js";
import fileSyncWSHandler from "./ws/FileSyncWSHandler.js";

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: config.cors.credentials,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy if behind reverse proxy (for Render, etc.)
app.set("trust proxy", true);

// Asset redirect middleware (fixes asset loading in preview)
setupAssetRedirect(app);

// ==================== ROUTES ====================

// Health check
app.get("/health", (req, res) => {
  const stats = sessionManager.getStats();
  res.json({
    ok: true,
    uptime: process.uptime(),
    sessions: stats,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", router);

// Static file serving for projects
app.use("/projects", express.static(config.projectRoot));

// Serve noVNC static files
app.use("/novnc", express.static(config.novncPath));

// GUI access endpoint - redirects to noVNC interface
app.get("/gui/:userId", (req, res) => {
  const { userId } = req.params;
  
  // Ensure GUI session exists (will be created if needed when terminal connects)
  const session = sessionManager.getSession(userId);
  if (!session || !session.gui) {
    return res.status(404).send("No GUI session found. Please connect a terminal first.");
  }

  const encodedUser = encodeURIComponent(userId);
  const url = `/novnc/vnc.html?path=websockify/${encodedUser}&autoconnect=true&resize=scale`;
  
  res.redirect(url);
});

// Preview proxy (secure reverse proxy for production builds)
setupPreviewProxy(app);

// ==================== WEBSOCKET ====================

// WebSocket upgrade handler
server.on("upgrade", handleUpgrade);

// ==================== SERVER LIFECYCLE ====================

// Start server
server.listen(config.port, () => {
  console.log("🚀 ============================================");
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`🚀 Project root: ${config.projectRoot}`);
  console.log(`🚀 NoVNC path: ${config.novncPath}`);
  console.log(`🚀 GUI base display: :${config.gui.baseDisplay}`);
  console.log(`🚀 GUI base VNC port: ${config.gui.baseVncPort}`);
  console.log("🚀 ============================================");
});

// Graceful shutdown handler
async function shutdown() {
  console.log("\n🛑 ============================================");
  console.log("🛑 Shutting down server gracefully...");
  console.log("🛑 ============================================");

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error("❌ Error closing HTTP server:", err);
    } else {
      console.log("✅ HTTP server closed");
    }
  });

  try {
    // Close WebSocket handlers
    console.log("🧹 Closing WebSocket handlers...");
    terminalWSHandler.close();
    vncWSHandler.close();
    fileSyncWSHandler.close();
    console.log("✅ WebSocket handlers closed");

    // Cleanup file system services
    console.log("🧹 Cleaning up file system services...");
    await fileWatcherService.cleanup();
    await fileSystemService.cleanup();
    console.log("✅ File system services cleaned up");

    // Cleanup all user sessions (kills PTY processes)
    console.log("🧹 Cleaning up user sessions...");
    const sessionResult = await sessionManager.cleanupAll();
    console.log(`✅ Cleaned up ${sessionResult.processesKilled} terminal processes`);
    if (sessionResult.errors.length > 0) {
      console.error(`⚠️  ${sessionResult.errors.length} errors during session cleanup`);
    }

    // Cleanup all GUI sessions (kills Xvfb/VNC processes)
    console.log("🧹 Cleaning up GUI sessions...");
    const guiResult = await vncService.cleanupAll();
    console.log(`✅ Cleaned up ${guiResult.processesKilled} GUI processes`);
    if (guiResult.errors.length > 0) {
      console.error(`⚠️  ${guiResult.errors.length} errors during GUI cleanup`);
    }

    console.log("✅ Graceful shutdown complete");
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
  }

  // Force exit after timeout
  setTimeout(() => {
    console.log("⏱️  Shutdown timeout reached, forcing exit...");
    process.exit(0);
  }, 5000);
}

// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  shutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  shutdown();
});