
# Base WebSocket Handler Documentation

This module provides an **abstract, production-ready WebSocket handler** built on top of the `ws` library.
It standardizes connection lifecycle, heartbeat handling, upgrades, and error safety while allowing feature-specific logic via abstract methods.

---

## Overview

`BaseWsHandler` is designed to:

* Handle authenticated WebSocket connections
* Maintain connection health using heartbeat (ping/pong)
* Safely wrap message handling
* Store extended user & room metadata on sockets
* Act as a base class for domain-specific WS handlers (chat, collaboration, notifications, etc.)

---

## Key Concepts

### 1. **No-Server WebSocket Mode**

The server is created with:

```ts
new WebSocketServer({ noServer: true });
```

This allows:

* Manual HTTP → WS upgrades
* Integration with existing HTTP servers (Express, Fastify, native `http`)

---

### 2. **Extended WebSocket (`ExtWebSocket`)**

Each connection is enriched with application-specific state.

```ts
export interface ExtWebSocket extends WS {
  isAlive: boolean;
  userId: string;
  username: string;
  fullName: string;
  avatar: string | null;
  rooms: Set<string>;
  chatRooms: Set<string>;
}
```

This avoids global maps and keeps state **co-located with the socket**.

---

### 3. **Authenticated Connection Flow**

The upgrade process injects authenticated user metadata:

```ts
handleUpgrade(req, socket, head, user)
```

That `user` object is then passed into the `connection` event and attached to the socket.

---

## Class: `BaseWsHandler`

### Constructor

```ts
constructor(path: string)
```

**Responsibilities**

* Registers the WS namespace path
* Initializes WebSocket server
* Sets up lifecycle handlers & heartbeat

---

## Connection Lifecycle

### `setupEventHandlers()`

Registers core WebSocket events:

* `connection`
* `message`
* `close`
* heartbeat initialization

---

### `initializeConnection(ws, user)`

Sets initial socket state:

```ts
ws.rooms = new Set();
ws.chatRooms = new Set();

ws.userId = user.userId;
ws.username = user.username;
ws.fullName = user.fullName;
ws.avatar = user.avatar ?? null;

ws.isAlive = true;
```

Also attaches a `pong` listener to track connection health.

---

### `sendGlobalUserList(ws)`

Abstract method called immediately after connection.

**Purpose**

* Sync initial state (online users, collaborators, etc.)
* Avoids client-side race conditions
* Used in ChatwsHandler

---

## Heartbeat System (Ping / Pong)

### `setupHeartbeat()`

Runs every **30 seconds**:

```ts
if (!ws.isAlive) {
  ws.terminate();
}
ws.isAlive = false;
ws.ping();
```

**Why this matters**

* Cleans up dead TCP connections
* Prevents memory leaks
* Detects silent client crashes (mobile background, tab kill)

---

## Message Handling Safety

### `safeHandleMessage(ws, data)`

Wraps all message handling in a `try/catch`:

```ts
try {
  await this.handleMessage(ws, data);
} catch (error) {
  console.error(...);
}
```

**Benefits**

* One client cannot crash the server
* Errors are isolated per connection
* Production-safe by default

---

## Upgrade Handling

### `handleUpgrade(request, socket, head, user)`

Manually upgrades HTTP → WebSocket:

```ts
this.wss.handleUpgrade(request, socket, head, (ws) => {
  this.wss.emit('connection', ws, request, user);
});
```

**Design choice**

* Authentication happens **before** upgrade
* No unauthenticated WS connections exist

---

## Graceful Shutdown

### `close()`

```ts
this.wss.close();
```

Used for:

* Server shutdown
* Hot reload
* Service restarts

---

## Abstract API (Must Implement)

Every concrete handler **must** implement:

```ts
protected abstract handleMessage(
  ws: ExtWebSocket,
  data: RawData
): Promise<void>;
```

Handles all incoming messages.

---

```ts
protected abstract handleDisconnect(ws: ExtWebSocket): void;
```

Used for:

* Cleanup
* Broadcasting disconnect events
* Room/user state updates

---

```ts
protected abstract sendGlobalUserList(ws: ExtWebSocket): void;
```

Used for:

* Initial sync
* Presence systems
* Room membership state

---

## Supporting Types

### `UserMeta`

Injected during upgrade and attached to socket.

```ts
export type UserMeta = {
  userId: string;
  projectId?: string;
  fileId?: string;
  username: string;
  fullName: string;
  avatar?: string | null;
};
```

This allows **context-aware WebSocket routing** (projects, files, rooms).

---

## Related Documentation

- Chat Handler: [ChatWsHandler README](../ChatWsHandler/README.MD)
- Room Manager (Chat): [RoomManager Chat README](../../RoomManager/Chat/README.MD)
