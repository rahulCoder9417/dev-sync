
---

# FileSyncWS – Backend ↔ Runtime File Synchronization

## Overview

`FileSyncWS` is a **dedicated WebSocket service** responsible for **one-way and two-way file synchronization** between:

* **Main backend (DB + UI actions)**
* **Render backend (actual filesystem + terminal)**

It ensures that:

* Files created/edited in the UI appear on disk
* Files changed on disk propagate back to the UI
* Infinite FS watcher loops are avoided
* Media files (images/videos) are handled correctly

> There is **only one client**: the **main backend**.

---

## Architectural Role

```
Main Backend (DB / UI)
   │
   │  WebSocket (file-sync)
   ▼
FileSyncWS (Render)
   │
   ├── Disk (fs)
   ├── FilePathCrud (id ↔ path)
   ├── Suppression Registry
   └── FS Watcher (other direction)
```

This service **never talks directly to the UI**.
It only synchronizes **state and disk**.

---

## Why FileSyncWS Exists

You intentionally separated responsibilities:

| Layer          | Responsibility                  |
| -------------- | ------------------------------- |
| Main backend   | Auth, DB, UI events             |
| Render backend | Execution, filesystem, terminal |
| FileSyncWS     | Deterministic file replication  |

This avoids:

* DB access from runtime
* UI coupling with disk
* Inconsistent state across services

---

## Supported Incoming Events (Main → Render)

```ts
type RenderFileEvent =
  | file:create
  | file:update
  | file:delete
  | file:rename
```

These events **mirror the main backend schema** exactly.

---

## Supported Outgoing Events (Render → Main)

```ts
type OutGoingFileBroadcast =
  | save
  | rename
  | delete
  | create
```

These are sent when:

* Terminal edits files
* FS watcher detects changes
* Runtime mutates disk

---

## WebSocket Lifecycle

### Setup

```ts
this.wss = new WebSocketServer({ noServer: true });
```

* No HTTP server attached directly
* Upgraded externally via `upgrade()`
* Ensures isolation from terminal sockets

---

### Connection Handling

```ts
this.wss.on("connection", ws => { ... })
```

* Marks socket alive
* Listens for incoming file events
* Handles heartbeat (ping/pong)

Only **one connection** is expected (main backend).

---

## Event Handling Pipeline

```ts
ws.on("message", async (buf) => {
  const ev = JSON.parse(buf.toString());
  await this.handleEvent(ev);
});
```

### Important

* Every event is **idempotent**
* Failures are logged, not fatal
* Runtime continues safely

---

## Ignored Paths

```ts
const IGNORED = ["node_modules", "dist", "build", ".next", "out"];
```

Files under these folders:

* Are never written
* Are never renamed
* Are never deleted

This prevents:

* Massive sync noise
* Build artifacts corruption
* Accidental runtime explosions

---

## Suppression Registry Integration

Before *any* disk mutation:

```ts
Sup.suppress(absPath);
```

This ensures:

* FS watcher does NOT echo events back
* No infinite UI ↔ disk loop
* Deterministic one-direction writes

This is **critical** for correctness.

---

## Event Handling Breakdown

---

### 1. `file:create`

Triggered when:

* User creates file/folder in UI

Steps:

1. Resolve parent directory via `FilePathCrud`
2. Compute absolute path
3. Suppress path
4. Create file/folder on disk
5. Register path ↔ fileId mapping

```ts
await FilePathCrud.setFilePath(projectId, fileFolderId, newAbs);
```

UI already knows about the file — this only materializes it.

---

### 2. `file:update`

Triggered when:

* UI saves a file

Steps:

1. Resolve file path
2. Suppress path
3. Write content to disk

#### Special Case: Media Files

If content is:

* A Cloudinary URL
* And file is image/video

Then:

* File is downloaded
* Written as binary

This avoids:

* Storing blobs in DB
* Corrupting binary assets

---

### 3. `file:delete`

Triggered when:

* UI deletes file/folder

Steps:

1. Resolve absolute path
2. Suppress
3. `fs.rm` (recursive + force)
4. Remove path mapping

This guarantees **hard deletion**.

---

### 4. `file:rename`

Triggered when:

* UI renames file/folder

Steps:

1. Resolve old path
2. Compute new path
3. Suppress both paths
4. Rename on disk
5. Update path map recursively

This supports:

* Folder rename
* Deep tree updates
* No broken children paths

---

## Heartbeat & Connection Safety

### Why heartbeat?

If main backend dies:

* Render backend must not keep stale socket
* Avoid memory leaks

### Implementation

* Ping every 30s
* If no pong → terminate socket

```ts
if (ws.isAlive === false) ws.terminate();
```

Simple and correct.

---

## Outgoing Broadcasts (Render → Main)

```ts
sendFileEvent(ev)
```

Used by:

* FS watcher
* Terminal edits
* Runtime writes

Broadcasts to **all connected clients**
(Practically: one main backend).

---

## Upgrade Hook

```ts
public upgrade(req, socket, head)
```

Used by:

* Central HTTP upgrade router

Keeps:

* FileSyncWS isolated
* No accidental public exposure

---

## Error Handling Philosophy

* Never throw from WS handler
* Always log errors
* Never crash runtime on sync failure

This is correct for infra services.

---

## Design Guarantees

* ✅ No infinite sync loops
* ✅ Disk is always source of truth for runtime
* ✅ UI remains responsive
* ✅ Media files handled safely
* ✅ Single-connection simplicity
* ✅ Clear separation of concerns

---

## Full Flow Example (UI → Disk)

```
UI save file
   ↓
Main backend emits file:update
   ↓
FileSyncWS writes to disk (suppressed)
   ↓
FS watcher ignores
   ↓
Terminal sees updated file
```

---

## Full Flow Example (Terminal → UI)

```
Terminal edits file
   ↓
Disk write
   ↓
FS watcher
   ↓
fsEventHandler
   ↓
fileSyncWS.sendFileEvent
   ↓
Main backend updates DB + UI
```

---
