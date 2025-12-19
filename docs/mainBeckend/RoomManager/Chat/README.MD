
---

# RoomManager Documentation

`RoomManager` is an **in-memory real-time state manager** used by `ChatWsHandler` to coordinate:

* Chat room membership
* User presence
* Typing indicators
* Message broadcasting
* Short-term message history

It is intentionally **stateless across restarts** and optimized for **low-latency WebSocket fanout**.

---

## Role in the System

```
BaseWsHandler
     ↑
ChatWsHandler
     ↓
RoomManager  ← single source of truth (runtime)
```

- Chat Handler: [ChatWsHandler README](../../Handler/ChatWsHandler/README.MD)
`RoomManager` does **not**:

* Authenticate users
* Persist messages long-term
* Perform business logic

It **only manages live WebSocket state**.

---

## Core Data Structures

### chatRooms

```ts
Map<RoomId, Map<userId, ExtWebSocket>>
```

Tracks active users per chat room.

* Key: `roomId`
* Value: connected sockets indexed by userId
* Automatically destroyed when empty

---

### users (Global Online Users)

```ts
Map<userId, ExtWebSocket>
```

Tracks **all online users**, regardless of room.

Used for:

* Presence
* Direct messaging
* Notifications
* Friend online/offline updates

---

### typingUsers

```ts
Map<RoomId, Map<userId, ExtWebSocket>>
```

Tracks typing state per room.

* Prevents duplicate typing events
* Automatically cleaned when users leave

---

### messageHistory

```ts
Map<RoomId, ChatHistoryMessage[]>
```

Short-lived in-memory message buffer.

* Max 100 messages per room
* Useful for:

  * Debugging
  * Fast reconnects
  * Temporary state (not a DB replacement)

---

## Typing Indicator API

### `addToTypingStatus(roomId, ws)`

Adds user to typing state and broadcasts:

```json
{
  "type": "typingStart",
  "chatId": "roomId",
  "userId": "userId",
  "fullName": "string",
  "avatar": "string | null"
}
```

**Rules**

* No duplicate typing events per user
* Broadcast excludes sender

---

### `removeFromTypingStatus(roomId, ws)`

Removes user from typing state and broadcasts:

```json
{
  "type": "typingEnd",
  "chatId": "roomId",
  "userId": "userId"
}
```

Automatically deletes room typing state if empty.

---

### `isUserTyping(roomId, ws)`

```ts
boolean
```

Checks whether a user is currently typing in a room.

---

## Global User Presence

### `addToGlobalUserList(ws)`

Registers a user as **online**.

```ts
users.set(ws.userId, ws);
```

---

### `removeFromGlobalUserList(ws)`

Removes user from global presence (offline).

---

## Room Membership API

### `addToRoom(roomId, ws, skipBroadcast?)`

Adds a user to a room.

**Behavior**

* Creates room if it doesn’t exist
* Initializes message & typing state
* Updates `ws.chatRooms`
* Optionally broadcasts join event

**Broadcast Event**

```json
{
  "type": "user_joined",
  "room": "roomId",
  "user": {
    "userId": "string",
    "username": "string",
    "fullName": "string",
    "avatar": "string | null"
  },
  "timestamp": "ISO_DATE"
}
```

---

### `removeFromRoom(roomId, ws, skipBroadcast?)`

Removes user from a room.

**Behavior**

* Clears typing state
* Removes socket from room
* Deletes room if empty
* Optionally broadcasts leave event

**Broadcast Event**

```json
{
  "type": "user_left",
  "room": "roomId",
  "userId": "string",
  "timestamp": "ISO_DATE"
}
```

---

## Message Broadcasting

### `broadcastToRoom(roomId, message, except?)`

Sends a JSON message to all users in a room.

**Rules**

* Skips sender if `except` is provided
* Only sends to OPEN sockets
* Silent fail if room doesn’t exist

```ts
broadcastToRoom(roomId, payload, senderWs);
```

This is the **core fanout primitive** used everywhere.

---

## Message History

### `addMessage(roomId, message)`

Adds a message to in-memory history.

**Constraints**

* Max 100 messages per room
* FIFO eviction
* Not persistent

---

### `getMessageHistory(roomId)`

Returns cached messages or empty array.

---

## Queries & Utilities

### `getRoomUsers(roomId)`

```ts
ExtWebSocket[]
```

Returns all active sockets in a room.

---

### `getRoomSize(roomId)`

```ts
number
```

Returns number of connected users.

---

## Internal Helpers

### `clearTypingStatus(roomId, ws)`

Automatically invoked when:

* User leaves room
* User disconnects

Ensures typing indicators never get stuck.

---

## Types

### RoomId

```ts
type RoomId = string;
```

---

### ChatEvent

Events broadcasted to clients:

* `typingStart`
* `typingEnd`
* `user_joined`
* `user_left`

These are **transport-level events**, not DB events.

---

### ChatHistoryMessage

```ts
Record<string, unknown>
```

Flexible message payload for in-memory caching.

---