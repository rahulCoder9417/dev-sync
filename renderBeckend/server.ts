import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import VNCSessionService from "./utils/VNC.js";
import { authenticatePreview, createPreviewProxy } from "./utils/previewPort.js";
import session from "express-session";
import { verifyPreviewToken } from "./utils/verifyToken.js";
import { createProxyMiddleware } from "http-proxy-middleware";

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
app.use("/preview/:userId/:port", (req, res, next) => {
  const { userId, port } = req.params;
  const { token } = req.query;

  if (!token) return res.status(403).send("Missing token");

  if (!verifyPreviewToken(token as string, userId, port)) {
    return res.status(403).send("Invalid token");
  }

  const basePath = `/preview/${userId}/${port}`;

  return createProxyMiddleware({
    target: `http://localhost:${port}`,
    changeOrigin: true,
    ws: true,

    pathRewrite: (path) =>
      path.replace(basePath, "") || "/",

    selfHandleResponse: true,

    onProxyRes(proxyRes, req, res) {
      const contentType = proxyRes.headers["content-type"] || "";

      // 🔥 ONLY intercept HTML
      if (contentType.includes("text/html")) {
        let body = "";

        proxyRes.on("data", chunk => body += chunk);
        proxyRes.on("end", () => {

          // ✅ THIS FIXES DEV SERVERS
          body = body.replace(
            "<head>",
            `<head><base href="${basePath}/">`
          );

          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          res.end(body);
        });
      } else {
        // Pass-through for JS, CSS, images, HMR, etc
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
      }
    },

    onError(err, req, res) {
      res.status(502).end("Preview proxy error");
    }
  })(req, res, next);
});



// WebSocket upgrade listener
server.on("upgrade", handleUpgrade);

// ✅ Use only ONE server
server.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📝 Session middleware: ENABLED`);
  console.log(`🔐 Preview routes available at: http://localhost:${config.port}/preview/:userId/:port`);
});

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down server gracefully...");

  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
    } else {
      console.log("HTTP server closed");
    }
  });

  try {
    console.log("All WebSocket handlers closed");
  } catch (err) {
    console.error("Error closing WebSocket handlers:", err);
  }

  setTimeout(() => process.exit(0), 2000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);