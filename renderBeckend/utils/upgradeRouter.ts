import { parse } from "url";
import { IncomingMessage } from "http";
import http from "http";
import terminalWSHandler from "../ws/TerminalWSHandler.js";
import vncWSHandler from "../ws/VNCWSHandler.js";
import fileSyncWSHandler from "../ws/FileSyncWSHandler.js";
import { getAuthData } from "./auth.js";
import { verifyPreviewToken } from "./verifyToken.js";

/**
 * Routes WebSocket upgrade requests to appropriate handlers
 */
export async function handleUpgrade(
  request: IncomingMessage,
  socket: any,
  head: any
): Promise<void> {
  const { pathname } = parse(request.url || "");

  try {
    // Route based on pathname
    if (pathname === "/ws/terminal") {
      await handleTerminalUpgrade(request, socket, head);
    } else if (pathname === "/ws/file-sync") {
      await handleFileSyncUpgrade(request, socket, head);
    } else if (pathname?.startsWith("/websockify/")) {
      await handleVNCUpgrade(request, socket, head);
    } else if (pathname?.startsWith("/preview/")) {
      await handlePreviewWSUpgrade(request, socket, head, pathname);
    } else {
      console.error(`❌ Unknown WebSocket path: ${pathname}`);
      socket.destroy();
    }
  } catch (err) {
    console.error("❌ WebSocket upgrade error:", err);
    socket.destroy();
  }
}

/**
 * Handle terminal WebSocket upgrade
 */
async function handleTerminalUpgrade(
  request: IncomingMessage,
  socket: any,
  head: any
): Promise<void> {
  const absUrl = new URL(
    request.url || "",
    `http://${request.headers.host || "localhost"}`
  );

  const terminalId = absUrl.searchParams.get("terminalId");
  const projectId = absUrl.searchParams.get("projectId");
  const token = absUrl.searchParams.get("token");

  if (!token) {
    console.error("❌ No token provided for terminal WS");
    socket.destroy();
    return;
  }

  if (!terminalId || !projectId) {
    console.error("❌ Missing terminalId or projectId for terminal WS");
    socket.destroy();
    return;
  }

  // Verify token and get userId
  const userId = await getAuthData(token);
  if (!userId) {
    console.error("❌ Invalid token for terminal WS");
    socket.destroy();
    return;
  }

  console.log(`✅ Terminal WS auth: user=${userId}, terminal=${terminalId}, project=${projectId}`);

  terminalWSHandler.upgrade(request, socket, head, userId, terminalId, projectId);
}

/**
 * Handle file sync WebSocket upgrade
 */
async function handleFileSyncUpgrade(
  request: IncomingMessage,
  socket: any,
  head: any
): Promise<void> {
  console.log("✅ Matched: File Sync WebSocket");
  fileSyncWSHandler.upgrade(request, socket, head);
}

/**
 * Handle VNC WebSocket upgrade
 */
async function handleVNCUpgrade(
  request: IncomingMessage,
  socket: any,
  head: any
): Promise<void> {
  console.log("✅ Matched: VNC WebSocket");
  vncWSHandler.upgrade(request, socket, head);
}

/**
 * Handle preview WebSocket upgrade (for apps with WS support)
 */
async function handlePreviewWSUpgrade(
  request: IncomingMessage,
  socket: any,
  head: any,
  pathname: string
): Promise<void> {
  console.log("✅ Matched: Preview WebSocket");

  const absUrl = new URL(
    request.url || "",
    `http://${request.headers.host || "localhost"}`
  );

  const pathParts = pathname.split("/").filter(Boolean);
  
  if (pathParts.length < 3) {
    console.error("❌ Invalid preview WS path format");
    socket.destroy();
    return;
  }

  const userId = pathParts[1]; // preview/userId/port/...
  const port = pathParts[2];
  const token = absUrl.searchParams.get("token");

  console.log(`👤 UserId: ${userId}`);
  console.log(`🔌 Port: ${port}`);
  console.log(`🎫 Token: ${token ? token.substring(0, 20) + "..." : "❌ MISSING"}`);

  if (!token) {
    console.log("❌ No token provided for preview WebSocket");
    socket.destroy();
    return;
  }

  const isValid = verifyPreviewToken(token, userId, port);
  if (!isValid) {
    console.log("❌ Invalid token for preview WebSocket");
    socket.destroy();
    return;
  }

  console.log("✅ Token verified, creating WebSocket proxy...");

  // Extract path after port
  const pathAfterPort = "/" + pathParts.slice(3).join("/");
  const rewrittenPath = (pathAfterPort === "/" ? "" : pathAfterPort) + (absUrl.search || "");

  console.log(`🔄 Path rewrite: ${pathname} → ${rewrittenPath || "/"}`);
  console.log(`➡️  Connecting to: localhost:${port}${rewrittenPath || "/"}`);

  // Create HTTP upgrade request to target server
  const proxyReq = http.request({
    hostname: "localhost",
    port: parseInt(port),
    path: rewrittenPath || "/",
    headers: request.headers,
  });

  proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    console.log("✅ Target server accepted WebSocket upgrade");

    // Write HTTP upgrade response
    socket.write("HTTP/1.1 101 Switching Protocols\r\n");
    Object.keys(proxyRes.headers).forEach((key) => {
      socket.write(`${key}: ${proxyRes.headers[key]}\r\n`);
    });
    socket.write("\r\n");
    socket.write(proxyHead);

    console.log("✅ WebSocket pipes established");

    // Handle errors
    proxySocket.on("error", (err) => {
      console.error("❌ ProxySocket error:", err.message);
      try {
        socket.destroy();
      } catch {}
    });

    socket.on("error", (err) => {
      console.error("❌ Client socket error:", err.message);
      try {
        proxySocket.destroy();
      } catch {}
    });

    // Establish bidirectional pipe
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on("error", (err) => {
    console.error("❌ ============ WEBSOCKET PROXY ERROR ============");
    console.error(`🔴 Error: ${err.message}`);
    console.error(`🔴 Target: localhost:${port}${rewrittenPath || "/"}`);
    socket.destroy();
  });

  proxyReq.end();
}