
---

# Split HTTP + WebSocket Server

## Purpose

This module is the **main server entrypoint** for the application.
It runs:

* A REST API (Express)
* A **token-authenticated split WebSocket server**

  * `/ws/file` → file collaboration (fileWsHandler) 
    * FileWsHandler  : [FileWsHandler README](../Handler/FileWsHandler/README.MD)
  * `/ws/chat` → chat & messaging (chatWsHandler)
    * ChatWsHandler  : [ChatWsHandler README](../Handler/ChatWsHandler/README.MD)

It acts as the **single network boundary** for:

* HTTP requests
* Real-time collaboration
* Authentication enforcement
* Graceful shutdown

---

## High-Level Architecture

```
                ┌───────────────┐
                │   Frontend    │
                └───────┬───────┘
                        │
        ┌───────────────▼───────────────┐
        │        HTTP + WS Server        │
        │                               │
        │  Express API   WebSocket      │
        │   /api         /ws/file       │
        │                /ws/chat       │
        └───────┬───────────┬───────────┘
                │           │
      FileWsHandler   ChatWsHandler
```

---

## Server Responsibilities

This server is responsible for:

* HTTP API routing
* CORS configuration
* WebSocket authentication
* WebSocket protocol routing
* Connection lifecycle management
* Graceful shutdown

It **does not**:

* Store document state
* Enforce business permissions
* Handle database transactions

Those responsibilities live elsewhere.

---

## Express HTTP Setup

### Express Initialization

```ts
const app = express();
const server = http.createServer(app);
```

A single HTTP server hosts both:

* REST endpoints
* WebSocket upgrades

This avoids port fragmentation and simplifies deployment.

---

### CORS Configuration

```ts
app.use(cors({
  origin: config.cors.origin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
```

**Key points**

* Explicit origin allow-list
* Credentials enabled (cookies / auth headers)
* Safe for browser-based WebSocket usage

---

### Body Parsing

```ts
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
```

Supports:

* Large payloads (file ops, configs)
* JSON-first APIs

---

### REST API Routing

```ts
app.use("/api", router);
```

All HTTP routes live under `/api`.

WebSockets are **not** mixed with REST routes.

---

## WebSocket Handlers

### Registered Handlers

```ts
const fileWsHandler = new FileWsHandler();
const chatWsHandler = new ChatWsHandler();
```

Each handler:

* Owns its own `ws.Server`
* Owns its own room management
* Owns its own message protocol

This is intentional isolation.

---

## WebSocket Upgrade Flow

### Upgrade Listener

```ts
server.on("upgrade", async (request, socket, head) => { ... })
```

This is the **single gate** for all WebSocket connections.

---

### Step-by-Step Upgrade Flow

```
Client → WS Upgrade Request
        ↓
Extract token from query string
        ↓
Verify token (Clerk + DB)
        ↓
Route by pathname
        ↓
Delegate to handler
```

---

### Token Extraction

```ts
const token = new URL(request.url!, `http://${host}`)
  .searchParams.get("token");
```

**Design choice**

* Token passed via query string
* Required for WebSocket auth
* Simpler than headers in browser WS APIs

---

### Authentication

```ts
const claims = await getAuthData(token);
```

Guarantees:

* Valid Clerk JWT
* User exists in internal DB
* Normalized `UserMeta` object

**Failure behavior**

* Socket destroyed immediately
* No partial connections
* Fail-closed by default

---

### Path-Based Routing

```ts
if (pathname === "/ws/file") {
  fileWsHandler.handleUpgrade(...)
} else if (pathname === "/ws/chat") {
  chatWsHandler.handleUpgrade(...)
}
```

This enables:

* Independent WebSocket protocols
* Cleaner mental model
* Easier scaling later (Redis, sharding)

Unknown paths are rejected.

---

## WebSocket Endpoints

### File Collaboration

```
ws://<host>/ws/file?token=<JWT>
```

Handles:

* File CRUD
* Real-time editing
* Awareness
* Voting
* Sync

---

### Chat

```
ws://<host>/ws/chat?token=<JWT>
```

Handles:

* Messaging
* Presence
* Chat rooms

---

## User Context Injection

```ts
fileWsHandler.handleUpgrade(
  request,
  socket,
  head,
  claims as UserMeta
);
```

Each WebSocket connection receives:

* `userId`
* `username`
* `fullName`
* `avatar`

This context is:

* Stored on the socket
* Used for attribution
* Never re-queried from DB

This is **critical for performance**.

---

## Server Startup

```ts
server.listen(PORT)
```

Default:

* Uses `config.port`
* Falls back to `8000`

Logs active endpoints on boot.

---

## Graceful Shutdown

### Shutdown Function

```ts
async function shutdown() { ... }
```

Triggered by:

* `SIGINT`
* `SIGTERM`

---

### Shutdown Steps

1. Stop accepting new HTTP connections
2. Close existing HTTP server
3. Close all WebSocket handlers
4. Force exit after timeout

This ensures:

* No dangling sockets
* No half-open connections
* Safe container shutdowns

---

## Exported Objects

```ts
export { fileWsHandler }
```

Purpose:

* Allow non-WS systems (terminal, CI, workers)
* Broadcast file events programmatically

This is how your system stays **event-driven**.

---

## Design Decisions (Very Intentional)

* **Single HTTP server** → simpler infra
* **Split WS handlers** → clean boundaries
* **Auth at upgrade time** → zero unauth sockets
* **Token in query** → browser-friendly
* **Fail fast on errors** → no zombie connections
* **Graceful shutdown** → production-ready

This is how real-time systems should be built.

---

## What This File Is NOT

* ❌ Business logic
* ❌ Permission enforcement
* ❌ Data persistence
* ❌ State synchronization

It is an **orchestrator**, not a god object.

---
