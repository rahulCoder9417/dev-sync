import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import { verifyPreviewToken } from "./utils/verifyToken.js";
//@ts-ignore
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import type { IncomingMessage, ServerResponse } from "http";

import guu from "./ws/terminalHandler.js";
import  VNCSessionService  from "./utils/VNC.js";
import { authenticatePreview, createPreviewProxy } from "./utils/previewPort.js";
const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// ==================================================================================
//  REFRER use karke asset ke userId port milgya
// ==================================================================================
app.use((req, res, next) => {
  const url = req.path; // e.g. /vite.svg
  const referer = req.get("referer");

  // Ignore if no referer or request is already inside preview route
  const previewPattern = /^\/preview\/[^/]+\/\d+\//;
  if (!referer || previewPattern.test(url)) {
    return next();
  }

  // Detect assets
  const isAsset = /\.(png|jpe?g|gif|svg|ico|webp|avif|css|map|js|woff2?|ttf|otf)$/i.test(url);
  if (!isAsset) return next();

  // Extract preview info from referer
  const match = referer.match(/\/preview\/([^/]+)\/(\d+)\?token=([^&]+)/);
  if (!match) return next();

  const [, userId, port, token] = match;

  // Rewrite only once
  const rewritten = `/preview/${userId}/${port}${url}?token=${token}`;

  return res.redirect(rewritten);
});


// API routes
app.use("/api", router);

// health route
app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.use("/projects", express.static("/usr/src/app/projects"));

// ---- SERVE noVNC STATIC FILES ----
app.use("/novnc", express.static("/usr/share/novnc"));

// ---- /gui/:userId → redirects into noVNC with proper WS path ----
app.get("/gui/:userId", async (req, res) => {
  const { userId } = req.params;
  const gui = await VNCSessionService.ensureSession(userId);
  const encodedUser = encodeURIComponent(userId);
  const url = `/novnc/vnc.html?path=websockify/${encodedUser}&autoconnect=true&resize=scale`;
  res.redirect(url);
});

// ---- SECURE REVERSE PROXY (PRODUCTION BUILD PREVIEW) ----
app.use('/preview/:userId/:port*', (req, res, next) => {
  const { userId, port } = req.params;
  
  // First, authenticate the request
  authenticatePreview(req, res, (err) => {
    if (err) return next(err);
    
    // If authentication passed, proxy the request
    const proxy : any= createPreviewProxy(userId, port);
    proxy(req, res, next);
  });
});

app.listen(4000, () => {
  console.log('🚀 Preview server running on http://localhost:4000');
});

// WebSocket upgrade listener
server.on("upgrade", handleUpgrade);

server.listen(config.port, () => {
  console.log("Server running on port", config.port);
});


// Graceful shutdown
async function shutdown() {
  console.log("Shutting down split WebSocket server gracefully...");

  // Close the HTTP server
  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
    } else {
      console.log("HTTP server closed");
    }
  });

  // Close WebSocket handlers
  try {
    // await close(); // Uncomment if you have a close function
    console.log("All WebSocket handlers closed");
  } catch (err) {
    console.error("Error closing WebSocket handlers:", err);
  }

  // Force exit after a timeout if needed
  setTimeout(() => process.exit(0), 2000);
}

// Handle process termination
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);