
---

# File WebSocket Handler (`FileWsHandler`)

## Purpose

`FileWsHandler` is the **authoritative real-time controller** for **file-level collaboration** over WebSockets.

It sits on top of `RoomManager` and translates **client actions** into:

* Scoped room broadcasts
* Persistent storage updates
* Presence + awareness propagation
* Yjs CRDT synchronization
* Voting-based destructive actions
* Cross-system updates (editor ↔ terminal ↔ renderer)

This is **not a dumb relay**.
It is the **policy + coordination layer** for collaboration.

---

## High-Level Responsibilities

`FileWsHandler` handles:

* Room join / leave lifecycle
* File create, rename, save, delete
* Collaborative editing (Yjs)
* Cursor / scroll / selection awareness
* Presence synchronization
* Voting logic for deletion
* Admin role changes
* Chat / generic messages
* Terminal-initiated file operations

---

## Inheritance

```ts
class FileWsHandler extends BaseWsHandler
```

- BASE WS HANDLER: [BaseWsHandler README](../../Handler/BaseWsHandler/README.MD)

### BaseWsHandler provides:

* WebSocket route binding (`/ws/file`)
* Connection lifecycle hooks
* Message dispatch framework

`FileWsHandler` focuses **only** on domain logic.

---

## Internal State

### `fileVotes`

```ts
private fileVotes: Map<string, Set<string>>
```

**Purpose**
Tracks votes for file/folder deletion.

**Key format**

```
${projectId}:${fileId}:${initiatorFullName}
```

**Value**

```
Set<userId>
```

**Design decision**

* Votes reset per delete attempt
* Voting scope = entire project room
* Deletion only happens on **unanimous consent**

This is intentional and conservative.

---

### `room: RoomManager`

- ROOM MANAGER: [RoomManager README](../../RoomManager/file/README.MD)

```ts
private room: RoomManager;
```

Manages:

* Project rooms
* File sub-rooms
* User membership
* Broadcasting logic

`FileWsHandler` never touches raw sockets directly beyond identity.

---

## Connection Lifecycle

### `handleDisconnect(ws)`

Triggered automatically when a client disconnects.

**Behavior**

1. Iterates through all rooms the socket belongs to
2. Removes socket from each room
3. Broadcasts `user_left` to others

```ts
type: "user_left"
```

**Important**

* Cleanup is **idempotent**
* No room leaks
* No stale presence

---

## Message Parsing & Validation

### `handleMessage(ws, data)`

Central dispatcher for **all client messages**.

#### Steps

1. Parse JSON
2. Validate structure
3. Switch on `action`
4. Delegate to specialized handler
5. Catch and report internal errors

#### Error guarantees

* Invalid JSON → `invalid_json`
* Missing action → `invalid_message`
* Unknown action → `unknown_action`
* Runtime failure → `internal_error`

This ensures **client safety** and **server stability**.

---

## Supported Actions & Handlers

---

## 1. Room Management

### `join`

```ts
{ action: "join", projectId?, fileId? }
```

Handled by: `handleJoinRoom`

**Behavior**

* Joins project or file room
* Automatically leaves previous file room
* Sends current project presence snapshot (if project-level join)

**Why snapshot only on project join?**
Because file rooms are transient; project presence is long-lived.

---

### `leave`

```ts
{ action: "leave", projectId?, fileId? }
```

Handled by: `handleLeaveRoom`

Removes socket cleanly from room.

---

## 2. File Operations

### `fileOp`

```ts
{
  action: "fileOp",
  type: "create" | "rename",
  fileName,
  newNode?,
  content?
}
```

Handled by: `handleFileUpdate`

#### Responsibilities

* Broadcast file tree update to project room
* Trigger persistence via render sync services

#### Persistence side-effects

* `sendFileCreated`
* `sendFileRenamed`

**Important**

* File ops are project-scoped, not file-scoped
* File tree is global to project

---

## 3. File Save

### `fileSave`

```ts
{
  action: "fileSave",
  projectId,
  fileId,
  content
}
```

Handled by: `handleFileSave`

#### Behavior

* Broadcasts save event to project room
* Persists content via `sendFileUpdated`

**Why project room?**
So all editors, previews, terminals stay in sync.

---

## 4. Awareness (Presence in Editor)

### `awareness`

```ts
{
  action: "awareness",
  type: "cursor" | "scroll" | "selection"
}
```

Handled by: `handleAwareness`

#### Broadcasts

* Cursor position
* Scroll position
* Selection ranges

**Scope**

* File-level room only

**Excluded**

* Sender (to avoid echo)

This enables:

* Live cursors
* Multi-user selections
* Scroll syncing

---

## 5. Yjs CRDT Synchronization

### `YjsCodeChanges`

```ts
{
  action: "YjsCodeChanges",
  projectId,
  fileId,
  data,
  updateType: "text"
}
```

Handled by: `handleYjsCodeChanges`

#### Purpose

* Broadcast CRDT deltas
* Zero conflict resolution logic in server

Server is **transport-only** here — exactly how CRDT servers should be.

---

## 6. Initial Sync (Late Joiners)

### `sync`

Handled by: `handleSync`

**Flow**

1. New user joins file
2. Requests sync
3. First user in room is selected as owner
4. Owner sends state to requester

This avoids:

* Server-side document state
* Heavy memory usage

---

### `syncedData`

Handled by: `handleSyncedData`

Delivers Yjs state **directly to target user**.

This is **point-to-point**, not broadcast.

---

## 7. User Presence Sync

### `syncUserPresence`

Handled by: `handleSyncUserPresence`

Purpose:

* New joiner sees existing project users
* Avoids ghost users
* Keeps UI consistent

---

## 8. Admin Changes

### `changeAdmin`

Handled by: `handleChangeAdmin`

Broadcasts admin ownership change to project room.

No persistence here — that belongs elsewhere.

---

## 9. Voting-Based Deletion

### `vote_delete`

Handled by: `handleVoteDelete`

#### Logic

1. Track votes per file
2. Required votes = project room size
3. On unanimity:

   * Delete file/folder
   * Broadcast success
   * Persist deletion

#### Failure case

* Broadcast error if deletion fails

This is **deliberately strict** — destructive actions require consent.

---

### `cancel_voting`

Handled by: `handleCancelVoting`

Clears vote state immediately.

---

## 10. Chat / Generic Messages

### `message`

Handled by: `handleMessageIncoming`

Broadcasts arbitrary payloads to room.

Used for:

* Chat
* Annotations
* System messages

---

## Terminal-Driven Operations (Out-of-Band)

These methods are **not WebSocket messages**.

They allow **terminal, runner, or CI systems** to update clients.

---

### `handleSave(...)`

Broadcasts file save initiated from terminal.

---

### `handleCreate(...)`

Broadcasts file creation from terminal.

---

### `handleRename(...)`

Broadcasts file rename from terminal.

---

### `handleDelete(...)`

Broadcasts file deletion from terminal.

---

## Design Decisions (Strong & Intentional)

* **RoomManager owns membership** — handlers never track sockets
* **CRDT logic stays client-side**
* **Deletion requires unanimity**
* **Server is stateless for document content**
* **Terminal is a first-class collaborator**
* **Presence is event-based, not polled**

This architecture **scales cleanly** and avoids classic WebSocket pitfalls.

---