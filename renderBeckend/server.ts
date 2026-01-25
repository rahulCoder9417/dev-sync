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

app.use("/preview/:userId/:port*", (req :any, res, next) => {
  const { userId, port } = req.params;
  const { token } = req.query as { token?: string };

  if (!token) return res.status(403).send("Missing token");
  if (!verifyPreviewToken(String(token), userId, port)) {
    return res.status(403).send("Invalid or expired preview token");
  }

  const prefix = `/preview/${userId}/${port}`;

  const proxy = createProxyMiddleware({
    target: `http://localhost:${port}`,
    changeOrigin: true,
    ws: true,

    // Strip the preview prefix so forwarded path is exactly what the dev server expects.
    pathRewrite: (path: string, req: any) => {
      // ensure we remove only the leading prefix
      const newPath = path.replace(new RegExp(`^${prefix}`), "") || "/";
      // ensure leading slash
      return newPath.startsWith("/") ? newPath : `/${newPath}`;
    },

    selfHandleResponse: true, // we only intercept HTML below

    onProxyReq(proxyReq, req, res) {
      // Helpful logging for debugging forwarded paths
      console.log(`[preview-proxy] -> ${proxyReq.method} ${proxyReq.path} -> http://localhost:${port}${proxyReq.path}`);
    },

    onProxyRes(proxyRes, req, res) {
      const contentType = (proxyRes.headers["content-type"] || "").toString();

      // Intercept only HTML to inject <base>
      if (contentType.includes("text/html")) {
        let body = "";
        proxyRes.on("data", (chunk) => (body += chunk.toString("utf8")));
        proxyRes.on("end", () => {
          // Inject base href so all relative imports/URLs resolve correctly under preview path.
          const baseTag = `<base href="${prefix}/">`;
          // Conservative injection: inject after <head> if present
          if (body.includes("<head")) {
            body = body.replace(/<head([^>]*)>/i, (m) => `${m}${baseTag}`);
          } else {
            body = baseTag + body;
          }

          // Preserve headers but ensure content-length matches new body
          const headers = { ...proxyRes.headers };
          delete headers["content-length"];
          res.writeHead(proxyRes.statusCode || 200, headers);
          res.end(body);
        });
      } else {
        // Pass through all other types (JS, CSS, images, HMR websockets via upgrade)
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
      }
    },

    onError(err, req, res) {
      console.error("[preview-proxy] error", err);
      res.statusCode = 502;
      res.end(`<h1>Proxy Error</h1><pre>${err.message}</pre>`);
    },
  });

  return proxy(req, res, next);
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