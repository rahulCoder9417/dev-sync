
---

# Filesystem Watcher & Suppression System

## Overview

This module provides **real-time file synchronization** between:

* Disk (Render backend)
* Database (source of truth)
* UI (editor, file explorer)

It does this using:

* **`chokidar`** for filesystem watching
* **One watcher per project**
* **A suppression registry** to prevent infinite event loops

---

## Why This System Exists

Your platform supports:

* Editing files from the UI
* Editing files from the terminal
* Syncing both directions in real time

Without suppression, this would cause:

```
UI edit → disk write → FS watcher → DB update → UI update → disk write → ...
```

**This system prevents that.**

---

## Architecture Overview

```
Terminal / Editor
   ↓
Disk write
   ↓
Chokidar watcher
   ↓
fsEventHandler 
   ↓
Database update
   ↓
UI sync
```
* FsEventHandler - [Link](../fsEventHandler/README.MD)
With suppression:

```
UI write
  ↓ (suppressed)
Disk write
  ✘ watcher ignored
```

---

## One Watcher Per Project

```ts
const projectWatchers = new Map<string, FSWatcher>();
```

### Why?

* Prevent duplicate events
* Reduce CPU & I/O usage
* Centralized lifecycle management

---

## ensureProjectWatcher()

```ts
export function ensureProjectWatcher(projectDir, projectId)
```

### Behavior

* If watcher already exists → return it
* Otherwise:

  * Start a new watcher
  * Store it in memory
  * Log creation

### Used when:

* First terminal opens
* Project becomes active

---

## stopProjectWatcher()

```ts
export function stopProjectWatcher(projectId)
```

### Behavior

* Gracefully stops the watcher
* Removes it from memory

### Used when:

* Last terminal closes
* Project fully unloads

This prevents:

* Zombie watchers
* Memory leaks
* Unnecessary DB writes

---

## Filesystem Watcher Configuration

```ts
chokidar.watch(projectDir, {
  ignoreInitial: true,
  persistent: true,
  depth: 99,
  ignored: [
    "**/node_modules/**",
    "**/.git/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
  ],
});
```

### Key Choices

| Option          | Reason                |
| --------------- | --------------------- |
| `ignoreInitial` | Avoid initial flood   |
| `depth: 99`     | Support deep projects |
| `ignored`       | Performance + sanity  |

---

## Event Handling Pipeline

Each filesystem event:

1. Normalizes absolute path
2. Checks suppression registry
3. Dispatches to event handler

### File Events

| Event    | Handler            |
| -------- | ------------------ |
| `add`    | `handleFileCreate` |
| `change` | `handleFileUpdate` |
| `unlink` | `handleFileDelete` |

### Folder Events

| Event       | Handler              |
| ----------- | -------------------- |
| `addDir`    | `handleFolderCreate` |
| `unlinkDir` | `handleFolderDelete` |

---

## FsSuppressionRegistry – Echo Prevention

### Purpose

Prevents filesystem watcher from reacting to **UI-originated writes**.

This is the **key to stable real-time sync**.

---

## How Suppression Works

### When UI writes a file

```ts
Sup.suppress(absPath);
```

### Shortly after, watcher fires

```ts
Sup.isSuppressedOrParent(absPath) === true
```

→ Event ignored

### After TTL expires

Events are processed normally again.

---

## Suppression Registry Design

```ts
private map = new Map<string, number>();
private ttl = 500ms;
```

* Stores **absolute normalized paths**
* TTL-based auto-cleanup
* Covers parent directories too

---

## Methods Explained

### suppress(absPath)

Registers a path for suppression.

Used when:

* UI saves a file
* UI creates folders
* Bulk operations occur

---

### isSuppressed(absPath)

Checks **exact path match**.

Rarely used directly.

---

### isSuppressedOrParent(absPath)

Checks:

* Exact path
* Any suppressed parent directory

This is critical for:

* Folder creation
* Recursive writes

---

### remove(absPath)

Manual unsuppress (rare).

---

### clear()

Wipes suppression map (used on resets).

---

## Why Parent Suppression Matters

Example:

```
UI creates folder: /src/components
```

Without parent suppression:

```
addDir /src/components
add /src/components/Button.tsx
add /src/components/Card.tsx
```

With parent suppression:
✔ All ignored correctly

---

## Safety & Performance Guarantees

* ✅ No infinite loops
* ✅ No duplicate DB writes
* ✅ No watcher storms
* ✅ Auto-cleanup via TTL
* ✅ Low memory overhead

---

## Architectural Role

```
UI writes        Terminal writes
   │                 │
   ▼                 ▼
Sup.suppress      FS event
   │                 │
   ✘ watcher ignore   ✔ watcher process
```

This makes **bi-directional sync stable**.

---
