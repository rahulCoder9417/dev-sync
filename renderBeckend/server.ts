import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import VNCSessionService from "./utils/VNC.js";
import { authenticatePreview, createPreviewProxy } from "./utils/previewPort.js";
import session from "express-session";

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

// ⚠️ CRITICAL: Add session middleware BEFORE your routes
app.use(session({
  secret: config.proxy.previewSecret || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,//change to true in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'lax',
    path: '/'
  },
  proxy:true, //change to true in production
}));
// Add this BEFORE your preview route
app.get('/test-session', (req : any, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;
  
  req.session.save((err) => {
    if (err) {
      return res.json({ error: err.message });
    }
    
    res.json({
      message: 'Session test',
      sessionID: req.sessionID,
      views: req.session.views,
      sessionData: req.session,
      cookie: req.headers.cookie,
      sessionCookieHeader: res.getHeader('Set-Cookie')
    });
  });
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
app.use('/preview/:userId/:port', (req, res, next) => {
  const { userId, port } = req.params;
  
  console.log('\n📥 ========== PREVIEW REQUEST ==========');
  console.log(`📍 URL: ${req.originalUrl}`);
  console.log(`👤 User: ${userId}`);
  console.log(`🔌 Port: ${port}`);
  
  // First, authenticate the request
  authenticatePreview(req, res, (err) => {
    if (err) return next(err);
    
    // If authentication passed, proxy the request
    const proxy: any = createPreviewProxy(userId, port);
    proxy(req, res, next);
  });
});

// ❌ REMOVE THIS - Don't create a separate server!
// app.listen(4000, () => {
//   console.log('🚀 Preview server running on http://localhost:4000');
// });

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