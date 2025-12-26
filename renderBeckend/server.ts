import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import { verifyPreviewToken } from "./utils/verifyToken.js";
//@ts-ignore
import { createProxyMiddleware } from "http-proxy-middleware";
import type { IncomingMessage, ServerResponse } from "http";

import guu from "./ws/terminalHandler.js";
import  VNCSessionService  from "./utils/VNC.js";
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
app.use("/preview/:userId/:port*", (req, res, next) => {
  if(!req.params){
    return res.status(403).send("Missing params");
  }
  const { userId, port } = req.params;
  const { token } = req.query;

  console.log('\n🌐 ============ HTTP PROXY REQUEST ============');
  console.log(`📍 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  console.log(`📂 Path: ${req.path}`);
  console.log(`👤 UserId: ${userId}`);
  console.log(`🔌 Port: ${port}`);
  console.log(`🎫 Token: ${token ? token.substring(0, 20) + '...' : '❌ MISSING'}`);

  if (!token) {
    console.log('❌ FAILED: No token provided');
    return res.status(403).send("Missing token");
  }

  const isValid = verifyPreviewToken(token as string, userId, port);
  if (!isValid) {
    console.log('❌ FAILED: Invalid token');
    return res.status(403).send("Invalid or expired preview token");
  }

  console.log('✅ Token verified, creating proxy...');

  const proxy = createProxyMiddleware({
    target: `http://localhost:${port}`,
    changeOrigin: true,
    ws: true,
    selfHandleResponse: true,
    pathRewrite: (path: string, req: any) => {
      const { userId, port } = req.params;
      const prefix = `/preview/${userId}/${port}`;
      
      let newPath = path.replace(prefix, '').replace(/[?&]token=[^&]+/, '').replace(/\?$/, '') || '/';
      
      console.log(`🔄 Path rewrite: ${path} → ${newPath}`);
      return newPath;
    },
    onProxyReq: (proxyReq: any, req: IncomingMessage, res: ServerResponse) => {
      console.log(`➡️  Proxying to: http://localhost:${port}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes: IncomingMessage, req: IncomingMessage, res: ServerResponse) => {
      console.log(`⬅️  Response received: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
      console.log(`📄 Content-Type: ${proxyRes.headers['content-type']}`);
      console.log(`📂 Request path: ${(req as any).path}`);
      
      const contentType = proxyRes.headers['content-type'] || '';
      
      // Rewrite HTML
      if (contentType.includes('text/html')) {
        console.log('🔧 Modifying HTML response...');
        
        let body = '';
        proxyRes.on('data', (chunk) => {
          body += chunk.toString('utf8');
        });
        
        proxyRes.on('end', () => {
          const baseUrl = `/preview/${userId}/${port}`;
          
          console.log('📝 Original HTML length:', body.length);
          
          // Rewrite absolute URLs in HTML attributes
          body = body.replace(
            /((?:src|href))="\/([^"]*)"/g,
            (match, key, path) => {
              const replaced = `${key}="${baseUrl}/${path}?token=${token}"`;
          
             
              return replaced;
            }
          );
          
         // Also rewrite relative URLs in CSS/JS that reference images
         body = body.replace(
          /(url\(['"]?)(\/[^'")]+)(['"]?\))/g,
          (match, prefix, path, suffix) => {
            const replaced = `${prefix}${baseUrl}${path}?token=${token}${suffix}`;
        
           
            return replaced;
          }
        );
        
          
          console.log('✅ HTML URLs rewritten');
          
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          res.end(body);
        });
      } 
      // Pass through everything else (images, JS, fonts, etc.)
      else {
        console.log('📦 Passing through:', contentType);
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
      }
    },
    onError: (err: any, req: IncomingMessage, res: ServerResponse) => {
      console.error('❌ ============ PROXY ERROR ============');
      console.error(`🔴 Error: ${err.message}`);
      console.error(`🔴 Code: ${err.code}`);
      console.error(`🔴 Target: http://localhost:${port}`);
      res.statusCode = 502;
      res.end(`<h1>Proxy Error</h1><p>${err.message}</p><p>Make sure your app is built and running with 'npm start'</p>`);
    },
  }) as any;

  return proxy(req, res, next);
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