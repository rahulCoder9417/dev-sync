
---

# Room Manager – File Collaboration System

## Overview

The **Room Manager** is the core real-time coordination layer for a collaborative coding platform.
It manages **projects**, **files**, and **user presence** over WebSockets, enabling:

* Multi-user file collaboration
* Real-time cursor, scroll, and selection awareness
* File creation, renaming, saving, and deletion workflows
* Voting-based destructive actions
* Yjs-powered CRDT synchronization
* Scoped broadcasting (project-level vs file-level)

The system is **room-based**, where:

* A **project** is a room
* A **file** is a sub-room of a project (`projectId:fileId`)

---

## Architecture Summary

```
WebSocket Client
   ↓
RoomManager
   ├── Project Room (projectId)
   │     ├── File Room (projectId:fileId)
   │     ├── File Room (projectId:fileId)
   │
   └── Presence + Awareness Broadcasts
```

---

## Room Identification

### `makeRoomId(projectId?, fileId?)`

```ts
makeRoomId(projectId, fileId) => string
```

#### Rules

* `projectId` → project-level room
* `projectId:fileId` → file-level room
* Empty if no project exists

#### Examples

| Input                    | Output    |
| ------------------------ | --------- |
| `("p1")`                 | `"p1"`    |
| `("p1", "f1")`           | `"p1:f1"` |
| `(undefined, undefined)` | `""`      |

---

## Core Data Models

### UserInfo

Represents a connected user’s public identity.

```ts
type UserInfo = {
  userId: string;
  username: string;
  fullName: string;
  projectId: string | null;
  fileId: string | null;
  avatar?: string | null;
};
```

Used in:

* Join/leave broadcasts
* Awareness events
* Chat/messages
* File operations

---

### FileNode

Represents the project file tree.

```ts
type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string;
  children: string[];
};
```

Supports:

* Hierarchical folders
* Rename/create operations
* Sync across users

---

## Presence & Awareness Types

### Cursor & View State

```ts
type CursorPosition = { line: number; column: number };
type ScrollPosition = { top: number; left: number };
type SelectionRange = {
  start: CursorPosition;
  end: CursorPosition;
};
```

### Awareness Types

```ts
type AwarenessType = "cursor" | "selection" | "scroll";
```

Used for:

* Live cursors
* Text selection highlighting
* Scroll syncing

---

## Client → Server Messages

### Join Room

```ts
{
  action: "join";
  projectId?: string;
  fileId?: string;
}
```

Behavior:

* Leaves previous file room automatically
* Joins new project/file room
* Broadcasts `user_joined`

---

### Leave Room

```ts
{
  action: "leave";
  projectId?: string;
  fileId?: string;
}
```

---

### File Operations

```ts
{
  action: "fileOp";
  type?: "create" | "rename";
  fileName: string;
  newNode?: FileNode;
  content?: string;
}
```

Used for:

* Creating files/folders
* Renaming files
* Broadcasting file tree updates

---

### File Save

```ts
{
  action: "fileSave";
  projectId: string;
  fileId: string;
  content: string;
}
```

Triggers:

* Persistent storage
* Save broadcast to all file collaborators

---

### Voting for Deletion

```ts
{
  action: "vote_delete";
  projectId: string;
  fileId: string;
  fullName: string;
  fileName: string;
}
```

Used for:

* Democratic deletion
* Prevents accidental data loss

---

### Cancel Voting

```ts
{
  action: "cancel_voting";
  projectId: string;
  fileId: string;
}
```

---

### Awareness Update

```ts
{
  action: "awareness";
  projectId: string;
  fileId: string;
  type: "cursor" | "scroll" | "selection";
  cursor?: CursorPosition;
  scroll?: ScrollPosition;
  selection?: SelectionRange;
}
```

Broadcasted **in real time**.

---

### Yjs Code Sync

```ts
{
  action: "YjsCodeChanges";
  projectId: string;
  fileId: string;
  updateType: "text";
  data: Uint8Array;
}
```

Purpose:

* CRDT delta updates
* Conflict-free collaboration

---

## Server → Client Broadcasts

### User Joined

```ts
{
  type: "user_joined";
  room: string;
  user: UserInfo;
}
```

Broadcasted to:

* Project room (not only file)

---

### User Left

```ts
{
  type: "user_left";
  room: string;
  user: UserInfo;
}
```

---

### File Operation Broadcast

```ts
{
  type: "fileOp";
  room: string;
  from: UserInfo;
  action?: "create" | "rename";
  newNode?: FileNode;
}
```

---

### Voting Broadcast

```ts
{
  type: "voting";
  projectId: string;
  fileId: string;
  votingBy: string;
  fileName: string;
  required: number;
  done: number | string[];
}
```

---

### Awareness Broadcast

```ts
{
  type: "awareness";
  room: string;
  from: UserInfo;
  data: {
    type: AwarenessType;
    cursor?: CursorPosition;
    scroll?: ScrollPosition;
    selection?: SelectionRange;
  };
}
```

---

### Yjs Sync Broadcast

```ts
{
  type: "YjsCodeChanges";
  room: string;
  fileId: string;
  updateType: "text";
  data: Uint8Array;
}
```

---

## RoomManager Class

### Responsibilities

* Tracks rooms and users
* Handles join/leave lifecycle
* Manages metadata consistency
* Broadcasts safely
* Cleans up empty rooms

---

### Internal State

```ts
rooms: Map<string, Set<ExtWebSocket>>
```

Each room maps to **active WebSocket connections**.

---

### Key Methods

#### `addToRoom(room, ws)`

* Cleans previous file room
* Adds user to new room
* Broadcasts join event
* Confirms join to client

#### `removeFromRoom(room, ws)`

* Broadcasts leave
* Removes socket
* Deletes empty rooms

#### `broadcastToRoom(room, payload, except?)`

* Sends JSON to all users
* Optionally excludes sender
* Ignores dead sockets

---

### Safety Guarantees

* Prevents duplicate room membership
* Ensures clean transitions between files
* Avoids broadcasting to closed sockets
* Auto-deletes empty rooms

---

## ExtWebSocket (Augmented WebSocket)

```ts
interface ExtWebSocket extends WS {
  isAlive: boolean;
  userId: string;
  projectId?: string | null;
  fileId?: string | null;
  username: string;
  fullName: string;
  avatar: string | null;
  rooms: Set<string>;
}
```

Purpose:

* Stores identity + state on socket
* Avoids DB lookups per message
* Enables fast presence handling

---

## Error Handling

### Error Responses

```ts
{ error: "invalid_json" }
{ error: "invalid_message" }
{ error: "room_required" }
{ error: "unknown_action" }
{ error: "internal_error" }
```

Errors are **explicit**, **typed**, and **client-safe**.

---
