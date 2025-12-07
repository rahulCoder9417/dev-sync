import { parse } from "url";
import handleUpgradeWs from "../ws/terminalHandler.js";
import { getAuthData } from "./auth.js";

export async function handleUpgrade(request: any, socket: any, head: any) {
  const { pathname } = parse(request.url || "");
  
  // Build absolute URL using host header to correctly parse search params
  const absUrl = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);

  const terminalId = absUrl.searchParams.get("terminalId");
  const projectId = absUrl.searchParams.get("projectId");
  // Prefer query param token like main backend
  let token = absUrl.searchParams.get("token");
  if(!token){
    console.error("No token provided");
    socket.destroy();
    return;
  }

  try {
    // Verify token
    const userId = await getAuthData(token);
    if (!userId) {
      throw new Error("Invalid token");
    }

    // Route to the appropriate WebSocket handler based on the path
    if (pathname === '/ws/terminal') {
      handleUpgradeWs.upgrade(request, socket, head, userId,terminalId,projectId);
    } else {
      console.error(`Unknown WebSocket path: ${pathname}`);
      socket.destroy();
    }
  } catch (err) {
    console.error("WebSocket upgrade error:", err);
    socket.destroy();
  }
}
