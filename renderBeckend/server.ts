import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter";
import config from "./config/index";
import router from "./routes/index";
import { close } from "./ws/terminalHandler";

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

// health route
app.get("/health", (req, res) => {
  res.json({ ok: true });
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
    await close();
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
