
---

# Filesystem Event Handlers (`fsEventHandlers.ts`)

## Overview

This module is the **bridge between disk changes and the collaborative system**.

Whenever a file or folder is:

* created
* updated
* deleted

…it ensures **three systems stay in sync**:

1. **Disk** (actual filesystem)
2. **Database** (source of truth)
3. **Connected clients** (via WebSocket)

This file is invoked exclusively by the **filesystem watcher** (`chokidar`).

---

## Architectural Position

```
Disk change
   ↓
FS Watcher
   ↓
fsEventHandlers 
   ├── FilePathCrud (path ↔ id) 
   ├── Database (Prisma / Drizzle)
   └── fileSyncWS (UI updates)
```
*  [FilePathCrud](../filePathCrud/README.MD)
*  [fileSyncWS](../fileSyncHandler/README.MD)
This guarantees **eventual consistency** across all layers.

---

## Core Concepts

### File Identity

Files are identified by **IDs**, not paths.

```ts
fileId (cuid)
```

Paths are **runtime artifacts** and may change.

`FilePathCrud` maintains the mapping:

```
absPath ↔ fileId
```

---

## Event Types Emitted to UI

| Type     | Meaning                 |
| -------- | ----------------------- |
| `create` | New file/folder created |
| `save`   | File content updated    |
| `delete` | File/folder removed     |

These events are sent through `fileSyncWS`.

---

## File Create Handler

```ts
handleFileCreate(absPath, projectId)
```

### Trigger

* FS watcher detects `add`

### Steps

1. Resolve parent folder ID
2. Generate file ID (`cuid`)
3. Read file content
4. Register path ↔ id mapping
5. Notify UI (create + save)
6. Persist to DB

### Why send **two events**?

* `create` → update file tree
* `save` → populate editor content

This avoids race conditions in UI state.

---

## Folder Create Handler

```ts
handleFolderCreate(absPath, projectId)
```

### Trigger

* FS watcher detects `addDir`

### Steps

1. Resolve parent folder
2. Generate folder ID
3. Register folder path
4. Notify UI (tree update)
5. Persist empty folder in DB

Folders have:

```ts
type: "folder"
content: ""
```

---

## File Update Handler

```ts
handleFileUpdate(absPath, projectId)
```

### Trigger

* FS watcher detects `change`

### Steps

1. Read new content from disk
2. Resolve file ID
3. Notify UI (`save`)
4. Update DB content

### Design Choice

* **Disk is authoritative** for terminal writes
* UI receives exact content from runtime

---

## File Delete Handler

```ts
handleFileDelete(absPath, projectId)
```

### Trigger

* FS watcher detects `unlink`

### Steps

1. Resolve file ID
2. Notify UI (`delete`)
3. Delete DB record
4. Remove path mapping

Ensures:

* Tree stays clean
* No orphaned DB rows

---

## Folder Delete Handler

```ts
handleFolderDelete(absPath, projectId)
```

### Trigger

* FS watcher detects `unlinkDir`

### Steps

1. Resolve folder ID
2. Notify UI (`delete`)
3. Delete DB entry
4. Remove mapping

Parent-first deletion is handled elsewhere.

---

## WebSocket Sync (`fileSyncWS`)

All events are sent **before or alongside DB writes**.

This gives:

* Fast UI feedback
* Eventual DB consistency
* No blocking on DB latency

Example event:

```ts
fileSyncWS.sendFileEvent({
  type: "save",
  projectId,
  fileId,
  content
});
```

---

## Database Guarantees

* Each file/folder maps to **exactly one DB record**
* `createdAt` and `updatedAt` tracked
* Safe to replay events (idempotent paths)

Failures are caught and logged but **do not crash the watcher**.

---

## Error Handling Philosophy

```ts
try { ... } catch (e) {
  console.log("error in ...", e)
}
```

Why this is correct:

* Filesystem events must never block
* Best-effort DB sync
* Recovery handled at higher layers

---

## Important Design Decisions

### 1. Absolute Paths → Relative IDs

Paths are volatile, IDs are stable.

### 2. Disk-First Updates

Terminal edits are authoritative.

### 3. WebSocket Before DB

UI should feel instant.

### 4. No Transactions

FS events are non-atomic by nature.

---

## Example Flow (Terminal Edit)

```
User types in terminal
   ↓
File saved to disk
   ↓
FS watcher fires
   ↓
handleFileUpdate
   ↓
UI updated via WS
   ↓
DB updated
```

---

## Example Flow (File Created in UI)

```
UI create file
   ↓
Disk write (suppressed)
   ↓
FS watcher ignores
   ↓
UI already updated
```

This works because of the **suppression registry**.

---