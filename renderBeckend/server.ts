import express from "express";
import http from "http";
import cors from "cors";
import { handleUpgrade } from "./utils/upgradeRouter.js";
import config from "./config/index.js";
import router from "./routes/index.js";
import { verifyPreviewToken } from "./utils/verifyToken.js";
//@ts-ignore
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
app.get("/gui/:userId", (req, res) => {
  const { userId } = req.params;
  const encodedUser = encodeURIComponent(userId);
  const url = `/novnc/vnc.html?path=websockify/${encodedUser}&autoconnect=true&resize=scale`;
  res.redirect(url);
});

// ---- SECURE REVERSE PROXY (PRODUCTION BUILD PREVIEW) ----
app.use("/preview/:userId/:port*", (req, res, next) => {
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

  const isValid = verifyPreviewToken(token, userId, port);
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
    pathRewrite: (path, req) => {
      const { userId, port } = req.params;
      const prefix = `/preview/${userId}/${port}`;
      
      let newPath = path.replace(prefix, '').replace(/[?&]token=[^&]+/, '').replace(/\?$/, '') || '/';
      
      console.log(`🔄 Path rewrite: ${path} → ${newPath}`);
      return newPath;
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`➡️  Proxying to: http://localhost:${port}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`⬅️  Response received: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
      console.log(`📄 Content-Type: ${proxyRes.headers['content-type']}`);
      console.log(`📂 Request path: ${req.path}`);
      
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
          
              console.log("MATCH:", match);
              console.log("BECOMES:", replaced);
          
              return replaced;
            }
          );
          
         // Also rewrite relative URLs in CSS/JS that reference images
         body = body.replace(
          /(url\(['"]?)(\/[^'")]+)(['"]?\))/g,
          (match, prefix, path, suffix) => {
            const replaced = `${prefix}${baseUrl}${path}?token=${token}${suffix}`;
        
            console.log("MATCH:", match);
            console.log("BECOMES:", replaced);
        
            return replaced;
          }
        );
        
          
          console.log('✅ HTML URLs rewritten');
          
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(body);
        });
      } 
      // Pass through everything else (images, JS, fonts, etc.)
      else {
        console.log('📦 Passing through:', contentType);
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    },
    onError: (err, req, res) => {
      console.error('❌ ============ PROXY ERROR ============');
      console.error(`🔴 Error: ${err.message}`);
      console.error(`🔴 Code: ${err.code}`);
      console.error(`🔴 Target: http://localhost:${port}`);
      res.status(502).send(`<h1>Proxy Error</h1><p>${err.message}</p><p>Make sure your app is built and running with 'npm start'</p>`);
    },
  });

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
