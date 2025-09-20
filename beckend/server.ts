// server.ts
import express from "express";
import http from "http";
import config from "./src/config";
import router from "./src/routes";
import cors from "cors";
import WsHandler from "./src/websocket/wsHandler";
import { UserMeta } from "./types";
import { getAuthData } from "./src/auth";
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: config.cors.origin,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", router);

const wss = new WsHandler();
server.on('upgrade',async (request, socket, head) => {
  const token = request.url?.split("?")[1]!.split("=")[1];
    if (!token) {
      socket.destroy();
      return;
    }

  try {
    // Verify token
    const claims = await getAuthData(token);
    if(!claims){
      throw new Error("User not found");
    }
    wss.handleUpdate(request, socket, head,claims as UserMeta);
  } catch (err) {
    console.error("Auth error:", err);
    socket.destroy();
    return;
  }
});


server.listen(config.port, () => {
  console.log(`HTTP server listening on ${config.port}`);
});

async function shutdown() {
  console.log("Shutting down gracefully...");

  server.close((err) => {
    if (err) console.error("Error closing server:", err);
  });

  try {
    wss.close();
    console.log("WebSocket handler closed");
  } catch (err) {
    console.error("Error closing WebSocket handler:", err);
  }

  setTimeout(() => process.exit(0), 2000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
