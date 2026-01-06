
---

# 📟 Terminal Preview System – Internal Documentation

## 1. Overview

The Terminal Preview system provides a **browser-based interactive shell** connected to a **remote execution backend**.
It enables users to:

* Initialize project files into ephemeral disk storage
* Start a live terminal session via WebSockets
* Execute commands (npm, build, preview, etc.)
* Auto-detect running servers and expose previews securely
* Open GUI or project previews in new tabs
* Persist project state back to the database

This system is designed for **multi-user, real-time, serverless-friendly environments**.

---

## 2. High-Level Architecture

```
Client (Next.js)
 ├─ Preview.tsx
 │   └─ Initializes disk storage
 │
 ├─ TerminalClient (dynamic import)
 │   └─ Prevents SSR issues
 │
 ├─ Terminal.tsx
 │   ├─ xterm.js UI
 │   ├─ FitAddon
 │   ├─ Command shortcuts
 │   ├─ Port detection
 │   └─ Preview launcher
 │
 └─ useTerminal hook
     ├─ WebSocket lifecycle
     ├─ Input/output streaming
     ├─ Resize handling
     └─ Cleanup & disconnect

```

Backend responsibilities:

* Restore project files from DB → disk
* Spawn pseudo-terminal (pty)
* Stream stdout/stderr
* Detect exposed ports
* Secure preview routes via tokens

---

## 3. Preview Component (`Preview.tsx`)

### Purpose

`Preview` is the **entry gate**.
It ensures that **disk storage is initialized** before any terminal session starts.

### Responsibilities

* Calls backend API to restore project files
* Tracks initialization state
* Handles loading, error, success UI
* Mounts `TerminalClient` only after success

### State Machine

```ts
"idle" → "connecting" → "connected"
                   ↘ "error"
```

### Why this matters

Terminals **must never start** before disk is ready.
Otherwise:

* Commands fail
* Files don’t exist
* Terminal state becomes invalid

### Key Code Flow

```ts
useEffect(() => {
  if (!terminalLoaded) init()
  return () => setTerminalLoaded(false)
}, [])
```

* Prevents duplicate initialization
* Ensures clean teardown when component unmounts

### API Contract

**POST** `/api/terminal/saveFile`

```json
{
  "projectId": "string",
  "userId": "string"
}
```

Expected behavior:

* Reconstruct project folder on backend disk
* Return success or structured error

---

## 4. Dynamic Import Layer (`TerminalClient.tsx`)

### Why this exists

`xterm.js` **cannot run during SSR**.

Next.js App Router renders server components by default → crash without this layer.

### Solution

```ts
const TerminalClient = dynamic(() => import("./Terminal"), {
  ssr: false,
})
```

This guarantees:

* Terminal loads **only in browser**
* No hydration mismatch
* Clean isolation of client-only logic

This file is intentionally thin and should **never contain logic**.

---

## 5. Terminal Component (`Terminal.tsx`)

This is the **core UI + interaction layer**.

---

## 6. Terminal Initialization Lifecycle

### Step-by-Step

1. Create `xterm` instance
2. Attach `FitAddon`
3. Mount terminal into DOM
4. Fit terminal size
5. Start backend PTY session
6. Bind input/output streams

### Code Flow

```ts
const term = new XTerminal({...})
term.loadAddon(fitAddon)
term.open(terminalRef.current)

start(term.cols, term.rows)
term.onData(data => input(data))
```

### Why order matters

* Terminal **must exist** before starting backend session
* Backend needs correct `cols/rows`
* Resize events must be synchronized

---

## 7. useTerminal Hook (Conceptual)

Although not shown fully here, `useTerminal` handles:
* [useTerminal](../../../../features/useTerminal/README.MD)
### Responsibilities

* WebSocket connection lifecycle
* Message parsing
* Input forwarding
* Resize events
* Graceful disconnect

### Message Types

```ts
type TerminalMessage =
  | { type: "output"; data: string }
  | { type: "started"; shell; cols; rows; cwd }
  | { type: "exit" }
  | { error: string }
```

### Client → Server

```ts
type TerminalClientMessage =
  | { type: "start"; cols; rows; cwd }
  | { type: "input"; data }
  | { type: "resize"; cols; rows }
  | { type: "stop" }
```

---

## 8. Output Handling & Preview Detection

### Special Protocol: `PREVIEW:`

Backend emits:

```
PREVIEW:5173:token123
```

Client logic:

```ts
if (payload.data.startsWith("PREVIEW:")) {
  const [port, token] = ...
  setPorts(...)
}
```

### Why this design

* Zero coupling with framework (Vite, Next, Express)
* No port scanning
* Secure tokenized previews
* Works with any runtime

---

## 9. Port Preview System

### UI Behavior

* Ports appear dynamically in footer
* Each port is clickable
* Opens secure preview route

### Preview URL Format

```
/preview/{userId}/{port}?token={token}
```

### Security Guarantees

* Token scoped per port
* User-specific namespace
* Backend validates token before proxying

---

## 10. Command Shortcuts System

### Default Shortcuts

```ts
npm start
npm install
clear
```

### Features

* Right-click Run button to open menu
* Select active command
* Add custom commands
* Persisted in component state (can be DB later)

### Execution Logic

```ts
input(command)
input('\r')
```

This simulates **real typing**, not direct execution — critical for PTY consistency.

---

## 11. GUI Mode

### Purpose

Some apps expose a **GUI server** (e.g. noVNC, admin panel, internal dashboard).

### URL

```
/gui/{userId}
```

### Behavior

* Opens in new tab
* Same session namespace
* Shares disk & runtime

---

## 12. Project Preview Button

Used for:

* Static HTML/CSS/JS projects
* Built frontend outputs

```ts
/projects/{projectId}/{projectName}
```

This bypasses terminal preview and serves files directly.

---

## 13. FitAddon & Resize Handling

### Problem

* Container resizes
* Sidebar toggles
* Layout transitions
* Window resize

### Solution

* `FitAddon`
* `transitionend` listener
* Safe bounding checks

```ts
if (r.width === 0 || r.height === 0) return
```

This prevents:

* Infinite resize loops
* Terminal crashes
* Zero-dimension bugs

---

## 14. Cleanup & Resource Safety

### On Unmount

```ts
stop()
disconnect()
term.dispose()
```

### Why this is critical

Without cleanup:

* Zombie PTY processes
* Leaked WebSocket connections
* Disk never released
* Backend memory leaks

This system is **defensive by design**.

---

## 15. Error Handling Strategy

### Layers

1. Disk init errors → Preview screen
2. WebSocket errors → terminal output
3. Runtime crashes → `[Session ended]`

### Philosophy

* Fail early
* Fail visibly
* Never silently hang

---

## 16. Known Constraints (Intentional)

* ❌ Vite dev server previews blocked
* ✅ Build → preview allowed
* ❌ Multiple concurrent terminals per user (by design)
* ✅ Multi-project isolation

These constraints protect:

* Server resources
* Port collisions
* Abuse vectors

---

## 17. Extension Points

### Easy to add

* Persist shortcuts in DB
* Session restore
* Collaborative terminals
* Command history
* File tree sync
* Live preview embedding (iframe)

### Hard but possible

* Multi-user shared PTY
* Replayable terminal logs
* Time-travel debugging

---
