# FileExplorer & TreeNode Components Documentation

## Overview
These components work together to provide a file tree interface with real-time collaboration features. **FileExplorer** manages the overall file tree state and operations, while **TreeNode** renders individual nodes recursively with context menus and inline editing.

---

## FileExplorer Component

### Props

| Prop | Type | Description |
|------|------|-------------|
| `files` | `FileNode[]` | Root-level file tree structure |
| `canMakeChanges` | `boolean` | Whether user has permission to modify files |
| `setFiles` | `React.Dispatch<React.SetStateAction<FileNode[]>>` | State setter for file tree |
| `errorMarkers` | `Record<string, boolean> \| null` | Map of file IDs with syntax errors |
| `tabs` | `Tab[]` | Currently open editor tabs |
| `onFileSelect` | `(file: FileNode) => void` | Handler for opening files in editor |
| `onTabClose` | `(fileId: string) => void` | Handler for closing tabs |
| `projectId` | `string` | Unique project identifier |
| `setTabs` | `React.Dispatch<React.SetStateAction<Tab[]>>` | State setter for tabs |
| `sendMessage` | `(message: string, projectId: string, fileId: string \| undefined, data: any) => void` | WebSocket message sender |
| `setdeletionMenu` | `(menu: any) => void` | Setter for deletion confirmation UI |

---

### State Management

#### Local State
- **`rootAction`**: Tracks action being performed at root level (new file/folder)
- **`expandedFolders`**: Set of folder IDs currently expanded in tree
- **`contextMenu`**: Position and context data for right-click menu
- **`resourceTargetId`**: Target folder ID for resource uploads (images, PDFs)
- **`isFileAction`**: Tracks current file operation being performed
- **`adminMenu`**: ID of file whose admin change menu is open

#### Redux State
- **`userInfo`**: Current user information (from `state.user`)
- **`fileOp`**: Queue of file operations from collaborators (from `state.collabCodeFileOp`)

---

### Core Workflows

#### 1. **File/Folder Creation** (`handleCreate`)

**Trigger:** User creates new file/folder via context menu or root action

**Steps:**
1. Generates unique ID using `cuid()`
2. Creates `newNode` object with metadata
3. **Root level creation**: Directly updates `files` state
   - Files append to end
   - Folders prepend to start
4. **Nested creation**: Dispatches `addFileOp` Redux action (optimistic update)
5. Calls API endpoint `/api/projects/fileItem/create`
6. Broadcasts `"fileOp"` message with type `"create"` to collaborators
7. **Error handling**: Rolls back by dispatching `delete` operation

**API Request:**
```typescript
POST /api/projects/fileItem/create
{
  id: string,
  type: "file" | "folder",
  name: string,
  projectId: string,
  parentId: string | null
}
```

---

#### 2. **File/Folder Renaming** (`handleRename`)

**Trigger:** User selects "Rename" from context menu

**Steps:**
1. Dispatches optimistic `rename` Redux action
2. Calls API endpoint `/api/projects/fileItem/rename`
3. Broadcasts `"fileOp"` message with type `"rename"`
4. **Error handling**: Rolls back by dispatching `rename` with old name

**API Request:**
```typescript
PUT /api/projects/fileItem/rename
{
  id: string,
  name: string
}
```

---

#### 3. **File Deletion** (`handleDelete`)

**Trigger:** User selects "Delete" from context menu

**Steps:**
1. Broadcasts `"vote_delete"` message (triggers voting system for team confirmation)
2. Includes user's full name and file name in message data

**Note:** Actual deletion is handled by server response, which triggers a `delete` fileOp

---

#### 4. **Resource Upload** (`handleResourseUpload`)

**Purpose:** Upload binary files (images, PDFs, videos) to Cloudinary

**Trigger:** User selects "Upload Resource" and chooses file

**Steps:**
1. Determines resource type from file extension (image/video/PDF)
2. Creates `FormData` with file, filename, resourceType, projectId
3. Sends to `/api/cloudinaryUpload` endpoint
4. Creates new file node with Cloudinary URL as content
5. Saves file content via `/api/projects/fileItem/updateContent`
6. Dispatches `save` Redux action
7. Broadcasts `"fileSave"` message to collaborators

**Supported Resource Types:**
- **Images**: jpg, jpeg, png, gif, webp, svg
- **Videos**: mp4, webm, ogg
- **Documents**: pdf

---

#### 5. **File Operations Processor** (Redux Effect)

**Purpose:** Apply file operations from collaborators in real-time

**Trigger:** `fileOp` state changes (operations queued by WebSocket messages)

**Supported Operations:**
| Type | Action |
|------|--------|
| `rename` | Updates node name in tree and open tabs |
| `create` | Adds new node to tree |
| `delete` | Removes node from tree and closes associated tab |
| `save` | Updates file content in tree and marks tab as clean |

**Processing Logic:**
```typescript
fileOp.forEach((item) => {
  switch (item.type) {
    case "rename":
      newTree = renameNodeInTree(newTree, item.id, item.name, tabs);
      break;
    case "create":
      newTree = addNodeToTree(newTree, item.id, item.newNode);
      break;
    case "delete":
      onTabClose(item.id);
      newTree = removeNodeFromTree(newTree, item.id)[0];
      break;
    case "save":
      setTabs(prev => prev.map(t =>
        t.id === item.id ? { ...t, content: item.content, isDirty: false } : t
      ));
      newTree = saveNode(newTree, item.id, item.content);
      break;
  }
  dispatch(consumeFileOp({ projectId }));
});
```

---

### Context Menu System

#### Opening Context Menu
**Trigger:** Right-click on file/folder or click "+" button

**Context Data:**
```typescript
{
  nodeType: "file" | "folder",
  parentNodeId: string | null,
  nodeId: string,
  isUserAdmin: boolean,
  nodeName: string,
  x: number, // Mouse X position
  y: number  // Mouse Y position
}
```

#### Menu Actions
| Action | Available For | Behavior |
|--------|--------------|----------|
| New File | Folders, Root | Creates file in folder |
| New Folder | Folders, Root | Creates folder in folder |
| Upload Resource | Folders, Root | Opens file picker for binary uploads |
| Rename | Files, Folders | Enables inline rename input |
| Delete | Files, Folders | Triggers vote_delete |
| Change Admin | Files with collaborators | Opens admin transfer menu |

#### Outside Click Detection
Context menu closes when clicking outside, detected via ref:
```typescript
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
      setContextMenu(null);
    }
  };
  if (contextMenu) {
    window.addEventListener('click', handleClickOutside);
  }
  return () => window.removeEventListener('click', handleClickOutside);
}, [contextMenu]);
```

---

### Helper Service: `fileApiService`

Encapsulates API calls for file operations:

```typescript
fileApiService.renameFile(nodeId: string, newName: string)
fileApiService.createFile(id: string, type: string, name: string, projectId: string, parentId: string | null)
```

---

## TreeNode Component

### Props

| Prop | Type | Description |
|------|------|-------------|
| `node` | `FileNode` | Current node data (file or folder) |
| `depth` | `number` | Nesting level (for indentation) |
| `canMakeChanges` | `boolean` | Whether user can edit files |
| `expandedFolders` | `Set<string>` | Set of expanded folder IDs |
| `adminMenu` | `string \| null` | ID of node with admin menu open |
| `setAdminMenu` | `(id: string \| null) => void` | Admin menu state setter |
| `sendMessage` | WebSocket sender | Collaboration message sender |
| `onToggle` | `(id: string) => void` | Toggle folder expand/collapse |
| `actionHandler` | `(action, nodeId?, name?, oldName?) => void` | Handles rename/create actions |
| `onSelect` | `(node: FileNode) => void` | File selection handler |
| `errorMarkers` | `Record<string, boolean> \| null` | Syntax error flags |
| `setIsFileAction` | State setter | Triggers action on this node |
| `isFileAction` | Action state | Current action being performed |
| `onContextMenu` | Context menu handler | Opens context menu |
| `projectId` | `string` | Project identifier |

---

### State Management

#### Local State
- **`action`**: Current action being performed on this node (`"rename"`, `"file"`, `"folder"`, `"delete"`, etc.)
- **`isUserAdmin`**: Whether current user is admin of this file (first collaborator)
- **`bg`**: Background highlight state (for error indicators)

#### Redux State
- **`user`**: Current user ID
- **`collaboratorsMap`**: Map of collaborators on this file (from `state.collabCodeUser`)

---

### Visual Features

#### Indentation & Tree Lines
```typescript
const paddingLeft = depth * 16 + 8;  // Horizontal indentation
const left = depth * 16 + 12;        // Position for vertical tree line
```

- Each nesting level adds 16px padding
- Vertical line drawn using absolute positioning at `left` pixels

#### Icons
- **Folders**: 
  - `ChevronRight` when collapsed
  - `ChevronDown` when expanded
  - `Folder` icon (brand color)
- **Files**: Dynamic icon from `getFileIcon(node.name)` based on extension

#### Background Colors
- **Hover**: `hover:bg-primary`
- **Active/Selected**: `bg-[#151728]` (when `bg` is true)
- **Error**: `bg-[#ff2929ca]` (when syntax errors present)

---

### Interaction Handlers

#### Click Behavior (`handleClick`)
- **Folders**: Toggle expand/collapse
- **Files**: Select and open in editor
- **Blocked**: When action is in progress (renaming, creating)

#### Context Menu (`handleContext`)
- **Trigger**: Right-click
- **Blocked**: If action in progress or `!canMakeChanges`
- **Data passed**: Node type, ID, parent ID, name, isUserAdmin

---

### Inline Editing (InputBox)

**Renders when:**
- `action === "rename"`: User is renaming node
- `action === "file"` or `action === "folder"`: User is creating child node

**Component behavior:**
```tsx
<InputBox
  id={node.id}
  type={action}  // "rename", "file", or "folder"
  Name={action === "rename" ? node.name : ""}
  setAction={setAction}
  handleNameConfirm={(name: string) => handactions(name)}
/>
```

**Confirmation flow:**
1. User types name and presses Enter
2. `handactions()` calls `actionHandler()` from parent
3. Resets `action` state
4. Updates `isFileAction` to null

---

### Collaborator Display

**Collaborators Component** shows:
- Avatar badges of users currently viewing/editing file
- For folders: Aggregates collaborators from all child files
- Admin badge for first collaborator

**Admin Change Menu:**
When `adminMenu === node.id`, renders `ChangeAdmin` component:
```tsx
<ChnageAdmin
  projectId={projectId}
  fileId={node.id}
  setAction={setAction}
  sendMessage={sendMessage}
  setAdminMenu={setAdminMenu}
/>
```

---

### Recursive Rendering

Folders render their children recursively:
```tsx
{node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
  <div className="relative">
    {/* Vertical tree line */}
    <span className="absolute top-0 h-full w-[1px] bg-[#292f52]" style={{ left: `${left}px` }} />
    
    {/* InputBox for creating child nodes */}
    {(action === "file" || action === "folder") && (
      <InputBox ... />
    )}
    
    {/* Child nodes */}
    {node.children.map(child => (
      <TreeNodeMemo ... depth={depth + 1} />
    ))}
  </div>
)}
```

---

### Performance Optimization

#### Custom Memoization (`propsAreEqual`)

Prevents re-renders when props haven't meaningfully changed:

```typescript
const propsAreEqual = (prev: Props, next: Props) => {
  return prev.node.id === next.node.id
    && prev.node.name === next.node.name
    && prev.expandedFolders.size === next.expandedFolders.size
    && prev.errorMarkers?.[prev.node.id] == next.errorMarkers?.[next.node.id]
    && prev.depth === next.depth
    && prev.adminMenu === next.adminMenu
    && prev.node?.children === next.node?.children
    && prev.isFileAction?.id === next.isFileAction?.id
};
```

**Checked properties:**
- Node identity (ID, name)
- Expanded state
- Error markers
- Admin menu state
- Children reference (structural changes)
- Current action state

**Wrapped with:** `React.memo(TreeNodeInner, propsAreEqual)`

---

## Collaboration Features

### Real-time Operations
All file operations are broadcast to collaborators via WebSocket:
- **Creation**: `"fileOp"` with type `"create"`
- **Renaming**: `"fileOp"` with type `"rename"`
- **Deletion**: `"vote_delete"` (team voting system)
- **Saving**: `"fileSave"` with content

### Optimistic Updates
File operations use optimistic updates via Redux:
1. Immediately update local state
2. Send API request
3. Broadcast to collaborators
4. Rollback on error

### Admin System
- **First collaborator** on a file is the admin
- Admin can transfer ownership via "Change Admin" menu
- Non-admins see collaborators but no admin menu

---

## Error Handling

### API Failures
All API calls wrapped in try-catch with toast notifications:
```typescript
try {
  await fileApiService.renameFile(nodeId, newName);
  sendMessage("fileOp", ...);
} catch (error) {
  showToast(false, "Error renaming node -> Pls try Again " + error.message);
  // Rollback optimistic update
  dispatch(addFileOp({ type: "rename", name: oldName, ... }));
}
```

### Upload Failures
When resource upload fails, creates `.txt` file with error message:
```typescript
if (uploadRes.success) {
  obj = { path: filename, type: "file", content: uploadRes.data };
} else {
  obj = { 
    path: filename.replace(/\.[^/.]+$/, "") + ".txt",
    content: `Upload failed: ${uploadRes.error}`
  };
}
```

---

## UI Structure

### FileExplorer Layout
```
┌─────────────────────────────────┐
│ Explorer              [+ Button]│ ← Header with new file/folder button
├─────────────────────────────────┤
│ 📁 src/                         │
│   📄 index.ts                   │ ← TreeNode (recursive)
│   📁 components/                │
│     📄 Button.tsx               │
│ 📄 README.md                    │
└─────────────────────────────────┘
```

### Context Menu (Absolute Positioned)
```
┌────────────────┐
│ New File       │
│ New Folder     │
│ Upload Resource│
│ Rename         │
│ Delete         │
│ Change Admin   │ ← Only for admins
└────────────────┘
```

---

## Usage Example

```tsx
<FileExplorer
  files={fileTree}
  canMakeChanges={true}
  setFiles={setFileTree}
  errorMarkers={errorState}
  tabs={openTabs}
  onFileSelect={handleFileSelect}
  onTabClose={handleTabClose}
  projectId="project-123"
  setTabs={setOpenTabs}
  sendMessage={websocketSend}
  setdeletionMenu={setDeletionDialog}
/>
```

---

## Key Dependencies

- **UI Components**: `lucide-react` icons, custom `Button`, `InputBox`
- **State Management**: Redux (`collabCodeFileOp`, `collabCodeUser`, `user` slices)
- **Utilities**: 
  - `cuid`: Unique ID generation
  - `getFileIcon()`: Icon mapping by file extension
  - `getResourceType()`: Determines Cloudinary resource type
  - Tree operations: `renameNodeInTree()`, `addNodeToTree()`, `removeNodeFromTree()`
- **Services**: Cloudinary upload, custom `fileApiService`