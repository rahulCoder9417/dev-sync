# Chat Slice Documentation

## Overview

The `chatSlice` is a Redux Toolkit slice that manages real-time chat functionality via WebSocket connections. It handles message caching, typing indicators, user presence, connection management with automatic reconnection, and message synchronization across team and direct chats.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Type Definitions](#type-definitions)
3. [State Structure](#state-structure)
4. [WebSocket Connection](#websocket-connection)
5. [Actions & Reducers](#actions--reducers)
6. [Async Thunks](#async-thunks)
7. [Helper Functions](#helper-functions)
8. [Selectors](#selectors)
9. [Usage Examples](#usage-examples)

---

## Core Concepts

### Message Caching System

The slice implements a sophisticated message caching system that stores messages separately for team and direct chats. Each chat maintains its own cache with pagination information and fetch status.

### Connection Management

- Automatic reconnection with exponential backoff and jitter
- Maximum 15 reconnection attempts
- Manual disconnect capability
- Connection status tracking (idle, connecting, connected, closed, error, reconnecting)

### Payload Processing

Messages received from the WebSocket are queued and processed in batches to optimize performance. This prevents UI blocking when multiple messages arrive simultaneously.

---

## Type Definitions

### ChatMessage

Basic chat message structure used internally.

```typescript
type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  chatType: "team" | "direct";
  chatId: string;
  createdAt: Date;
};
```

### Message

Extended message type used in the UI with full sender information.

```typescript
interface Message {
  id: string;
  isRead: boolean;
  sender: {
    id: string;
    fullName: string;
    avatar: string;
    username: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### PaginationInfo

Tracks pagination state for message history.

```typescript
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
  limit: number;
}
```

### TypingUser

Represents a user currently typing in a chat.

```typescript
interface TypingUser {
  userId: string;
  fullName: string;
  avatar?: string | null;
}

type TypingUsersMap = {
  [chatId: string]: TypingUser[];
};
```

### ChatCache

Cache structure for each individual chat.

```typescript
interface ChatCache {
  messages: Message[];
  pagination: PaginationInfo | null;
  currentPage: number;
  isFetched: boolean;
}
```

### MessagesCache

Top-level cache structure separating team and direct messages.

```typescript
interface MessagesCache {
  team: { [chatId: string]: ChatCache };
  direct: { [chatId: string]: ChatCache };
}
```

### ClientChatMessage

Union type for all possible client-to-server WebSocket messages.

```typescript
type ClientChatMessage =
  | { action: "read"; chatId: string; reciverId: string }
  | { action: "join"; chatType: "team" | "direct"; chatId: string }
  | { action: "leave"; chatType: "team" | "direct"; chatId: string }
  | {
      action: "send_message";
      chatType: "team" | "direct";
      chatId: string;
      content: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      reciverId: string;
    }
  | {
      action: "typing";
      chatType: "team" | "direct";
      chatId: string;
      isTyping: boolean;
    }
  | { action: string; [k: string]: any };
```

### ServerChatPayload

Union type for all possible server-to-client WebSocket messages.

```typescript
type ServerChatPayload =
  | {
      type: "chatMessage";
      id: string;
      content: string;
      createdAt: string;
      chatType: "team" | "direct";
      chatId: string;
      updatedAt: string;
      user: {
        userId: string;
        username: string;
        fullName: string;
        avatar: string;
      };
    }
  | {
      type: "chatToast";
      content: string;
      createdAt: string;
      chatType: "team" | "direct";
      id: string;
      updatedAt: string;
      chatId: string;
      user: {
        userId: string;
        username: string;
        fullName: string;
        avatar: string;
      };
    }
  | { type: "user_online"; userId: string }
  | { type: "user_offline"; userId: string }
  | {
      type: "deleteMessage";
      chatId: string;
      messageId: string;
      chatType: "team" | "direct";
    }
  | { type: "chatRead"; chatId: string; userId: string }
  | {
      type: "typingStart";
      chatId: string;
      userId: string;
      fullName: string;
      avatar: string;
    }
  | { type: "typingEnd"; chatId: string; userId: string }
  | { type: string; [k: string]: any };
```

---

## State Structure

### ChatState

```typescript
interface ChatState {
  ws: boolean;                    // WebSocket instance exists
  status: "idle" | "connecting" | "connected" | "closed" | "error" | "reconnecting";
  messages: ChatMessage[];        // Legacy message array (limited to 100)
  readyState: boolean;            // WebSocket is open and ready
  typingUsers: TypingUsersMap;    // Users currently typing per chat
  activeChats: string[];          // Currently joined chat IDs
  reconnectAttempts: number;      // Current reconnection attempt count
  maxReconnectAttempts: number;   // Maximum allowed reconnection attempts (15)
  wsUrl: string;                  // WebSocket base URL from env
  manualClose: boolean;           // User manually disconnected
  pendingPayloads: ServerChatPayload[]; // Queued messages awaiting processing
  messagesCache: MessagesCache;   // Cached messages per chat
}
```

### Initial State

```typescript
const initialState: ChatState = {
  ws: false,
  status: "idle",
  messages: [],
  readyState: false,
  typingUsers: {},
  activeChats: [],
  reconnectAttempts: 0,
  maxReconnectAttempts: 15,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "",
  manualClose: false,
  pendingPayloads: [],
  messagesCache: {
    team: {},
    direct: {},
  },
};
```

---

## WebSocket Connection

### connectChat (Async Thunk)

Builds the WebSocket URL with authentication token.

```typescript
export const connectChat = createAsyncThunk<
  string,
  { token: string },
  { dispatch: AppDispatch; state: RootState }
>("chat/connect", async ({ token }, { getState, dispatch, rejectWithValue }) => {
  // Validates wsUrl and token
  // Returns: wsUrl + "/ws/chat" + `?token=${token}`
});
```

**Usage:**
```typescript
dispatch(connectChat({ token: userAuthToken }));
```

### setupWebSocket Function

Establishes the WebSocket connection and sets up event handlers.

```typescript
const setupWebSocket = (
  url: string,
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  // Creates WebSocket instance
  // Sets up onopen, onmessage, onerror, onclose handlers
  // Implements reconnection logic with exponential backoff
};
```

**Connection Lifecycle:**

1. **Connecting:** Sets status to "connecting"
2. **Open:** Sets status to "connected", resets reconnection attempts
3. **Error:** Sets status to "error", increments reconnection attempts
4. **Close:** 
   - If manual close: Sets status to "closed"
   - If max attempts reached: Sets status to "closed"
   - Otherwise: Schedules reconnection with exponential backoff

**Reconnection Strategy:**

- Base delay: 500ms
- Exponential multiplier: 1.8
- Maximum delay: 30 seconds
- Random jitter: 0-300ms
- Formula: `min(30000, 500 * 1.8^attempts) + random(0-300)`

---

## Actions & Reducers

### Connection Management Actions

#### setWebSocket
Tracks WebSocket instance existence (note: actual WebSocket is stored outside Redux).

```typescript
setWebSocket(state, action: PayloadAction<boolean>)
```

#### setStatus
Updates the connection status.

```typescript
setStatus(state, action: PayloadAction<ChatState["status"]>)
```

#### setReadyState
Updates whether the WebSocket is ready to send messages.

```typescript
setReadyState(state, action: PayloadAction<boolean>)
```

#### setManualClose
Flags whether the user manually disconnected.

```typescript
setManualClose(state, action: PayloadAction<boolean>)
```

#### setReconnectAttempts
Sets the reconnection attempt counter.

```typescript
setReconnectAttempts(state, action: PayloadAction<number>)
```

#### incrementReconnectAttempts
Increments the reconnection attempt counter.

```typescript
incrementReconnectAttempts(state)
```

#### disconnectChat
Manually closes the WebSocket connection and cleans up resources.

```typescript
disconnectChat(state)
```

**Effects:**
- Sets `manualClose` to true
- Sets `status` to "closed"
- Sets `readyState` to false
- Clears `activeChats`
- Closes WebSocket instance
- Clears all timeouts

---

### Message Management Actions

#### pushMessage
Adds a message to the legacy messages array (limited to 100).

```typescript
pushMessage(state, action: PayloadAction<ChatMessage>)
```

#### clearMessages
Clears all messages from the legacy array.

```typescript
clearMessages(state)
```

#### addMessageToCache
Adds a message to a specific chat cache.

```typescript
addMessageToCache(
  state,
  action: PayloadAction<{
    chatType: "team" | "direct";
    chatId: string;
    message: Message;
  }>
)
```

**Note:** If cache doesn't exist, this action returns early. Use `addMessageToCacheAsync` for automatic cache initialization.

#### deleteMessageFromCache
Removes a message from a specific chat cache.

```typescript
deleteMessageFromCache(
  state,
  action: PayloadAction<{
    chatType: "team" | "direct";
    chatId: string;
    messageId: string;
  }>
)
```

#### updateMessageReadStatus
Marks messages as read for a specific user in a direct chat.

```typescript
updateMessageReadStatus(
  state,
  action: PayloadAction<{ chatId: string; userId: string }>
)
```

**Behavior:** Iterates backwards through messages, marking all consecutive messages from the specified user as read.

---

### Cache Management Actions

#### setChatMessages
Initializes or replaces the entire message cache for a chat.

```typescript
setChatMessages(
  state,
  action: PayloadAction<{
    chatType: "team" | "direct";
    chatId: string;
    messages: Message[];
    pagination?: PaginationInfo | null;
  }>
)
```

#### updateChatCache
Updates specific fields in a chat cache.

```typescript
updateChatCache(
  state,
  action: PayloadAction<{
    chatType: "team" | "direct";
    chatId: string;
    updates: Partial<ChatCache>;
  }>
)
```

**Note:** Creates cache if it doesn't exist.

#### updateIsFetched
Marks a chat cache as fetched.

```typescript
updateIsFetched(
  state,
  action: PayloadAction<{ chatType: "team" | "direct"; chatId: string }>
)
```

#### clearChatCache
Removes the cache for a specific chat.

```typescript
clearChatCache(
  state,
  action: PayloadAction<{ chatType: "team" | "direct"; chatId: string }>
)
```

#### clearAllChatCaches
Removes all cached messages for all chats.

```typescript
clearAllChatCaches(state)
```

---

### Active Chat Management

#### addActiveChat
Adds a chat ID to the active chats list.

```typescript
addActiveChat(state, action: PayloadAction<string>)
```

**Note:** Prevents duplicates.

#### removeActiveChat
Removes a chat ID from the active chats list.

```typescript
removeActiveChat(state, action: PayloadAction<string>)
```

---

### Typing Indicator Actions

#### addTypingUser
Adds a user to the typing users list for a specific chat.

```typescript
addTypingUser(
  state,
  action: PayloadAction<{
    chatId: string;
    userId: string;
    fullName: string;
    avatar: string;
  }>
)
```

#### removeTypingUser
Removes a user from the typing users list for a specific chat.

```typescript
removeTypingUser(
  state,
  action: PayloadAction<{ chatId: string; userId: string }>
)
```

---

### Payload Queue Actions

#### enqueuePendingPayload
Adds a server payload to the processing queue.

```typescript
enqueuePendingPayload(state, action: PayloadAction<ServerChatPayload>)
```

#### clearPendingPayloads
Clears all pending payloads.

```typescript
clearPendingPayloads(state)
```

---

## Async Thunks

### addMessageToCacheAsync

Asynchronously adds a message to cache, fetching initial messages if cache doesn't exist.

```typescript
export const addMessageToCacheAsync = createAsyncThunk<
  void,
  { chatType: "team" | "direct"; chatId: string; message: Message },
  { state: RootState; dispatch: AppDispatch }
>("chat/addMessageToCacheAsync", async (payload, { getState, dispatch }) => {
  // If cache missing or not fetched:
  //   1. Fetches messages from API (page 1, limit 30, skip 1)
  //   2. Updates cache with fetched messages
  //   3. Sets isFetched to false (to trigger read status update)
  // Finally adds the new message to cache
});
```

**API Endpoint:**
```
GET /api/chat/messages/get?chatType={chatType}&chatId={chatId}&page=1&limit=30&skip=1
```

**Use Case:** Called when a `chatToast` payload is received (message for a chat the user isn't currently viewing).

---

## Helper Functions

### processPayload

Processes incoming server payloads and dispatches appropriate actions.

```typescript
const processPayload = (payload: ServerChatPayload, dispatch: AppDispatch) => {
  // Switches on payload.type and dispatches corresponding actions
};
```

**Handled Payload Types:**

- `user_online`: Adds user to online users list
- `user_offline`: Removes user from online users list
- `chatMessage`: Adds message to cache (for active chat)
- `chatToast`: Shows notification and adds message asynchronously
- `deleteMessage`: Removes message from cache
- `chatRead`: Updates read status for messages
- `typingStart`: Adds user to typing indicators
- `typingEnd`: Removes user from typing indicators

### flushPayloads

Processes all pending payloads in FIFO order.

```typescript
const flushPayloads = (dispatch: AppDispatch, getState: () => RootState) => {
  // Clears timeout
  // Copies pending payloads
  // Clears pending queue
  // Processes each payload
};
```

**Trigger:** Scheduled with `setTimeout(..., 0)` after enqueueing payloads.

### handleServerMessage

Parses WebSocket messages and enqueues them for processing.

```typescript
const handleServerMessage = (
  raw: MessageEvent,
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  // Parses JSON
  // Enqueues payload
  // Schedules flush if needed
};
```

---

## Message Sending

### sendChatMessage

Sends a message via WebSocket with automatic retry.

```typescript
export const sendChatMessage = (msg: ClientChatMessage) => {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    // Checks if WebSocket is open
    // Sends message or retries after 100ms
    // Returns true/false for success/failure
  };
};
```

**Return Value:**
- `true`: Message sent successfully
- `false`: WebSocket not open or send failed

### Helper Action Creators

#### joinChat
Joins a chat room.

```typescript
export const joinChat = (chatType: "team" | "direct", chatId: string) => {
  return sendChatMessage({ action: "join", chatType, chatId });
};
```

#### leaveChat
Leaves a chat room.

```typescript
export const leaveChat = (chatType: "team" | "direct", chatId: string) => {
  return sendChatMessage({ action: "leave", chatType, chatId });
};
```

#### sendMessage
Sends a chat message.

```typescript
export const sendMessage = (
  chatType: "team" | "direct",
  chatId: string,
  id: string,
  content: string,
  createdAt: string,
  updatedAt: string,
  reciverId: string
) => {
  return sendChatMessage({
    action: "send_message",
    chatType,
    chatId,
    content,
    id,
    createdAt,
    updatedAt,
    reciverId,
  });
};
```

#### sendTyping
Sends typing indicator status.

```typescript
export const sendTyping = (
  chatType: "team" | "direct",
  chatId: string,
  isTyping: boolean
) => {
  return sendChatMessage({ action: "typing", chatType, chatId, isTyping });
};
```

---

## Selectors

### Connection Selectors

#### selectChatStatus
Returns the current connection status.

```typescript
export const selectChatStatus = (state: RootState) => state.chat.status;
```

#### selectChatReadyState
Returns whether the WebSocket is ready to send messages.

```typescript
export const selectChatReadyState = (state: RootState) => state.chat.readyState;
```

#### selectIsConnected
Returns whether the chat is connected.

```typescript
export const selectIsConnected = (state: RootState) =>
  state.chat.status === "connected";
```

### Chat Selectors

#### selectActiveChats
Returns the list of active chat IDs.

```typescript
export const selectActiveChats = (state: RootState) => state.chat.activeChats;
```

#### selectMessagesCache
Returns the entire messages cache.

```typescript
export const selectMessagesCache = (state: RootState) =>
  state.chat.messagesCache;
```

#### selectChatMessagesForChat
Returns messages for a specific chat.

```typescript
export const selectChatMessagesForChat = (
  state: RootState,
  chatType: "team" | "direct",
  chatId: string
) => state.chat.messagesCache[chatType]?.[chatId]?.messages || [];
```

#### selectChatCache
Returns the complete cache object for a specific chat.

```typescript
export const selectChatCache = (
  state: RootState,
  chatType: "team" | "direct",
  chatId: string
) => {
  return (
    state.chat.messagesCache[chatType]?.[chatId] || {
      messages: [],
      pagination: null,
      currentPage: 1,
      isFetched: false,
    }
  );
};
```

---

## Usage Examples

### 1. Connecting to Chat

```typescript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectChat, setupWebSocket, selectChatStatus } from './chatSlice';

function ChatInitializer() {
  const dispatch = useDispatch();
  const status = useSelector(selectChatStatus);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token && (status === 'idle' || status === 'reconnecting')) {
      dispatch(connectChat({ token }))
        .unwrap()
        .then((url) => {
          setupWebSocket(url, dispatch, () => store.getState());
        })
        .catch((err) => {
          console.error('Failed to connect:', err);
        });
    }
  }, [token, status, dispatch]);

  return null;
}
```

### 2. Joining a Chat Room

```typescript
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { joinChat, leaveChat } from './chatSlice';

function ChatRoom({ chatType, chatId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Join chat when component mounts
    dispatch(joinChat(chatType, chatId));

    // Leave chat when component unmounts
    return () => {
      dispatch(leaveChat(chatType, chatId));
    };
  }, [chatType, chatId, dispatch]);

  return <div>Chat Room Content</div>;
}
```

### 3. Sending a Message

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, selectIsConnected } from './chatSlice';
import { v4 as uuidv4 } from 'uuid';

function MessageInput({ chatType, chatId, receiverId }) {
  const dispatch = useDispatch();
  const isConnected = useSelector(selectIsConnected);
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim() || !isConnected) return;

    const id = uuidv4();
    const now = new Date().toISOString();

    const success = dispatch(
      sendMessage(chatType, chatId, id, content, now, now, receiverId)
    );

    if (success) {
      setContent('');
    }
  };

  return (
    <div>
      <input 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        disabled={!isConnected}
      />
      <button onClick={handleSend} disabled={!isConnected}>
        Send
      </button>
    </div>
  );
}
```

### 4. Displaying Messages

```typescript
import { useSelector } from 'react-redux';
import { selectChatMessagesForChat } from './chatSlice';

function MessageList({ chatType, chatId }) {
  const messages = useSelector((state) =>
    selectChatMessagesForChat(state, chatType, chatId)
  );

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.sender.fullName}:</strong> {msg.content}
          {msg.isRead && <span>✓</span>}
        </div>
      ))}
    </div>
  );
}
```

### 5. Typing Indicators

```typescript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendTyping } from './chatSlice';

function MessageInput({ chatType, chatId }) {
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const typingUsers = useSelector(
    (state) => state.chat.typingUsers[chatId] || []
  );

  useEffect(() => {
    let timeout;
    if (isTyping) {
      dispatch(sendTyping(chatType, chatId, true));
      timeout = setTimeout(() => {
        setIsTyping(false);
        dispatch(sendTyping(chatType, chatId, false));
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping, chatType, chatId, dispatch]);

  const handleChange = (e) => {
    if (!isTyping) setIsTyping(true);
    // Handle input...
  };

  return (
    <div>
      <input onChange={handleChange} />
      {typingUsers.length > 0 && (
        <div>
          {typingUsers.map((u) => u.fullName).join(', ')} typing...
        </div>
      )}
    </div>
  );
}
```

### 6. Loading Chat History

```typescript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChatMessages, selectChatCache, updateIsFetched } from './chatSlice';

function ChatHistory({ chatType, chatId }) {
  const dispatch = useDispatch();
  const cache = useSelector((state) => selectChatCache(state, chatType, chatId));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cache.isFetched && !loading) {
      setLoading(true);
      fetch(`/api/chat/messages/get?chatType=${chatType}&chatId=${chatId}&page=1&limit=30`)
        .then((res) => res.json())
        .then((data) => {
          dispatch(
            setChatMessages({
              chatType,
              chatId,
              messages: data.messages,
              pagination: data.pagination,
            })
          );
          dispatch(updateIsFetched({ chatType, chatId }));
        })
        .finally(() => setLoading(false));
    }
  }, [chatType, chatId, cache.isFetched, loading, dispatch]);

  if (loading) return <div>Loading...</div>;

  return <div>{/* Render messages */}</div>;
}
```

### 7. Disconnecting

```typescript
import { useDispatch } from 'react-redux';
import { disconnectChat } from './chatSlice';

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(disconnectChat());
    // Perform other logout actions...
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 8. Connection Status Indicator

```typescript
import { useSelector } from 'react-redux';
import { selectChatStatus } from './chatSlice';

function ConnectionStatus() {
  const status = useSelector(selectChatStatus);

  const statusConfig = {
    idle: { color: 'gray', text: 'Not connected' },
    connecting: { color: 'yellow', text: 'Connecting...' },
    connected: { color: 'green', text: 'Connected' },
    reconnecting: { color: 'orange', text: 'Reconnecting...' },
    error: { color: 'red', text: 'Connection error' },
    closed: { color: 'red', text: 'Disconnected' },
  };

  const { color, text } = statusConfig[status];

  return (
    <div style={{ color }}>
      <span>●</span> {text}
    </div>
  );
}
```

---

## Best Practices

### 1. Always Check Connection Status

Before sending messages, verify the connection is ready:

```typescript
const isConnected = useSelector(selectIsConnected);
if (!isConnected) {
  // Show error or disable UI
  return;
}
```

### 2. Clean Up Active Chats

Always leave chats when unmounting components:

```typescript
useEffect(() => {
  dispatch(joinChat(chatType, chatId));
  return () => dispatch(leaveChat(chatType, chatId));
}, [chatType, chatId]);
```

### 3. Handle Message Send Failures

The `sendMessage` action returns a boolean indicating success:

```typescript
const success = dispatch(sendMessage(...));
if (!success) {
  // Show retry option or error message
}
```

### 4. Use Selectors for Derived Data

Create custom selectors for complex queries:

```typescript
export const selectUnreadMessageCount = (
  state: RootState,
  chatType: "team" | "direct",
  chatId: string
) => {
  const messages = selectChatMessagesForChat(state, chatType, chatId);
  return messages.filter((msg) => !msg.isRead).length;
};
```

### 5. Debounce Typing Indicators

Avoid sending typing events on every keystroke:

```typescript
const debouncedTyping = useMemo(
  () => debounce((typing: boolean) => {
    dispatch(sendTyping(chatType, chatId, typing));
  }, 500),
  [chatType, chatId]
);
```

### 6. Cache Invalidation

Clear caches when users log out or switch accounts:

```typescript
dispatch(clearAllChatCaches());
dispatch(disconnectChat());
```

---

## Troubleshooting

### Connection Issues

**Problem:** WebSocket fails to connect

**Solutions:**
- Verify `NEXT_PUBLIC_WS_URL` is set correctly
- Check authentication token is valid
- Ensure WebSocket server is running
- Check browser console for CORS errors

### Messages Not Appearing

**Problem:** Sent messages don't appear in the UI

**Solutions:**
- Verify chat is joined with `joinChat` before sending
- Check if `addMessageToCache` is being called for `chatMessage` payloads
- Ensure cache exists or use `addMessageToCacheAsync`
- Check if `processPayload` is handling the payload type correctly

### Reconnection Loop

**Problem:** WebSocket continuously reconnects

**Solutions:**
- Check if server is rejecting connections (auth issues)
- Verify token hasn't expired
- Ensure `manualClose` is false when expecting auto-reconnect
- Check if max reconnection attempts has been reached (15)

### Memory Leaks

**Problem:** Application slows down over time

**Solutions:**
- Clear old messages with `clearMessages` or `clearChatCache`
- Unsubscribe from chats when unmounting components
- Ensure `leaveChat` is called in cleanup functions

---

## Architecture Notes

### Why WebSocket Outside Redux?

The WebSocket instance is stored outside Redux (`wsInstance`) because WebSocket objects are not serializable and Redux requires all state to be serializable.

### Payload Batching

Server payloads are queued and processed in batches to:
- Prevent UI blocking during message floods
- Allow single render cycle for multiple updates
- Maintain message order (FIFO processing)

### Cache Structure

Messages are cached separately by `chatType` and `chatId` to:
- Optimize memory usage (only cache active chats)
- Enable independent pagination per chat
- Allow selective cache clearing

### Two Message Arrays

The slice maintains both `messages` (legacy, limited to 100) and `messagesCache` (modern, per-chat) to support migration and backwards compatibility.

---