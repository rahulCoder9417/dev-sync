
---

# FileSystemService – Project File Map, Caching & Persistence

## Overview

`FileSystemService` is the **authoritative runtime service** responsible for mapping:

```
fileId  ⇄  absolute disk path
```

It solves a fundamental problem in collaborative systems:

> **Paths change, IDs must not.**

This service:

* Maintains a **bidirectional file map**
* Caches it in memory for speed
* Persists it to disk (`fileMap.json`)
* Automatically reloads projects on demand
* Debounces disk writes to avoid I/O storms

It is used by:

* FS watchers
* Terminal runtime
* File sync handlers
* Rename / delete logic
* Shutdown cleanup

---

## Why This Service Exists

Your architecture has these constraints:

* Disk is **ephemeral** (Render / containers)
* Database stores **file content**, not paths
* Runtime tools (terminal, watcher) work with **absolute paths**
* UI and DB work with **stable file IDs**

This service bridges that gap safely and efficiently.

---

## Core Data Structures

### ProjectFileMap (per project)

```ts
interface ProjectFileMap {
  projectId: string;
  fileMap: Record<fileId, absPath>;
  reverseMap: Record<absPath, fileId>;
  lastLoaded: Date;
  dirty: boolean;
}
```

### In-Memory State

```ts
cache: Map<projectId, ProjectFileMap>
saveQueue: Map<projectId, Timeout>
```

* **cache** → fast lookups, no DB/disk hits
* **saveQueue** → debounced persistence

---

## Disk Representation

Each project has:

```
/projects/{projectId}/fileMap.json
```

Example:

```json
{
  "cku1...": "/usr/src/app/projects/123/bookwise/src/index.ts",
  "cku2...": "/usr/src/app/projects/123/bookwise/package.json"
}
```

> Only `fileMap` is saved — `reverseMap` is rebuilt in memory.

---

## Project Loading Lifecycle

### `loadProject(projectId)`

```ts
async loadProject(projectId): Promise<ServiceResult<void>>
```

### What it does

1. **Fast path**
   If project is already cached → return immediately

2. **Ensure disk state**

   ```ts
   loadProjectIntoDisk(projectId, false)
   ```

   Reconstructs files from DB if needed

3. **Load `fileMap.json`**

4. **Build reverseMap**

5. **Cache project**

### Why this is lazy-loaded

* Saves memory
* Works in serverless environments
* Supports cold starts gracefully

---

## Path Resolution APIs

### `getFilePath(projectId, fileId)`

Resolves:

```
fileId → absolute path
```

Special case:

* `fileId === null` → returns **project root directory**
  (used for terminal `cwd`)

Internally calls `getRealProjectDir`.

---

### `getFileIdByPath(projectId, absPath)`

Resolves:

```
absolute path → fileId
```

Used heavily by:

* FS watcher
* Rename / delete handlers
* Terminal edits

---

## Create Mapping (CREATE)

### `setFilePath(projectId, fileId, absPath)`

Called when:

* File is created
* Folder is created

Actions:

* Update `fileMap`
* Update `reverseMap`
* Mark project as `dirty`
* Schedule debounced save

This is **non-blocking** and fast.

---

## Delete Mapping (DELETE)

### `deleteFilePath(projectId, fileId)`

Called when:

* File is deleted
* Folder is deleted

Actions:

* Remove mapping from both maps
* Mark dirty
* Schedule save

Safe even if path is missing.

---

## Rename Handling (RENAME)

### `renameFilePath(projectId, oldAbs, newAbs)`

This is one of the **most important functions**.

### What it supports

* File rename
* Folder rename
* Recursive child updates

### How it works

```ts
if (path.startsWith(oldAbs)) {
  replace(oldAbs → newAbs)
}
```

All affected paths are updated **atomically in memory**, then saved.

This guarantees:

* No broken children paths
* No partial renames

---

## Debounced Persistence

### Why debounce?

Without debounce:

* FS watcher → hundreds of writes
* Massive disk I/O
* Performance collapse

### Strategy

```ts
SAVE_DEBOUNCE_MS = 10s
```

* Every mutation schedules a save
* New mutation resets timer
* Only one disk write per burst

---

### `scheduleSave(projectId)`

* Clears existing timeout
* Schedules `saveProjectMap`

---

### `saveProjectMap(projectId)`

* Writes `fileMap.json`
* Clears dirty flag
* Logs success

This function is **never called directly** except via:

* debounce
* forceSave

---

## Shutdown Safety

### `forceSave(projectId)`

Used when:

* Terminal closes
* Project unloads
* Server shuts down

Guarantees:

* No data loss
* Pending debounce is flushed

---

### `unloadProject(projectId)`

* Force save
* Remove from cache
* Free memory

This pairs perfectly with:

* `stopProjectWatcher`
* Terminal cleanup logic

---

## Observability & Debugging

### `getCacheStats()`

Returns:

```ts
{
  totalProjects,
  totalFiles,
  dirtyProjects,
  pendingSaves
}
```

Very useful for:

* Health checks
* Debug dashboards
* Leak detection

---

## Global Cleanup

### `cleanup()`

Used during:

* Process shutdown
* Container recycle
* Fatal errors

Actions:

1. Force-save all projects
2. Clear cache
3. Clear save queue

This is **production-grade hygiene**.

---

## Error Handling Philosophy

* Errors are **returned**, not thrown
* Disk errors are logged
* Runtime continues safely
* Corruption risk minimized

This is correct for infra-level services.

---

## Architectural Position

```
DB (file content)
   ↓
loadProjectIntoDisk
   ↓
FileSystemService
   ├── fileId ↔ path
   ├── watcher
   ├── terminal
   └── preview server
```

This service is the **glue** between persistence and execution.

---
