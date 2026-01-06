
***

# Collaboration Hook (`useCollab`)

**File Path:** `src/customHooks/useCollab.ts`

## Overview
`useCollab` is a robust, custom React Hook designed to manage real-time WebSocket connections for the collaborative IDE. It handles the full lifecycle of the connection, including authentication via Clerk, automatic reconnection strategies, message buffering, and dispatching Redux actions to synchronize the editor state.

It acts as the bridge between the **WebSocket Server** and the **Redux Store**, ensuring that code changes, file operations, and user presence are reflected in the UI without causing render loops.

## Features
*   **Secure Connection:** Authenticates using Clerk JWT tokens (`beckend-email-get` template).
*   **Resiliency:** Implements exponential backoff and jitter for reconnection attempts (up to 15 retries).
*   **Performance Optimization:** Uses a **Macro-task Queue** (via `setTimeout`) to process incoming payloads. This prevents React "Maximum update depth exceeded" errors by ensuring state updates happen after the current render cycle finishes.
*   **Request Buffering:** Queues `join` and `leave` room requests if the WebSocket is not yet open, flushing them automatically once connected.
*   **Redux Integration:** automatically dispatches actions for Yjs syncs, file operations, and cursor awareness.

## Usage

```tsx
import useCollab from '@/customHooks/useCollab';

const { 
  join, 
  leave, 
  sendMessage, 
  status,
  participantsRef 
} = useCollab({
  wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  autoConnect: true
});
```

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoConnect` | `boolean` | `true` | If true, initiates connection immediately on mount. |
| `wsUrl` | `string` | `env.NEXT_PUBLIC_WS_URL` | The WebSocket server endpoint. |
| `onEvent` | `function` | `undefined` | Optional callback to handle raw server payloads externally. |
| `maxReconnectAttempts` | `number` | `15` | Maximum number of retry attempts before giving up. |

## Return Values

| Value | Type | Description |
| :--- | :--- | :--- |
| `status` | `'idle' \| 'connecting' \| 'connected' ...` | Current connection state. |
| `messages` | `ServerPayload[]` | Local log of recent incoming messages (debug use). |
| `connect` | `() => Promise<void>` | Manually trigger a connection. |
| `disconnect` | `() => void` | Manually close the connection. |
| `join` | `(projectId, fileId?) => boolean` | Join a specific room (Project or File). Queues if offline. |
| `leave` | `(projectId, fileId?) => boolean` | Leave a specific room. |
| `sendMessage` | `(msg, projectId, fileId, data?) => boolean` | Send a generic JSON payload to the server. |
| `deletionMenu` | `Object \| null` | State object containing active file deletion voting details. |
| `participantsRef` | `MutableRefObject<Map>` | A Map of currently active users in the session. |

## Handled Server Events
The hook listens for specific `payload.type` messages and dispatches Redux actions accordingly:

| Event Type | Action Taken | Description |
| :--- | :--- | :--- |
| `YjsCodeChanges` | `updateCode` | Applies remote Yjs updates to the editor. |
| `awareness` | `updateCode` | Updates remote cursors and selections. |
| `sync` | `updateCode` | Handles initial document synchronization. |
| `fileSave` | `addSaveFileOp` | Marks the file as saved in the UI. |
| `file_deleted` | `addFileOp` | Removes the file from the Redux file tree and shows a Toast. |
| `voting` | `setdeletionMenu` | Triggers the UI for voting to delete a file. |
| `fileOp` | `addFileOp` | Handles file creation or renaming events. |
| `user_joined` | `updatePresence` | Updates the participants list when a user enters. |
| `user_left` | `updatePresence` | Updates the participants list when a user exits. |

## Implementation Details

### The Macro-Task Queue (Fixing Render Loops)
When high-frequency events (like typing) occur, directly updating state can trigger React's re-render limit. `useCollab` solves this by pushing incoming messages into a `pendingPayloadsRef` queue and processing them inside a `setTimeout(..., 0)`.

```typescript
// Enqueue payload and schedule a macrotask flush
pendingPayloadsRef.current.push(payload);

if (payloadFlushScheduledRef.current == null) {
  payloadFlushScheduledRef.current = window.setTimeout(() => {
    payloadFlushScheduledRef.current = null;
    flushPayloads();
  }, 0);
}
```

### Outgoing Message Buffering
If a component tries to `join()` a room before the WebSocket handshake is complete, the hook adds the request to `pendingJoinsRef`. A `useEffect` watches the `status`; once it becomes `connected`, it automatically flushes all pending join/leave requests.
### It connects to main Beckend
[ Main Bekcend](../../../mainBeckend/server/README.MD)