import { parse } from "url";
import handleUpgradeWs from "../ws/terminalHandler.js";
import fileSyncWS from "../ws/fileSyncHandler.js";
import { getAuthData } from "./auth.js";
import { verifyPreviewToken } from "./verifyToken.js";
import http from "http";
export async function handleUpgrade(request: any, socket: any, head: any) {
  const { pathname } = parse(request.url || "");

  try {
    // Route to the appropriate WebSocket handler based on the path

    //terminal
    if (pathname === "/ws/terminal") {
      // Build absolute URL using host header to correctly parse search params
      const absUrl = new URL(
        request.url || "",
        `http://${request.headers.host || "localhost"}`
      );

      const terminalId = absUrl.searchParams.get("terminalId");
      const projectId = absUrl.searchParams.get("projectId");
      // Prefer query param token like main backend
      let token = absUrl.searchParams.get("token");
      if (!token) {
        console.error("No token provided ws terminal");
        socket.destroy();
        return;
      }
      const userId = await getAuthData(token);
      if (!userId) {
        throw new Error("Invalid token cannot connect to terminal");
      }
      handleUpgradeWs.upgrade(
        false,
        request,
        socket,
        head,
        userId,
        terminalId,
        projectId
      );
    }
    // file sync channel: main backend -> render backend
    else if (pathname === "/ws/file-sync") {
      // No DB writes or UI broadcasts here; accept connection and handle events
      fileSyncWS.upgrade(request, socket, head);
      return;
    }
    //vnc
    else if (pathname.startsWith("/websockify/")) {
      console.log("✅ Matched: VNC WebSocket");
     await handleUpgradeWs.upgrade(true, request, socket, head);
      return;
    } 
     // Preview WebSocket (for Express apps with WebSocket support).yeh likh diya hai ,ise kam krne ke liye project me specify krna hoga uska ws url preview/userid/port?token=token ,aur addiditional  info deni hogi
    else if (pathname.startsWith("/preview/")) {
      console.log('✅ Matched: Preview WebSocket');
      const pathParts = pathname.split("/");
      const userId = pathParts[2];
      const port = pathParts[3];
      const token =new URL(
        request.url || "",
        `http://${request.headers.host || "localhost"}`
      )?.searchParams.get("token");
  
      console.log(`👤 UserId: ${userId}`);
      console.log(`🔌 Port: ${port}`);
      console.log(`🎫 Token: ${token ? token.substring(0, 20) + '...' : '❌ MISSING'}`);
  
      if (!token) {
        console.log('❌ No token provided for WebSocket upgrade');
        socket.destroy();
        return;
      }
  
      const isValid = verifyPreviewToken(token, userId, port);
      if (!isValid) {
        console.log('❌ Invalid token for WebSocket upgrade');
        socket.destroy();
        return;
      }
  
      console.log('✅ Token verified, creating WebSocket proxy...');
  
      const pathAfterPort = "/" + pathParts.slice(4).join("/");
      const rewrittenPath = (pathAfterPort === "/" ? "" : pathAfterPort) + pathname.search;
      
      console.log(`🔄 Path rewrite: ${pathname} → ${rewrittenPath || '/'}`);
      console.log(`➡️  Connecting to: localhost:${port}${rewrittenPath || '/'}`);
  
      const proxyReq = http.request({
        hostname: "localhost",
        port: parseInt(port),
        path: rewrittenPath || '/',
        headers: request.headers,
      });
  
      proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
        console.log('✅ Server accepted WebSocket upgrade');  
        socket.write("HTTP/1.1 101 Switching Protocols\r\n");
        Object.keys(proxyRes.headers).forEach((key) => {
          socket.write(`${key}: ${proxyRes.headers[key]}\r\n`);
        });
        socket.write("\r\n");
        
        console.log('✅ Pipes established - WebSocket is live!');
  
        proxySocket.on("error", (err) => {
          console.error("❌ ProxySocket error:", err.message);
          try { socket.destroy(); } catch {}
        });
        
        socket.on("error", (err) => {
          console.error("❌ Client socket error:", err.message);
          try { proxySocket.destroy(); } catch {}
        });
        
        proxySocket.pipe(socket);
        socket.pipe(proxySocket);
      });
  
      proxyReq.on("error", (err) => {
        console.error('❌ ============ WEBSOCKET PROXY ERROR ============');
        console.error(`🔴 Error: ${err.message}`);
        console.error(`🔴 Target: localhost:${port}${rewrittenPath || '/'}`);
        socket.destroy();
      });
  
      proxyReq.end();
      return;
    } else {
      console.error(`Unknown WebSocket path: ${pathname}`);
      socket.destroy();
    }
  } catch (err) {
    console.error("WebSocket upgrade error:", err);
    socket.destroy();
  }
}
