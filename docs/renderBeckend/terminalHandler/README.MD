
---

# TerminalWS – WebSocket Terminal, Preview & GUI Manager

## Overview

`TerminalWS` is the **core real-time execution engine** of the platform.
It provides:

* 🖥️ Interactive shell via `node-pty`
* 🔁 Multi-terminal support per project
* 📁 Project file syncing + watchers
* 🌐 Auto preview URL generation
* 🖼️ GUI app support via VNC → WebSocket bridge
* 💓 Heartbeat & stale session cleanup

This class runs on the **Render backend** and integrates with the main backend via WebSockets.

---

## High-Level Architecture

```
Browser (xterm.js)
   │
   │  /ws/terminal
   ▼
TerminalWS ── node-pty ── bash
   │
   ├── File Watcher (per project)
   ├── Preview Token Generator
   ├── RoomManager (state)
   └── VNC Session Service
           │
           ▼
        noVNC
```

---

## Class Responsibilities

| Component           | Responsibility                  |
| ------------------- | ------------------------------- |
| `TerminalWS`        | Entry point, routing, lifecycle |
| `node-pty`          | Interactive terminal process    |
| `RoomManager`       | User/session/terminal tracking  | [Link ](../RoomManager/README.MD)
| `FilePathCrud`      | Project load/save/unload        |
| `watcher`           | File system sync                | [Link ](../watcher/README.MD)
| `VNCSessionService` | GUI display allocation          |
| `WebSocketServer`   | Terminal & VNC WS servers       |

---
* Project Real Dir [Link ](../getProjectDir/README.MD)
## Internal State

```ts
private wss: WebSocketServer;       // Terminal WS server
private vncWss: WebSocketServer;    // GUI / VNC WS server
private heartbeatInterval: Timeout;
private projectTerminalCount: Map<projectId, count>
```

### Why `projectTerminalCount`?

* Avoid duplicate watchers
* Load project files once
* Cleanup when last terminal closes

---

## Preview Token Generation

```ts
private generatePreviewToken(userId: string, port: string)
```

### Purpose

Creates a **deterministic, stateless token** to secure preview access.

### Mechanism

* HMAC SHA-256
* `userId + port` scoped
* Secret stored in `PREVIEW_SECRET`

### Why this approach?

* No DB lookups
* Token can be re-derived anytime
* Prevents port hijacking

---

## Terminal Connection Lifecycle

### 1. WebSocket Connected

```ts
this.wss.on("connection", async (ws, req) => { ... })
```

Actions:

* Mark socket alive
* Register heartbeat
* Retrieve user session
* Ensure GUI session (auto)

---

### 2. GUI Auto-Assignment

```ts
const gui = await VNCSessionService.ensureSession(ws.userId);
```

* Every terminal gets a GUI display
* Enables `DISPLAY=:X` for GUI apps
* Works for Electron, Chrome, GTK, etc.

Environment injection:

```ts
env = { ...process.env, DISPLAY: gui.display }
```

---

### 3. Project Initialization

```ts
if (count === 0) {
  await FilePathCrud.loadProject(projectId);
  ensureProjectWatcher(cwd, projectId);
}
```

Only the **first terminal**:

* Loads project into disk
* Starts file watcher

---

### 4. PTY Spawn

```ts
const ptyProcess = spawn("bash", [], {
  name: "xterm-color",
  cwd,
  env,
});
```

Supports:

* Resize
* Interactive input
* Streaming output

---

### 5. Preview Auto-Detection

Terminal output is scanned for known server patterns:

```ts
/listening on.*?(\d{4,5})/
/http:\/\/localhost:(\d{4,5})/
```

When detected:

* Preview token generated
* Stored in `RoomManager`
* Sent to client as:

```
PREVIEW:PORT:TOKEN
```

This is **zero-config previews**.

---

## Terminal I/O Protocol

### Client → Server

```json
{ "type": "input", "data": "npm run dev\n" }
{ "type": "resize", "cols": 120, "rows": 30 }
```

### Server → Client

```json
{ "type": "output", "data": "Server running on 3000\n" }
{ "type": "exit" }
```

---

## Terminal Cleanup

On socket close:

* Remove terminal from `RoomManager`
* Decrement project counter
* If last terminal:

  * Stop watcher
  * Save files
  * Unload project from memory

```ts
FilePathCrud.forceSave(projectId);
```

This guarantees **no data loss**.

---

## VNC WebSocket Bridge

### Purpose

Allows GUI apps to run inside the container and be viewed in browser.

### Flow

```
Browser (noVNC)
   ↓ WebSocket
TerminalWS (vncWss)
   ↓ TCP
Local VNC Server
```

### Implementation

* Connect to local VNC TCP port
* Pipe WebSocket ↔ TCP
* Binary-safe forwarding

```ts
tcpSocket.pipe(ws);
ws.pipe(tcpSocket);
```

### Fault Handling

* Any side disconnects → close the other
* Ensures no zombie VNC connections

---

## Heartbeat System

Runs every **30 seconds**.

```ts
client.ping();
```

If client fails to respond:

* Kill PTY
* Terminate socket
* Prevents resource leaks

---

## WebSocket Upgrade Entry Point

```ts
public upgrade(isVnc, req, socket, head, ...)
```

### Modes

| Mode          | Action                  |
| ------------- | ----------------------- |
| `isVnc=true`  | Route to `vncWss`       |
| `isVnc=false` | Route to terminal `wss` |

This is invoked by the HTTP `upgrade` router.

---

## Security Model

| Feature         | Protection               |
| --------------- | ------------------------ |
| Terminal access | Token → userId           |
| Preview access  | HMAC token (user + port) |
| GUI access      | User-scoped VNC session  |
| File access     | Project-scoped           |
| Idle cleanup    | Heartbeat kill           |

No open ports.
No unauthenticated shells.
No shared displays.

---

## Why This Design Is Solid

* 🔥 Zero-config previews
* 🔥 GUI + CLI in same session
* 🔥 Stateless preview security
* 🔥 No memory leaks
* 🔥 Multi-terminal safe
* 🔥 Replit-level architecture

This is **not tutorial code**—this is platform-grade infra.

---