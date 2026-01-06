
---

# `useTerminal` – Client-Side Terminal WebSocket Hook

## Overview

`useTerminal` is a **React hook** that manages the full lifecycle of a **WebSocket-based terminal session**.

It is responsible for:

* Authenticating the user (via Clerk)
* Opening a secure WebSocket connection
* Streaming terminal input/output
* Handling reconnects automatically
* Managing connection state
* Exposing a clean API to UI components (xterm.js)

This hook is **client-only** by design.
* it connects to  [Secondary Backend](../../../renderBeckend/server/README.MD)
---

## Client-Only Guard

```ts
if (typeof window === "undefined") {
  throw new Error("useTerminal can only run on the client");
}
```

This prevents:

* SSR execution
* Hydration bugs
* Token access failures

This is **correct and intentional**.

---

## Why This Hook Exists

Without this hook:

* Terminal logic would leak into UI components
* Auth, reconnection, and socket state would be duplicated
* Cleanup would be error-prone

This hook **centralizes all terminal networking logic**.

---

## Message Types

### Server → Client (`TerminalMessage`)

```ts
type TerminalMessage =
  | { type: "output"; data: string }
  | { type: "started"; shell: string; cols: number; rows: number; cwd: string }
  | { type: "exit" }
  | { error: string }
```

These are parsed and forwarded to the UI.

---

### Client → Server (`TerminalClientMessage`)

```ts
type TerminalClientMessage =
  | { type: "start"; cols?: number; rows?: number; cwd?: string }
  | { type: "input"; data: string }
  | { type: "resize"; cols: number; rows: number }
  | { type: "stop" };
```

This mirrors backend expectations exactly.

---

## Hook API

```ts
useTerminal({
  wsUrl?,
  autoConnect?,
  onMessage?,
  projectId?,
  termRef?
})
```

### Options

| Option        | Description                          |
| ------------- | ------------------------------------ |
| `wsUrl`       | WebSocket base URL (from env)        |
| `autoConnect` | Auto-connect on mount                |
| `onMessage`   | Handler for server messages          |
| `projectId`   | Project context for terminal         |
| `termRef`     | Optional xterm ref for direct writes |

---

## Internal State

### Connection Status

```ts
"idle" | "connecting" | "connected" | "closed" | "error" | "reconnecting"
```

Used by UI to:

* Show loaders
* Disable inputs
* Display errors

---

### Refs Used

| Ref                 | Purpose                    |
| ------------------- | -------------------------- |
| `wsRef`             | WebSocket instance         |
| `terminalIdRef`     | Stable terminal session ID |
| `manualClose`       | Prevent auto-reconnect     |
| `reconnectAttempts` | Exponential backoff        |
| `connectingRef`     | Prevent parallel connects  |

These refs make the hook **race-condition safe**.

---

## Stable Terminal ID

Each hook instance generates **one stable terminal ID**.

```ts
crypto.randomUUID()
```

Fallback:

* UUID v4 polyfill

Why this matters:

* Backend maps PTY to terminalId
* Reconnects reattach correctly
* Multiple terminals are supported

---

## WebSocket URL Construction

```ts
wss://<host>/ws/terminal
  ?token=JWT
  &terminalId=UUID
  &projectId=PID
```

Built securely using:

* Clerk JWT
* Env-configured base URL

Token is:

* Short-lived
* User-scoped
* Never stored

---

## Connection Lifecycle

### `connect()`

1. Fetch auth token
2. Build WebSocket URL
3. Open connection
4. Send `start` event
5. Reset reconnect counter

```ts
setStatus("connecting")
→ "connected"
```

On success:

* Writes to terminal
* Shows toast
* Ready for I/O

---

### `disconnect()`

```ts
manualClose.current = true;
ws.close();
```

This prevents:

* Auto-reconnect
* Zombie sessions

Used when:

* Terminal unmounts
* User closes session

---

## Automatic Reconnection

On unexpected close:

```ts
delay = min(1000 * 2^attempts, 10000)
```

This gives:

* Fast recovery
* No server hammering
* Graceful network handling

Reconnect stops if:

* User manually disconnects

---

## Message Handling

```ts
ws.onmessage = ev => onMessage(JSON.parse(ev.data))
```

Hook **does not interpret payloads** — it passes them up.

This keeps:

* Hook generic
* UI flexible
* Backend schema authoritative

---

## Command API (Exposed Methods)

### `start(cols?, rows?, cwd?)`

Starts the terminal session.

### `input(data)`

Sends keystrokes or commands.

### `resize(cols, rows)`

Syncs terminal size.

### `stop()`

Requests backend to stop shell.

All commands are **safe no-ops** if socket isn’t ready.

---

## Auto-Connect Behavior

```ts
if (autoConnect && status === "idle") connect();
```

Default:

* Auto-connect enabled

You can disable it for:

* Controlled lifecycle
* Manual reconnect UI

---

## Cleanup Behavior

On unmount:

```ts
// intentionally NOT auto-disconnecting
```

You deliberately allow:

* Parent components to control teardown
* Terminal persistence across remounts

This is **a smart choice** for complex UIs.

---

## Error Handling Strategy

* Errors do NOT crash UI
* Status updated to `"error"`
* Reconnect attempted automatically
* Toasts notify user

This balances UX and robustness.

---

## Security Model

* JWT-based authentication
* Token never stored
* WSS only
* userId inferred server-side
* project-scoped access

No trust placed on client input.

---

## Typical Usage

```ts
const { start, input, resize, status } = useTerminal({
  projectId,
  onMessage: handleTerminalOutput,
  termRef
});
```

This keeps terminal UI **clean and declarative**.

---

## Architectural Position

```
xterm.js
   ↓
useTerminal
   ↓
WebSocket
   ↓
TerminalWS (PTY)
```

This hook is the **front door** to your execution system.

---
