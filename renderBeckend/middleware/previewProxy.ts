import { Express, Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyPreviewToken } from "../utils/verifyToken.js";
import type { IncomingMessage, ServerResponse } from "http";

/**
 * Setup secure reverse proxy for preview routes
 */
export function setupPreviewProxy(app: Express): void {
  app.use("/preview/:userId/:port*", (req: Request, res: Response, next: NextFunction) => {
    const { userId, port } = req.params;
    const { token } = req.query;

    console.log("\n🌐 ============ HTTP PROXY REQUEST ============");
    console.log(`📍 URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    console.log(`📂 Path: ${req.path}`);
    console.log(`👤 UserId: ${userId}`);
    console.log(`🔌 Port: ${port}`);
    console.log(`🎫 Token: ${token ? String(token).substring(0, 20) + "..." : "❌ MISSING"}`);

    // Verify token
    if (!token) {
      console.log("❌ FAILED: No token provided");
      return res.status(403).send("Missing preview token");
    }

    const isValid = verifyPreviewToken(token as string, userId, port);
    if (!isValid) {
      console.log("❌ FAILED: Invalid token");
      return res.status(403).send("Invalid or expired preview token");
    }

    console.log("✅ Token verified, creating proxy...");

    // Create proxy middleware
    const proxy = createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      ws: true,
      selfHandleResponse: true,
      
      // Rewrite paths to remove preview prefix
      pathRewrite: (path: string, req: any) => {
        const { userId, port } = req.params;
        const prefix = `/preview/${userId}/${port}`;
        
        // Remove prefix and token query param
        let newPath = path
          .replace(prefix, "")
          .replace(/[?&]token=[^&]+/, "")
          .replace(/\?$/, "");
        
        newPath = newPath || "/";
        
        console.log(`🔄 Path rewrite: ${path} → ${newPath}`);
        return newPath;
      },

      // Log outgoing requests
      onProxyReq: (proxyReq: any, req: IncomingMessage) => {
        console.log(`➡️  Proxying to: http://localhost:${port}${proxyReq.path}`);
      },

      // Handle and rewrite responses
      onProxyRes: (proxyRes: IncomingMessage, req: IncomingMessage, res: ServerResponse) => {
        console.log(`⬅️  Response: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
        console.log(`📄 Content-Type: ${proxyRes.headers["content-type"]}`);

        const contentType = proxyRes.headers["content-type"] || "";

        // Rewrite HTML responses to fix asset paths
        if (contentType.includes("text/html")) {
          console.log("🔧 Rewriting HTML response...");

          let body = "";
          
          proxyRes.on("data", (chunk) => {
            body += chunk.toString("utf8");
          });

          proxyRes.on("end", () => {
            const baseUrl = `/preview/${userId}/${port}`;

            console.log("📝 Original HTML length:", body.length);

            // Rewrite src and href attributes
            body = body.replace(
              /((?:src|href))="\/([^"]*)"/g,
              (match, attr, path) => {
                const rewritten = `${attr}="${baseUrl}/${path}?token=${token}"`;
                return rewritten;
              }
            );

            // Rewrite url() in CSS
            body = body.replace(
              /(url\(['"]?)(\/[^'")]+)(['"]?\))/g,
              (match, prefix, path, suffix) => {
                return `${prefix}${baseUrl}${path}?token=${token}${suffix}`;
              }
            );

            console.log("✅ HTML rewritten");

            res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
            res.end(body);
          });
        } else {
          // Pass through non-HTML responses
          console.log("📦 Passing through:", contentType);
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res);
        }
      },

      // Handle proxy errors
      onError: (err: any, req: IncomingMessage, res: ServerResponse) => {
        console.error("❌ ============ PROXY ERROR ============");
        console.error(`🔴 Error: ${err.message}`);
        console.error(`🔴 Code: ${err.code}`);
        console.error(`🔴 Target: http://localhost:${port}`);

        res.statusCode = 502;
        res.end(
          `<h1>Proxy Error</h1>
           <p>${err.message}</p>
           <p>Make sure your app is built and running on port ${port}</p>`
        );
      },
    }) as any;

    return proxy(req, res, next);
  });
}