// server-ws-split.ts
// This is a temporary file for testing the WebSocket server split

import express from "express";
import http from "http";
import { parse } from 'url';
import config from "./src/config";
import router from "./src/routes";
import cors from "cors";
import { UserMeta } from "./types";
import { getAuthData } from "./src/auth";
import { FileWsHandler } from "./src/websocket/fileWsHandler";
import { ChatWsHandler } from "./src/websocket/chatWsHandler";

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

// API routes
app.use("/api", router);

// Initialize WebSocket handlers
const fileWsHandler = new FileWsHandler();
const chatWsHandler = new ChatWsHandler();
export {fileWsHandler}
// WebSocket upgrade handler
server.on('upgrade', async (request, socket, head) => {
  // Parse URL to determine the WebSocket path
  const { pathname } = parse(request.url || '');
  
  // Extract token from URL query parameters
  const token = new URL(request.url || '', `http://${request.headers.host}`).searchParams.get('token');
  
  if (!token) {
    console.error("No token provided");
    socket.destroy();
    return;
  }

  try {
    // Verify token
    const claims = await getAuthData(token);
    if (!claims) {
      throw new Error("Invalid token");
    }

    // Route to the appropriate WebSocket handler based on the path
    if (pathname === '/ws/file') {
      fileWsHandler.handleUpgrade(request, socket, head, claims as UserMeta);
    } else if (pathname === '/ws/chat') {
      chatWsHandler.handleUpgrade(request, socket, head, claims as UserMeta);
    } else {
      console.error(`Unknown WebSocket path: ${pathname}`);
      socket.destroy();
    }
  } catch (err) {
    console.error("WebSocket upgrade error:", err);
    socket.destroy();
  }
});

// Start the server
const PORT = config.port ? parseInt(config.port.toString())  : 8000; 
server.listen(PORT, () => {
  console.log(`Split WebSocket server listening on http://localhost:${PORT}`);
  console.log(`WebSocket endpoints:`);
  console.log(`- File operations: ws://localhost:${PORT}/ws/file`);
  console.log(`- Chat: ws://localhost:${PORT}/ws/chat`);
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
    await Promise.all([
      fileWsHandler.close(),
      chatWsHandler.close()
    ]);
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
