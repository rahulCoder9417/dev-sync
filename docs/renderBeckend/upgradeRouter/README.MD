
---

# WebSocket Upgrade Handler Documentation

## Overview

`handleUpgrade` is a **central WebSocket router** for the Render backend.
It inspects the incoming WebSocket request path and **delegates the connection** to the appropriate handler based on purpose:

* Terminal sessions
* File synchronization
* VNC (websockify)
* Preview server proxying (Express / Vite / custom apps)

This function is attached to the Node.js HTTP server’s `upgrade` event.

---

## Imports & Dependencies

```ts
import { parse } from "url";
import http from "http";

import handleUpgradeWs from "../ws/terminalHandler.js";
import fileSyncWS from "../ws/fileSyncHandler.js";

import { getAuthData } from "./auth.js";
import { verifyPreviewToken } from "./verifyToken.js";
```

### Purpose

* **`parse`**: Extract pathname from WebSocket URL
* **`http`**: Create low-level proxy requests (used for preview)
* **`terminalHandler`**: Manages terminal WebSocket lifecycle [terminalHandler](../terminalHandler/README.MD)
* **`fileSyncHandler`**: Handles backend-to-backend file sync [fileSyncHandler](../fileSyncHandler/README.MD)
* **`getAuthData`**: Validates auth token and returns `userId`
* **`verifyPreviewToken`**: Verifies preview access token (user + port scoped)

---

## Function Signature

```ts
export async function handleUpgrade(
  request: any,
  socket: any,
  head: any
)
```

### Parameters

| Parameter | Description                         |
| --------- | ----------------------------------- |
| `request` | Incoming HTTP upgrade request       |
| `socket`  | Raw TCP socket                      |
| `head`    | First packet of the upgraded stream |

---

## Request Routing Logic

```ts
const { pathname } = parse(request.url || "");
```

All routing is done using the **URL pathname**.

---

## 1. Terminal WebSocket

**Path:** `/ws/terminal`

### Purpose

Used for:

* Interactive terminal (xterm + node-pty)
* One terminal per `terminalId`
* Authenticated user access

### Flow

1. Build absolute URL to safely read query params
2. Extract:

   * `terminalId`
   * `projectId`
   * `token`
3. Authenticate token
4. Upgrade socket via `terminalHandler`

```ts
if (pathname === "/ws/terminal") {
  const absUrl = new URL(request.url!, `http://${request.headers.host}`);
  
  const terminalId = absUrl.searchParams.get("terminalId");
  const projectId = absUrl.searchParams.get("projectId");
  const token = absUrl.searchParams.get("token");

  if (!token) {
    socket.destroy();
    return;
  }

  const userId = await getAuthData(token);
  if (!userId) throw new Error("Invalid token");

  handleUpgradeWs.upgrade(
    false,        // not VNC
    request,
    socket,
    head,
    userId,
    terminalId,
    projectId
  );
}
```

### Security

* Token required
* Token → userId validation
* Socket destroyed immediately on failure

---

## 2. File Sync WebSocket

**Path:** `/ws/file-sync`

### Purpose

Used **only** for:

* Main backend → Render backend
* Streaming file system changes
* No DB writes
* No UI broadcasts

```ts
else if (pathname === "/ws/file-sync") {
  fileSyncWS.upgrade(request, socket, head);
  return;
}
```

### Notes

* Trusted internal channel
* Lightweight
* Event-based sync only

---

## 3. VNC / Websockify

**Path:** `/websockify/*`

### Purpose

* Used for GUI-based apps
* Browser → noVNC → backend VNC server

```ts
else if (pathname.startsWith("/websockify/")) {
  await handleUpgradeWs.upgrade(true, request, socket, head);
  return;
}
```

### Difference

* First argument = `true` → enables VNC mode
* Skips user/project validation here (handled internally)

---

## 4. Preview WebSocket Proxy

**Path:** `/preview/:userId/:port/*?token=...`

### Purpose

Allows **live WebSocket preview** of:

* Express apps
* Vite dev servers
* Custom WebSocket servers

Without exposing ports publicly.

---

### URL Format (Important)

```
/preview/{userId}/{port}/<any-path>?token=PREVIEW_TOKEN
```

Example:

```
/preview/u123/5173/socket.io/?token=abc123
```

---

### Flow Breakdown

1. Parse `userId` and `port`
2. Extract `token`
3. Verify token (scoped to user + port)
4. Rewrite path
5. Proxy WebSocket handshake to `localhost:port`
6. Pipe sockets bi-directionally

---

### Code Highlights

#### Token Validation

```ts
const isValid = verifyPreviewToken(token, userId, port);
if (!isValid) {
  socket.destroy();
  return;
}
```

#### Path Rewrite

```ts
const pathAfterPort = "/" + pathParts.slice(4).join("/");
const rewrittenPath =
  (pathAfterPort === "/" ? "" : pathAfterPort) + pathname.search;
```

#### Proxy Upgrade

```ts
const proxyReq = http.request({
  hostname: "localhost",
  port: parseInt(port),
  path: rewrittenPath || "/",
  headers: request.headers,
});
```

#### Socket Bridging

```ts
proxySocket.pipe(socket);
socket.pipe(proxySocket);
```

---

### Why This Design Is Strong

* 🔒 Port-level access control
* 🔒 User-scoped preview tokens
* 🌐 Works for **any WebSocket framework**
* ⚡ Zero-copy socket piping
* 🧠 No Express / framework coupling

---

## 5. Unknown WebSocket Paths

```ts
else {
  console.error(`Unknown WebSocket path: ${pathname}`);
  socket.destroy();
}
```

Fail-fast behavior prevents:

* Hanging sockets
* Accidental exposure
* Debug nightmares

---

## Global Error Handling

```ts
catch (err) {
  console.error("WebSocket upgrade error:", err);
  socket.destroy();
}
```

Guarantees:

* No half-open sockets
* Clean shutdown on failure

---

## Architectural Summary

| Channel         | Direction              | Auth        | Purpose           |
| --------------- | ---------------------- | ----------- | ----------------- |
| `/ws/terminal`  | Browser → Render       | ✅           | Interactive shell |
| `/ws/file-sync` | Backend → Render       | ❌ (trusted) | File updates      |
| `/websockify/*` | Browser → Render       | ⚠️ internal | GUI apps          |
| `/preview/*`    | Browser → Render → App | ✅           | Live preview      |

---
