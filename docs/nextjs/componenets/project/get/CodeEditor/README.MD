# CodeEditor Component Documentation

## Overview
`CodeEditor.tsx` is the main collaborative code editor component that integrates Monaco Editor with Yjs for real-time collaboration. It manages multiple file tabs, synchronization between users, and editor state.

---

## Component Props

| Prop | Type | Description |
|------|------|-------------|
| `isTeam` | `boolean` | Whether the editor is in team collaboration mode |
| `tabs` | `Tab[]` | Array of open file tabs |
| `setErrorMarkers` | `(errorMarkers: any) => void` | Function to update error markers for syntax errors |
| `errorMarkers` | `Record<string, boolean> \| null` | Map of tab IDs to their error states |
| `sendMessage` | `(message: string, projectId: string, fileId: string \| undefined, data?: any) => boolean` | WebSocket message sender for collaboration |
| `setTabs` | `React.Dispatch<React.SetStateAction<Tab[]>>` | State setter for tabs |
| `setFiles` | `React.Dispatch<React.SetStateAction<FileNode[]>>` | State setter for file tree |
| `onTabClose` | `(tabId: string) => void` | Handler for closing tabs |
| `onTabSelect` | `(tab: Tab) => void` | Handler for selecting tabs |
| `projectId` | `string` | Unique identifier for the current project |

---

## State Management

### Local State
- **`tabToClose`**: Tracks which tab is pending closure (for save confirmation dialog)
- **`readOnly`**: Whether the editor is in read-only mode (non-owners in collaboration)
- **`isFirstSync`**: Tracks first synchronization for each tab to prevent duplicate sync requests
- **`forceRenderEditor`**: Toggle to force editor re-render when needed

### Refs
- **`editorRef`**: Reference to Monaco editor instance
- **`monacoRef`**: Reference to Monaco API
- **`pendingScrollRef`**: Stores scroll position to restore after editor mount
- **`bindingRef`**: Reference to MonacoBinding (connects Yjs to Monaco)
- **`activeTabRef`**: Reference to current active tab (avoids stale closures)
- **`silentMode`**: Flag to prevent outgoing updates during initialization
- **`updateHandlerRef`**: Reference to Yjs update handler for cleanup
- **`MonacoBindingRef`**: Reference to MonacoBinding class (loaded dynamically)

---

## Custom Hooks

### `useYjsDocument()`
Manages Yjs documents and awareness for each file tab.

**Returns:**
- `docsRef`: Map of tab IDs to Y.Doc instances
- `awarenessMap`: Map of tab IDs to awareness instances (cursor/selection tracking)
- `docRef`: Current active document reference
- `getOrCreateDoc(tabId)`: Gets or creates a Y.Doc for a tab
- `getOrCreateAwareness(tabId)`: Gets or creates awareness for a tab

### `useEditorSave()`
Handles file saving logic.

**Returns:**
- `handleSave()`: Saves current file content to backend and syncs with collaborators

### `useRemoteDecorations()`
Manages visual decorations for remote users' cursors and selections.

**Returns:**
- `decorationsRef`: Collection of active decorations
- `updateRemoteDecorations()`: Updates cursor/selection decorations

### `useCollabSync()`
Handles incoming WebSocket messages for collaboration (Yjs updates, awareness, file saves).

---

## Key Workflows

### 1. **Editor Initialization** (`handleEditorMount`)

```typescript
handleEditorMount(editor, monaco)
```

**Steps:**
1. Gets or creates Yjs document for active tab
2. Creates Monaco model from Yjs text content
3. Registers `Ctrl/Cmd+S` keybinding for saving
4. Creates MonacoBinding to sync Yjs ↔ Monaco
5. Initializes awareness for cursor/selection tracking
6. Sets up error marker tracking
7. Applies theme (read-only vs normal)
8. Attaches event listeners for cursor, selection, and scroll changes

**Event Listeners:**
- **`onDidChangeCursorPosition`**: Broadcasts cursor position to collaborators
- **`onDidChangeCursorSelection`**: Broadcasts selection to collaborators
- **`onDidScrollChange`**: Broadcasts scroll position to collaborators
- **`onDidChangeMarkers`**: Detects syntax errors and updates error markers

---

### 2. **Tab Switching** (Active Tab Effect)

```typescript
useEffect(() => { ... }, [activeTab?.id])
```

**Steps:**
1. Destroys previous MonacoBinding
2. Gets or creates Yjs document for new tab
3. Initializes Yjs text with file content if empty (in `silentMode` to prevent broadcast)
4. Updates `docRef` and `activeTabRef`

---

### 3. **Outgoing Yjs Updates** (Update Handler Effect)

```typescript
useEffect(() => { ... }, [readOnly, activeTab?.id, projectId, sendMessage])
```

**Triggers:** User types in the editor

**Steps:**
1. Listens for Yjs document updates
2. Skips if in `silentMode` or `readOnly`
3. Serializes update to `Uint8Array`
4. Sends update via WebSocket with message type `"YjsCodeChanges"`

**Message Format:**
```typescript
{
  type: "YjsCodeChanges",
  projectId: string,
  fileId: string,
  data: {
    data: number[], // Uint8Array as array
    updateType: "text"
  }
}
```

---

### 4. **Collaborator Role Management** (Collaborators Effect)

```typescript
useEffect(() => { ... }, [collaboratorsMap, activeTab?.id, isFirstSync, userId, readOnly])
```

**Purpose:** Determines if user is owner or viewer

**Logic:**
- **Owner** (first in `collaboratorsMap`): Can edit (`readOnly = false`)
- **Non-owner**: Read-only mode (`readOnly = true`)

**First Sync for Non-owners:**
When a non-owner first opens a file:
1. Destroys existing binding
2. Destroys and recreates Y.Doc (ensures clean state)
3. Clears Monaco model content
4. Creates new MonacoBinding
5. Sends `"sync"` message to request full document state from owner
6. Sets `isFirstSync` to prevent duplicate requests

---

### 5. **Saving Files** (`handleSave`)

**Trigger:** `Ctrl/Cmd+S` or "Save" button

**Steps:**
1. Exits if `readOnly` or no active tab
2. Converts Yjs text to string
3. Updates local tab and file tree state
4. Sends PUT request to `/api/projects/fileItem/updateContent`
5. Broadcasts `"fileSave"` message to collaborators

**Error Handling:**
Shows toast notification if API request fails

---

## Collaboration Features

### Real-time Synchronization
- **Operational Transformation**: Yjs handles concurrent edits with CRDTs
- **Awareness Protocol**: Tracks cursor positions, selections, and scroll for all users
- **WebSocket Messages**:
  - `YjsCodeChanges`: Text edits
  - `awareness`: Cursor/selection/scroll updates
  - `fileSave`: File save notifications
  - `sync`: Request full document state

### Read-only Mode
Non-owners see a blue-themed editor (`devsync-blue-dark`) and cannot edit. Cursor/selection/scroll events are not broadcast.

### Remote Decorations
Visual indicators show where collaborators are editing:
- Cursor position (vertical line)
- Selection range (highlighted background)

---

## UI Elements

### Tab Header
- Displays all open tabs
- Shows error indicators (red dot for syntax errors)
- Shows unsaved changes indicator (dot for `isDirty` tabs)
- Close button with save confirmation

### Editor Area
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Preview Mode**: For non-code files (images, PDFs) using `PreviewCloud` component
- **Empty State**: Message when no file is open

### Save Confirmation Dialog
Modal that appears when closing a tab with unsaved changes:
- **Save**: Saves and closes tab
- **Don't Save**: Closes tab without saving
- **Cancel**: Keeps tab open

---

## Configuration

### Monaco Options
```typescript
{
  fontFamily: "'Fira Code', monospace",
  fontSize: 14,
  minimap: { enabled: false },
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  readOnly: !isTeam || readOnly || !bindingRef.current
}
```

### Theme
- **Normal mode**: `vs-dark` (standard VS Code dark theme)
- **Read-only mode**: `devsync-blue-dark` (custom blue-tinted theme)

---

## Error Handling

### Syntax Errors
Monaco's built-in TypeScript/JavaScript diagnostics detect errors. The component:
1. Listens for marker changes
2. Filters for `Error` severity
3. Updates `errorMarkers` state with boolean flag per tab

### Save Errors
API failures show toast notifications via `showToast()` utility.

### Binding Cleanup
All effects properly clean up event listeners and destroy bindings to prevent memory leaks.

---

## Performance Optimizations

1. **Memoization**: Component wrapped in `React.memo` to prevent unnecessary re-renders
2. **Ref-based callbacks**: `activeTabRef` prevents stale closures in event handlers
3. **Selective re-rendering**: `forceRenderEditor` only toggles when necessary
4. **Lazy loading**: MonacoBinding loaded dynamically on mount
5. **Silent mode**: Prevents broadcast loops during initialization

---

## Dependencies

- **`@monaco-editor/react`**: Monaco Editor React wrapper
- **`yjs`**: CRDT library for real-time collaboration
- **`y-protocols/awareness`**: Cursor/selection tracking protocol
- **`y-monaco`**: Binding between Yjs and Monaco Editor

---

## Usage Example

```tsx
<CodeEditor
  isTeam={true}
  tabs={openTabs}
  errorMarkers={errorState}
  setErrorMarkers={setErrorState}
  sendMessage={websocketSend}
  setTabs={setOpenTabs}
  setFiles={setFileTree}
  onTabClose={handleCloseTab}
  onTabSelect={handleSelectTab}
  projectId="project-123"
/>
```