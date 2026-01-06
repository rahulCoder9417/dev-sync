
---

# `getRealProjectDir` – Resolve Runtime Project Directory

## Overview

`getRealProjectDir` is a **runtime path resolver** that converts a `projectId` into the **actual executable project directory** on disk.

In your system:

```
projectId
   ↓
/projects/{projectId}/
   ↓
{projectName}/   ← real working directory
```

This utility abstracts that mapping and guarantees the **correct `cwd`** for:

* Terminal sessions
* Preview servers
* File watchers
* Build & run commands

---

## Why This Function Exists

Your platform uses a **two-layer project layout**:

1. **Outer folder** → identified by `projectId`
2. **Inner folder** → actual project source (named after repo / app)

This is intentional because:

* `projectId` is stable (DB identifier)
* `projectName` may change
* Multiple repos can share structure
* Prevents naming collisions

This function hides that complexity.

---

## Function Signature

```ts
export async function getRealProjectDir(
  baseDir: string,
  projectId: string
): Promise<string>
```

### Parameters

| Name        | Description                                            |
| ----------- | ------------------------------------------------------ |
| `baseDir`   | Root projects directory (e.g. `/usr/src/app/projects`) |
| `projectId` | Database ID for the project                            |

---

## Execution Flow

### 1. Validate Input

```ts
if (!projectId) return;
```

Early exit to prevent invalid FS operations.

---

### 2. Resolve Project Root

```ts
root = path.join(baseDir, projectId);
```

This is the **project container directory**.

---

### 3. Lazy Project Reconstruction

```ts
catch {
  await FilePathCrud.loadProject(projectId);
}
```

If the directory doesn’t exist:

* Rebuild project from DB
* Materialize files to disk
* Then retry path resolution

This supports **serverless / ephemeral disks**.

---

### 4. Detect Actual Project Folder

```ts
const items = await fs.readdir(root, { withFileTypes: true });
const folder = items.find(i => i.isDirectory());
```

Assumption (by design):

* Exactly **one directory** exists inside the project root
* That directory is the real app (repo root)

---

### 5. Return Executable Path

```ts
return path.join(root, folder.name);
```

This is the path used as:

* `cwd` for terminals
* Server launch directory
* Watcher root

---

## Example

### Disk Layout

```
/projects/
  └── 9f2a1c/
      └── bookwise/
          ├── package.json
          ├── src/
          └── vite.config.ts
```

### Call

```ts
const cwd = await getRealProjectDir(
  "/usr/src/app/projects",
  "9f2a1c"
);
```

### Result

```ts
"/usr/src/app/projects/9f2a1c/bookwise"
```

---

## Failure Modes & Errors

| Scenario          | Behavior                 |
| ----------------- | ------------------------ |
| Missing project   | Auto-loaded from DB      |
| No inner folder   | Throws error             |
| Invalid projectId | Returns undefined        |
| Disk cleared      | Rehydrated automatically |

This ensures **self-healing runtime state**.

---

## Design Guarantees

* ✅ No hardcoded project names
* ✅ Works after container restarts
* ✅ Compatible with DB-backed file storage
* ✅ Safe for concurrent terminals
* ✅ Centralized path resolution

---

## What This Function Intentionally Does NOT Do

❌ Validate project ownership
❌ Handle multiple inner folders
❌ Create directories
❌ Cache results

Those concerns belong elsewhere.

---

## Architectural Context

```
DB (files)
   ↓
FilePathCrud.loadProject()
   ↓
Disk (/projects/projectId/projectName)
   ↓
getRealProjectDir()
   ↓
Terminal / Preview / Watcher
```

This function is the **bridge between persistence and execution**.

---