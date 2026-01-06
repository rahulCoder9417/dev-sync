# Terminal Controller & Disk File System Documentation

## Overview
The terminal controller manages the synchronization of database-stored project files to the file system. It handles project initialization, file tree reconstruction, and Cloudinary media file downloads for terminal/IDE access.

---

## Core Functionality

### Purpose
Converts database-stored project structure into actual files and folders on disk, enabling:
- Terminal access to project files
- IDE/editor functionality
- Build tool execution
- Git operations
- File system-based development workflows

---

## File Structure

### Base Directory
```typescript
const PROJECTS_BASE_DIR = path.join(process.cwd(), "projects");
```

**Layout:**
```
projects/
├── project-id-1/
│   ├── project-name/          ← Actual project files
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── fileMap.json           ← ID → Path mapping
├── project-id-2/
│   └── ...
```

---

## Supported Media Files

### File Extensions by Category

```typescript
const SUPPORTED_EXTS = {
  images: ["png", "jpg", "jpeg", "gif", "webp"],
  videos: ["mp4", "mov", "webm"],
  audio: ["mp3", "wav", "ogg"],
  docs: ["pdf"]
};
```

**Purpose:** These files require special handling (binary download from Cloudinary)

---

## Key Functions

### 1. `isSupportedMediaFile(filename: string): boolean`

**Purpose:** Determines if a file is a binary media file that needs downloading

**Logic:**
```typescript
const ext = filename.split(".").pop()?.toLowerCase() || "";
return [...SUPPORTED_EXTS.images, ...SUPPORTED_EXTS.videos, 
        ...SUPPORTED_EXTS.audio, ...SUPPORTED_EXTS.docs].includes(ext);
```

**Returns:** `true` if file is a supported media type

**Example:**
```typescript
isSupportedMediaFile("logo.png")      // true
isSupportedMediaFile("video.mp4")     // true
isSupportedMediaFile("index.js")      // false
isSupportedMediaFile("document.pdf")  // true
```

---

### 2. `downloadFile(url: string): Promise<Buffer>`

**Purpose:** Downloads binary files from Cloudinary

**Implementation:**
```typescript
async function downloadFile(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}
```

**Parameters:**
- `url`: Cloudinary URL (e.g., `https://res.cloudinary.com/...`)

**Returns:** Binary buffer of file contents

**Use Case:** When file content in database is a Cloudinary URL instead of actual content

---

### 3. `buildFileTree(files: any[]): any[]`

**Purpose:** Converts flat database array into hierarchical tree structure

**Input Format:**
```typescript
[
  { id: "1", name: "src/", type: "folder", parentId: null },
  { id: "2", name: "index.ts", type: "file", parentId: "1", content: "..." },
  { id: "3", name: "package.json", type: "file", parentId: null, content: "..." }
]
```

**Output Format:**
```typescript
[
  {
    id: "1",
    name: "src/",
    type: "folder",
    children: [
      { id: "2", name: "index.ts", type: "file", content: "...", children: [] }
    ]
  },
  { id: "3", name: "package.json", type: "file", content: "...", children: [] }
]
```

**Algorithm:**
1. Creates a `Map` with all files by ID
2. Adds empty `children` array to each node
3. Links children to parents via `parentId`
4. Separates root-level folders and files
5. Returns folders first, then files

**Ordering:**
- **Within folders:** Folders first (unshift), files last (push)
- **At root:** Folders first, files last

---

### 4. `createFileMap(files: any[], basePath: string, projectId: string): Promise<void>`

**Purpose:** Recursively creates actual files and folders on disk, maintaining ID-to-path mapping

**Key Features:**

#### A. File Structure Creation
Nested recursive function that traverses the file tree:

```typescript
async function createFileStructure(
  files: any[],
  basePath: string,
  currentPath: string = ""
): Promise<void> {
  for (const file of files) {
    const filePath = path.join(basePath, currentPath, file.name);
    
    if (file.type === "folder") {
      await fs.mkdir(filePath, { recursive: true });
      fileMap[file.id] = filePath;
      
      if (file.children && file.children.length > 0) {
        await createFileStructure(
          file.children,
          basePath,
          path.join(currentPath, file.name)
        );
      }
    } else {
      // Handle file creation (see below)
      fileMap[file.id] = filePath;
    }
  }
}
```

#### B. File Type Handling

**Media Files (Binary):**
```typescript
if (isSupportedMediaFile(file.name) && 
    file.content?.startsWith("http") && 
    file.content.includes("res.cloudinary.com")) {
  const buffer = await downloadFile(file.content);
  await fs.writeFile(filePath, buffer);
}
```

**Text Files:**
```typescript
else {
  await fs.writeFile(filePath, file.content || "", "utf8");
}
```

#### C. File Map Persistence

**Purpose:** Maintains mapping between database IDs and file system paths

```typescript
await fs.writeFile(
  path.join(PROJECTS_BASE_DIR, projectId, "fileMap.json"),
  JSON.stringify(fileMap)
);
```

**fileMap.json Example:**
```json
{
  "file-id-1": "/usr/src/app/projects/proj-123/my-app/src",
  "file-id-2": "/usr/src/app/projects/proj-123/my-app/src/index.ts",
  "file-id-3": "/usr/src/app/projects/proj-123/my-app/package.json"
}
```

**Usage:** Enables reverse lookup (ID → Path) for file operations

---

### 5. `loadProjectIntoDisk(projectId: string, authCheck: boolean, userId?: string)`

**Purpose:** Main orchestrator function that loads entire project onto disk

#### Step 1: Check Existing Project

```typescript
try {
  const items = await fs.readdir(
    path.join(PROJECTS_BASE_DIR, projectId), 
    { withFileTypes: true }
  );
  
  const folder = items.find((i) => i.isDirectory());
  
  return {
    status: "exists",
    projectDir: path.join(PROJECTS_BASE_DIR, projectId, folder?.name),
    projectName: folder.name
  };
} catch {
  // Project doesn't exist, continue to create it
}
```

**Early Return:** If project already exists on disk, skip database query

---

#### Step 2: Fetch Project from Database

```typescript
const project = await db.project.findUnique({
  where: { id: projectId },
  select: {
    id: true,
    name: true,
    ownerId: true,
    team: {
      select: {
        members: { select: { userId: true } }
      }
    },
    files: {
      select: {
        id: true,
        name: true,
        type: true,
        content: true,
        parentId: true
      }
    }
  }
});

if (!project) throw new Error("Project not found.");
```

**Includes:**
- Project metadata (id, name, owner)
- Team members (for authorization)
- Complete file tree (flattened)

---

#### Step 3: Authorization Check

```typescript
if (authCheck) {
  const isOwner = project.ownerId === userId;
  const isTeamMember = project.team?.members.some(m => m.userId === userId);

  if (!isOwner && !isTeamMember) {
    throw new Error("Unauthorized access.");
  }
}
```

**Authorization Logic:**
- User must be project owner **OR**
- User must be team member

**Note:** `authCheck` can be disabled for internal system operations

---

#### Step 4: Create Project Directory

```typescript
const projectDir = path.join(PROJECTS_BASE_DIR, projectId, project.name);
await fs.mkdir(projectDir, { recursive: true });
```

**Directory Structure Created:**
```
projects/
└── {projectId}/
    └── {project.name}/    ← Working directory
```

---

#### Step 5: Build and Persist File Tree

```typescript
const fileTree = buildFileTree(project.files);
await createFileMap(fileTree, projectDir, projectId);
```

**Actions:**
1. Converts flat file list to tree
2. Creates all folders and files
3. Downloads Cloudinary media files
4. Writes fileMap.json

---

#### Step 6: Return Result

```typescript
return {
  status: "created",
  projectDir,
  projectName: project.name
};
```

**Response:**
- `status`: "exists" or "created"
- `projectDir`: Absolute path to project working directory
- `projectName`: Human-readable project name

---

## API Controller

### `initializeTerminalProject(req, res)`

**Purpose:** Express route handler for project initialization

**Endpoint:**
```
POST /api/terminal/saveFile
```

**Request Body:**
```typescript
{
  projectId: string,  // Required
  userId: string      // Required for authorization
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "success": true,
  "status": "created",
  "projectDir": "/usr/src/app/projects/proj-123/my-app",
  "projectName": "my-app"
}
```

**Error Response (400 - Missing projectId):**
```json
{
  "ok": false,
  "error": "projectId is required"
}
```

**Error Response (500 - General Error):**
```json
{
  "ok": false,
  "error": "Project not found."
}
```

---

## Router Configuration

```typescript
import { Router } from "express";
import { initializeTerminalProject } from "../controller/diskFileSave.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

router.post("/terminal/saveFile", initializeTerminalProject);

export default router;
```

**Routes:**
- `GET /api/ping`: Health check
- `POST /api/terminal/saveFile`: Initialize project on disk

---

## Use Cases

### 1. Terminal Access
User opens integrated terminal → System calls `loadProjectIntoDisk` → Files created on disk → Terminal session starts in `projectDir`

### 2. Build Process
User runs `npm run build` → Build tools access actual files → Output written to disk

### 3. Git Operations
User runs `git init` → Git operates on physical files in `projectDir`

### 4. IDE Integration
External IDE connects → Reads files from `projectDir` → Changes synced back to database

---

## File Handling Strategies

### Text Files
```typescript
// Directly write content from database
await fs.writeFile(filePath, file.content || "", "utf8");
```

**Examples:** .js, .ts, .json, .md, .txt, .css, .html

---

### Media Files (Cloudinary)
```typescript
// Download binary data from Cloudinary
if (file.content?.startsWith("http") && 
    file.content.includes("res.cloudinary.com")) {
  const buffer = await downloadFile(file.content);
  await fs.writeFile(filePath, buffer);
}
```

**Examples:** .png, .jpg, .mp4, .pdf

**Database Storage:** URL string (e.g., `https://res.cloudinary.com/...`)

**Disk Storage:** Binary file content

---

## Error Handling

### Project Not Found
```typescript
if (!project) throw new Error("Project not found.");
```

**Scenario:** Invalid `projectId` provided

---

### Unauthorized Access
```typescript
if (!isOwner && !isTeamMember) {
  throw new Error("Unauthorized access.");
}
```

**Scenario:** User tries to access project they're not authorized for

---

### File System Errors
Handled by Express error middleware:
```typescript
catch (e: any) {
  console.error(e);
  return res.status(500).json({
    ok: false,
    error: e.message || "Failed to load project"
  });
}
```

**Scenarios:**
- Disk full
- Permission issues
- Invalid file paths
- Network errors (Cloudinary download failures)

---

## Performance Considerations

### 1. Lazy Loading
Projects only created on disk when accessed via terminal/IDE, not on every file edit

### 2. Existence Check
Quick filesystem check before expensive database query:
```typescript
try {
  const items = await fs.readdir(...);
  return { status: "exists", ... };  // Skip DB query
} catch {
  // Continue to database query
}
```

### 3. Async Operations
All file operations use async/await for non-blocking I/O

### 4. Recursive Directory Creation
```typescript
await fs.mkdir(filePath, { recursive: true });
```

Creates all parent directories in one call

---

## Security Considerations

### 1. Path Traversal Prevention
All paths constructed using `path.join()` to prevent `../` attacks

### 2. Authorization Layer
`authCheck` parameter enforces ownership/membership validation

### 3. Project Isolation
Each project in separate subdirectory: `projects/{projectId}/{projectName}/`

### 4. Cloudinary URL Validation
Checks for `res.cloudinary.com` domain before downloading

---

## File Map System

### Purpose
Bidirectional mapping between database IDs and file system paths

### Storage
```
projects/{projectId}/fileMap.json
```

### Format
```json
{
  "db-file-id-123": "/full/path/to/file.ts",
  "db-folder-id-456": "/full/path/to/folder"
}
```

### Usage
- **File Operations:** Given ID, find path for read/write
- **Sync Operations:** Update correct file when database changes
- **Reverse Lookup:** Find ID from path for database updates

### Note
Comment mentions reverse map (Path → ID) maintained in-memory by `filePathCrud.ts` (not persisted to disk)

---

## Integration with Other Systems

### WebSocket Sync
When files change via web editor, WebSocket messages can trigger disk updates using file map

### Terminal Handler
Terminal sessions use `projectDir` as working directory

### Preview System
Build outputs in `projectDir` are served by preview reverse proxy

---

## Database Schema (Inferred)

```prisma
model Project {
  id       String
  name     String
  ownerId  String
  team     Team?
  files    File[]
}

model Team {
  members  TeamMember[]
}

model TeamMember {
  userId   String
}

model File {
  id        String
  name      String
  type      String      // "file" | "folder"
  content   String?
  parentId  String?
  projectId String
}
```

---

## Example Flow

**Scenario:** User opens terminal for first time

1. **Frontend Request:**
```typescript
POST /api/terminal/saveFile
{
  "projectId": "proj-123",
  "userId": "user-456"
}
```

2. **Check Disk:**
```typescript
fs.readdir("projects/proj-123")  // throws error (doesn't exist)
```

3. **Fetch from Database:**
```sql
SELECT * FROM Project WHERE id = 'proj-123' 
  INCLUDE files, team.members
```

4. **Authorize:**
```typescript
isOwner || isTeamMember  // ✅ true
```

5. **Create Structure:**
```bash
mkdir -p projects/proj-123/my-app/src
touch projects/proj-123/my-app/src/index.ts
# Download logo.png from Cloudinary
```

6. **Write File Map:**
```json
{
  "file-1": "/usr/src/app/projects/proj-123/my-app/src",
  "file-2": "/usr/src/app/projects/proj-123/my-app/src/index.ts"
}
```

7. **Response:**
```json
{
  "ok": true,
  "success": true,
  "status": "created",
  "projectDir": "/usr/src/app/projects/proj-123/my-app",
  "projectName": "my-app"
}
```

8. **Terminal Starts:**
```bash
cd /usr/src/app/projects/proj-123/my-app
# User can now run npm install, git init, etc.
```