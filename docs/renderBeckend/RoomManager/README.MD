
---

# RoomManager – In-Memory Session & Resource Registry

## Overview

`RoomManager` is a **central in-memory state manager** responsible for tracking **active user runtime sessions** on the Render backend.

It acts as the **single source of truth** for:

* Active terminals (PTY processes)
* GUI (VNC) sessions
* Live preview servers
* Project root configuration

> Think of it as a **runtime session registry**, not a database.

---

## Why RoomManager Exists

Your platform runs **stateful resources** that should:

* Exist only while users are connected
* Be fast to access (no DB)
* Be easy to clean up

Examples:

* `node-pty` processes
* VNC displays
* Preview ports
* File watchers

`RoomManager` solves this by keeping everything **in-memory and scoped per user**.

---

## Internal Data Model

```ts
private sessions: Record<string, Session>
```

Each `Session` is keyed by `userId` and looks like:

```ts
Session {
  terminals: {
    [terminalId: string]: PtyProcess
  },
  gui: GuiSession | null,
  previews: {
    [port: string]: {
      port: string
      token: string
      startedAt: Date
    }
  }
}
```

---

## Project Root Configuration

```ts
public PROJECT_ROOT = "/usr/src/app/projects"
```

### Purpose

Defines the **base directory** where all user projects are reconstructed on disk.

Used by:

* Terminal working directory resolution
* FilePathCrud
* File watchers

This path is intentionally centralized here to:

* Avoid hardcoding paths in multiple places
* Make container paths configurable

---

## Session Lifecycle

### `getUserSession(userId)`

```ts
public getUserSession(userId: string)
```

**Guarantees** a session exists for a user.

* Lazily initializes session if missing
* Prevents null checks everywhere else

```ts
if (!this.sessions[userId]) {
  this.sessions[userId] = {
    terminals: {},
    gui: null,
    previews: {}
  };
}
```

This is the **entry point** for almost every runtime action.

---

## Terminal Management

### `addTerminal(userId, terminalId, ptyProcess)`

Registers a `node-pty` process under a user.

Used when:

* A new terminal WebSocket connects

```ts
this.sessions[userId].terminals[terminalId] = ptyProcess;
```

---

### `removeTerminal(userId, terminalId)`

Removes a terminal reference when:

* WebSocket closes
* Terminal exits

Does **not** kill the process (that’s handled elsewhere).

---

### `getTerminal(userId, terminalId)`

Returns the PTY process or `null`.

Used by:

* Heartbeat cleanup
* Forced termination
* Manual kill logic

---

## GUI (VNC) Session Management

### `addGui(userId, gui)`

Stores the active GUI session for a user.

```ts
this.sessions[userId].gui = gui;
```

Only **one GUI session per user** is supported by design.

---

### `getGui(userId)`

Returns the user’s GUI session (if any).

Used by:

* VNC WebSocket bridge
* GUI recovery logic

---

### `removeGui(userId?)`

Two modes:

#### 1. Per-user cleanup

```ts
removeGui(userId)
```

Clears only that user’s GUI session.

#### 2. Global cleanup

```ts
removeGui()
```

Resets **all sessions** (used during shutdown / reset).

---

## Preview Server Tracking

### `addPreview(userId, port, token)`

Registers a detected preview server.

Stored data:

* Port
* HMAC token
* Start timestamp

```ts
this.sessions[userId].previews[port] = {
  port,
  token,
  startedAt: new Date()
};
```

Used by:

* Terminal auto-detection
* Preview WebSocket routing
* UI preview listing

---

### `removePreview(userId, port)`

Deletes a preview entry when:

* Server stops
* User disconnects
* Project resets

---

## What RoomManager Does *Not* Do (By Design)

❌ No database writes
❌ No persistence across restarts
❌ No authentication
❌ No process spawning
❌ No cleanup timers

Those concerns are handled by:

* `TerminalWS`
* `VNCSessionService`
* File watchers
* Heartbeat logic

This keeps RoomManager **simple and predictable**.

---

## Concurrency & Safety Notes

* Runs in a **single Node.js process**
* Safe because:

  * Node event loop is single-threaded
  * All access is synchronous
* If you scale horizontally → each instance gets its own RoomManager

(Which is exactly what you want.)

---

## Architectural Role

```
TerminalWS
   ├── RoomManager (state)
   ├── node-pty
   ├── VNCSessionService
   └── FilePathCrud
```

RoomManager is the **glue**, not the engine.

---
