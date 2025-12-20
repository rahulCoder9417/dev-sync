# ChatComponent Documentation

## Overview

`ChatComponent` is a comprehensive real-time messaging interface that handles both team and direct messages. It provides features like message pagination, typing indicators, read receipts, message deletion, and automatic scrolling. The component integrates with Redux for state management and WebSocket for real-time communication.

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [Props & Interfaces](#props--interfaces)
3. [State Management](#state-management)
4. [Core Functionality](#core-functionality)
5. [UI Sections](#ui-sections)
6. [Hooks & Effects](#hooks--effects)
7. [Event Handlers](#event-handlers)
8. [Performance Optimizations](#performance-optimizations)
9. [Usage Examples](#usage-examples)
10. [Integration Guide](#integration-guide)

---

## Component Architecture

### Component Structure

```
ChatComponent
├── Header (Chat info + typing indicators)
├── Main (Messages list + pagination)
└── Footer (Message input + send button)
```

### Dependencies

```typescript
// Redux
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';

// Chat slice actions
import {
  sendChatMessage,
  addMessageToCache,
  setChatMessages,
  selectChatCache,
  Message,
  joinChat,
  leaveChat,
  sendMessage,
  updateMessageReadStatus,
  deleteMessageFromCache,
  updateIsFetched
} from '@/lib/redux/features/chatSlice';

// UI Components
import Avatar from '../main/Avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ShowTypers from "./ShowTypers";

// Utilities
import cuid from 'cuid';
import { showToast } from '../main/Toast';
```

---

## Props & Interfaces

### ChatComponentProps

Main props interface for the component.

```typescript
interface ChatComponentProps {
  selectedChat: SelectedChat | null;
  dmAndTeam: DMAndTeamResult;
}
```

**Properties:**
- `selectedChat`: Currently active chat (team or direct)
- `dmAndTeam`: Combined data for direct messages and teams

### SelectedChat

Represents the currently selected chat.

```typescript
interface SelectedChat {
  type: 'team' | 'direct';  // Chat type
  id: string;                // Chat identifier
  name: string;              // Display name
}
```

**Example:**
```typescript
const teamChat: SelectedChat = {
  type: 'team',
  id: 'team-123',
  name: 'Engineering Team'
};

const directChat: SelectedChat = {
  type: 'direct',
  id: 'dm-456',
  name: 'John Doe'
};
```

### User

User information interface.

```typescript
interface User {
  id: string;
  fullName: string;
  avatar: string;
  username: string;
  status: string;
}
```

### DMAndTeamResult

Contains all teams and direct message friends.

```typescript
interface DMAndTeamResult {
  teams: Array<{
    id: string;
    name: string;
    memberCount: number;
    // ... other team properties
  }>;
  friends: Array<{
    id: string;              // DM identifier
    userId: string;          // Actual user ID
    fullName: string;
    username: string;
    avatar: string;
    // ... other friend properties
  }>;
}
```

**Note:** For direct messages, `id` is the DM conversation ID, while `userId` is the actual user's ID.

---

## State Management

### Constants

```typescript
const DEFAULT_CHAT_CACHE = {
  messages: [],
  pagination: null,
  currentPage: 1,
  isFetched: false
};

const MESSAGES_PER_PAGE = 30;
```

### Local State

```typescript
// Loading states
const [loading, setLoading] = useState(false);
const [fetchingMessages, setFetchingMessages] = useState(false);

// UI state
const [messageText, setMessageText] = useState('');
const [showChatOptions, setShowChatOptions] = useState<string | null>(null);
```

**State Descriptions:**

| State | Type | Purpose |
|-------|------|---------|
| `loading` | boolean | Indicates API request in progress |
| `fetchingMessages` | boolean | Flag for pagination loading |
| `messageText` | string | Current message input value |
| `showChatOptions` | string \| null | Message ID with open options menu |

### Refs

```typescript
const userTypingRef = useRef(false);
const messagesEndRef = useRef<HTMLDivElement>(null);
```

**Ref Purposes:**

| Ref | Purpose |
|-----|---------|
| `userTypingRef` | Tracks typing state without re-renders |
| `messagesEndRef` | Target for auto-scrolling to bottom |

### Redux State

```typescript
// Current user data
const currentUserData = useAppSelector((state) => state.user, shallowEqual);

// Online status (for direct messages)
const isOnline = useAppSelector(
  (state) => {
    if (selectedChat?.type !== 'direct') return false;
    const friend = dmAndTeam.friends.find((u) => u.id === selectedChat.id);
    return friend ? state.onlineUser.onlineUsers.includes(friend.userId) : false;
  },
  shallowEqual
);

// Chat cache (messages, pagination, etc.)
const currentChatCache = useAppSelector(
  (state) => selectedChat 
    ? selectChatCache(state, selectedChat.type, selectedChat.id) 
    : DEFAULT_CHAT_CACHE
);
```

### Derived Data

```typescript
const currentUser: User = {
  id: currentUserData.id,
  fullName: currentUserData.fullName,
  avatar: currentUserData.avatar,
  username: currentUserData.username,
  status: "online"
};

const { messages, pagination, currentPage } = currentChatCache;
```

---

## Core Functionality

### 1. Message Fetching

#### fetchMessages

Fetches message history from the API with pagination support.

```typescript
const fetchMessages = useCallback(async (page: number = 1) => {
  if (!selectedChat) return;

  setLoading(true);
  try {
    const response = await fetch(
      `/api/chat/messages/get?chatType=${selectedChat.type}&chatId=${selectedChat.id}&page=${page}&limit=${MESSAGES_PER_PAGE}`
    );

    if (!response.ok) throw new Error('Failed to fetch messages');

    const data = await response.json();
    
    // Prepend older messages for pagination
    const updatedMessages = page === 1
      ? data.messages
      : [...data.messages, ...currentChatCache.messages];

    dispatch(setChatMessages({
      chatType: selectedChat.type,
      chatId: selectedChat.id,
      messages: updatedMessages,
      pagination: data.pagination,
    }));

    // Send read receipt on initial load
    if (page === 1) {
      dispatch(sendChatMessage({
        action: "read",
        chatId: selectedChat.id,
        reciverId: getReceiverUserId(),
      }));
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    setLoading(false);
  }
}, [selectedChat, currentChatCache.messages, dispatch, getReceiverUserId]);
```

**API Response Format:**
```typescript
{
  messages: Message[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasMore: boolean;
    limit: number;
  }
}
```

**Behavior:**
- Page 1: Replaces all messages (fresh load)
- Page 2+: Prepends older messages (pagination)
- Automatically sends read receipt on initial load

### 2. Read Receipts

#### markUnreadMessagesAsRead

Marks all unread messages as read when opening a chat.

```typescript
const markUnreadMessagesAsRead = useCallback(async () => {
  if (!selectedChat || currentChatCache.isFetched) return;

  // Mark cache as fetched to prevent duplicate calls
  dispatch(updateIsFetched({
    chatType: selectedChat.type,
    chatId: selectedChat.id,
  }));

  // Iterate backwards through messages
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].isRead !== false) break;
    
    await fetch(`/api/chat/messages/read`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: messages[i].id })
    });
  }
}, [selectedChat, currentChatCache.isFetched, messages, dispatch]);
```

**Flow:**
1. Check if cache is already fetched (prevent duplicates)
2. Mark cache as fetched
3. Iterate backwards from newest message
4. Stop when encountering a read message
5. Update each unread message via API

### 3. Message Sending

#### handleSend

Sends a new message and updates local cache optimistically.

```typescript
const handleSend = useCallback(() => {
  if (!messageText.trim() || !selectedChat) return;

  // Clear typing indicator
  if (userTypingRef.current) {
    userTypingRef.current = false;
    dispatch(sendChatMessage({
      action: 'typingEnd',
      chatId: selectedChat.id,
    }));
  }

  // Generate unique ID and timestamp
  const id = cuid();
  const timestamp = new Date().toString();
  const receiverUserId = getReceiverUserId();

  // Send via WebSocket
  dispatch(sendMessage(
    selectedChat.type,
    selectedChat.id,
    id,
    messageText,
    timestamp,
    timestamp,
    receiverUserId!
  ));

  // Optimistic update
  const newMessage: Message = {
    id,
    sender: currentUser,
    content: messageText,
    isRead: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  dispatch(addMessageToCache({
    chatType: selectedChat.type,
    chatId: selectedChat.id,
    message: newMessage,
  }));

  setMessageText('');
}, [messageText, selectedChat, currentUser, dispatch, getReceiverUserId]);
```

**Message Flow:**
1. Validate input and selected chat
2. Clear typing indicator if active
3. Generate unique ID (cuid) and timestamp
4. Send message via WebSocket
5. Add message to local cache (optimistic update)
6. Clear input field

### 4. Message Deletion

#### handleDelete

Deletes a message either locally or for everyone.

```typescript
const handleDelete = useCallback(async (
  msgId: string, 
  forEveryone: boolean = false
) => {
  if (!selectedChat) return;

  // Optimistic deletion from cache
  dispatch(deleteMessageFromCache({
    chatType: selectedChat.type,
    chatId: selectedChat.id,
    messageId: msgId,
  }));
  setShowChatOptions(null);

  try {
    const res = await fetch(`/api/chat/messages/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: msgId,
        forEveryone,
        chatId: selectedChat.id,
        chatType: selectedChat.type
      })
    });

    const data = await res.json();
    
    if (data.message === undefined) {
      showToast(false, "Failed to delete message", data.error);
      return;
    }

    // Broadcast deletion to other users
    if (data.message === "Message deleted" && forEveryone) {
      dispatch(sendChatMessage({
        action: "deleteMessage",
        chatType: selectedChat.type,
        chatId: selectedChat.id,
        messageId: msgId,
      }));
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    showToast(false, "Failed to delete message", "An error occurred");
  }
}, [selectedChat, dispatch]);
```

**Deletion Types:**

| Type | Behavior |
|------|----------|
| For me | Removes from local cache only |
| For everyone | Broadcasts deletion via WebSocket |

**API Request:**
```typescript
{
  messageId: string;
  forEveryone: boolean;
  chatId: string;
  chatType: "team" | "direct";
}
```

### 5. Typing Indicators

#### handleTypingStart

Notifies other users that current user is typing.

```typescript
const handleTypingStart = useCallback(() => {
  if (userTypingRef.current || !selectedChat) return;
  
  userTypingRef.current = true;
  dispatch(sendChatMessage({
    action: 'typingStart',
    chatId: selectedChat.id,
  }));
}, [selectedChat, dispatch]);
```

#### handleTypingEnd

Notifies other users that current user stopped typing.

```typescript
const handleTypingEnd = useCallback(() => {
  if (!userTypingRef.current || !selectedChat) return;
  
  userTypingRef.current = false;
  dispatch(sendChatMessage({
    action: "typingEnd",
    chatId: selectedChat.id,
  }));
}, [selectedChat, dispatch]);
```

**Usage in Input:**
```typescript
<Input
  value={messageText}
  onChange={(e) => {
    setMessageText(e.target.value);
    handleTypingStart();  // Start typing on change
  }}
  onBlur={handleTypingEnd}  // End typing on blur
/>
```

### 6. Pagination

#### loadMoreMessages

Loads older messages when user scrolls to top.

```typescript
const loadMoreMessages = useCallback(() => {
  if (pagination?.hasMore && !loading) {
    setFetchingMessages(true);
    fetchMessages(currentPage + 1);
  }
}, [pagination, loading, currentPage, fetchMessages]);
```

**Button Rendering:**
```typescript
{pagination?.hasMore && (
  <Button
    onClick={loadMoreMessages}
    disabled={loading}
  >
    {loading ? 'Loading...' : 
      `Load More (${pagination.totalMessages - messages.length} remaining)`
    }
  </Button>
)}
```

### 7. Helper Functions

#### getReceiverUserId

Retrieves the user ID for direct message recipient.

```typescript
const getReceiverUserId = useCallback(() => {
  if (selectedChat?.type !== 'direct') return undefined;
  return dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.userId;
}, [selectedChat, dmAndTeam.friends]);
```

**Important:** Returns `userId` (actual user ID), not `id` (DM conversation ID).

---

## UI Sections

### 1. Chat Header

Displays chat information and typing indicators.

```typescript
<header className="h-16 bg-card border-b border-primary">
  <div className="flex items-center gap-4">
    {/* Avatar/Icon */}
    {selectedChat.type === 'team' ? (
      <div className="w-10 h-10 rounded-lg">
        <Users className="h-5 w-5" />
      </div>
    ) : (
      <Avatar
        fullName={selectedChat.name}
        avatar={selectedFriend?.avatar}
        status={isOnline ? 'online' : 'offline'}
      />
    )}
    
    {/* Chat Info */}
    <div>
      <h2>{selectedChat.name}</h2>
      {selectedChat.type === 'team' && (
        <p>{selectedTeam?.memberCount} members</p>
      )}
    </div>
  </div>
  
  {/* Typing Indicators */}
  <ShowTypers selectedChat={selectedChat} />
</header>
```

**Features:**
- Team chats: Shows Users icon and member count
- Direct messages: Shows avatar with online status
- Typing indicators via `ShowTypers` component

### 2. Messages List

Displays messages with pagination and loading states.

```typescript
<main className="flex-1 overflow-y-auto p-6">
  {/* Load More Button */}
  {pagination?.hasMore && (
    <Button onClick={loadMoreMessages} disabled={loading}>
      {loading ? 'Loading...' : 
        `Load More (${pagination.totalMessages - messages.length})`
      }
    </Button>
  )}

  {/* Loading State */}
  {loading && messages.length === 0 && (
    <Loader2 className="animate-spin" />
  )}

  {/* Messages */}
  {messages.map((msg) => (
    <MessageItem key={msg.id} message={msg} />
  ))}

  {/* Empty State */}
  {!loading && messages.length === 0 && (
    <p>No messages yet. Start the conversation!</p>
  )}

  {/* Auto-scroll Target */}
  <div ref={messagesEndRef} />
</main>
```

### 3. Message Item

Individual message with options menu.

```typescript
<div className="flex gap-4">
  {/* Avatar */}
  <div>
    <Avatar
      fullName={msg.sender.fullName}
      avatar={msg.sender.avatar}
    />
    
    {/* Read Receipt Indicator (Direct Messages Only) */}
    {selectedChat.type === 'direct' && (
      <div className={`size-3 rounded-full ${
        msg.isRead ? 'bg-blue-800' : 'bg-secondary'
      }`} />
    )}
  </div>

  {/* Message Content */}
  <div>
    {/* Sender & Timestamp */}
    <div className="flex items-baseline gap-3">
      <span className={`font-semibold ${
        isCurrentUser ? '!text-[#cdc6c6]' : ''
      }`}>
        {msg.sender.fullName}
      </span>
      <span className="text-xs text-secondary">
        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>

    {/* Message Text */}
    <div
      className="relative chat-message"
      onClick={(e) => {
        e.stopPropagation();
        setShowChatOptions((prev) => 
          prev === msg.id ? null : msg.id
        );
      }}
    >
      <p className={`rounded-lg p-2 ${
        isCurrentUser ? 'bg-[#1f1d1d]' : 'bg-secondary'
      }`}>
        {msg.content}
      </p>

      {/* Options Menu */}
      {showChatOptions === msg.id && (
        <div className="absolute left-20 top-full mt-1">
          <button onClick={() => handleDelete(msg.id)}>
            <Trash /> For me
          </button>
          
          {isCurrentUser && (
            <button onClick={() => handleDelete(msg.id, true)}>
              <Trash2 /> For everyone
            </button>
          )}
        </div>
      )}
    </div>
  </div>
</div>
```

**Message Features:**
- Avatar with sender info
- Read receipt indicator (direct messages)
- Timestamp
- Delete options (for me / for everyone)
- Different styling for current user's messages

### 4. Message Input

Input field with send button and typing detection.

```typescript
<footer className="p-6 bg-card border-t border-primary">
  <div className="flex gap-3">
    <Input
      value={messageText}
      onChange={(e) => {
        setMessageText(e.target.value);
        handleTypingStart();
      }}
      onBlur={handleTypingEnd}
      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      placeholder={`Message ${selectedChat.name}...`}
    />
    <Button onClick={handleSend} size="icon">
      <Send className="h-5 w-5" />
    </Button>
  </div>
</footer>
```

**Input Behaviors:**
- Triggers typing indicator on change
- Clears typing indicator on blur
- Sends message on Enter key
- Sends message on button click

---

## Hooks & Effects

### 1. Auto-scroll Effect

Scrolls to bottom when new messages arrive.

```typescript
useEffect(() => {
  if (fetchingMessages) {
    setFetchingMessages(false);
    return;
  }
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, fetchingMessages]);
```

**Behavior:**
- Skips scrolling during pagination (when `fetchingMessages` is true)
- Smooth scrolls to bottom on new messages
- Depends on messages array changes

### 2. Click Outside Effect

Closes message options menu when clicking outside.

```typescript
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".chat-message")) {
      setShowChatOptions(null);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
```

**Behavior:**
- Listens for clicks on document
- Closes options if click is outside `.chat-message` elements
- Cleanup removes listener on unmount

### 3. Chat Lifecycle Effect

Main effect managing chat joining, message loading, and cleanup.

```typescript
useEffect(() => {
  if (!selectedChat) return;

  // 1. Join chat
  dispatch(joinChat(selectedChat.type, selectedChat.id));

  // 2. Fetch messages if not cached
  if (currentChatCache.messages.length === 0 && !currentChatCache.isFetched) {
    fetchMessages(1);
  }

  // 3. Mark messages as read
  if (currentChatCache.messages.length > 0 && !currentChatCache.isFetched) {
    markUnreadMessagesAsRead();
  }

  // 4. Send read receipt for direct messages
  if (selectedChat.type === "direct" && currentChatCache.messages.length > 0) {
    const lastMessage = currentChatCache.messages[
      currentChatCache.messages.length - 1
    ];
    
    if (lastMessage.sender.id !== currentUserData.id) {
      dispatch(sendChatMessage({
        action: "read",
        chatId: selectedChat.id,
        reciverId: getReceiverUserId(),
      }));

      if (lastMessage.isRead === false) {
        dispatch(updateMessageReadStatus({
          chatId: selectedChat.id,
          userId: getReceiverUserId()!
        }));
      }
    }
  }

  // 5. Handle page unload
  const handleBeforeUnload = () => {
    dispatch(leaveChat(selectedChat.type, selectedChat.id));
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  // 6. Cleanup
  return () => {
    dispatch(leaveChat(selectedChat.type, selectedChat.id));
    dispatch(sendChatMessage({
      action: 'typingEnd',
      chatId: selectedChat.id,
    }));
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [selectedChat?.id, selectedChat?.type]);
```

**Lifecycle Flow:**

```
Component Mount
    ↓
Join Chat (WebSocket)
    ↓
Check Cache
    ├─ Empty → Fetch Messages
    └─ Has Messages → Mark as Read
    ↓
Send Read Receipt (DM only)
    ↓
Active State
    ↓
Component Unmount/Chat Switch
    ↓
Leave Chat (WebSocket)
    ↓
Clear Typing Indicator
```

---

## Event Handlers

### Input Events

```typescript
// Text change
onChange={(e) => {
  setMessageText(e.target.value);
  handleTypingStart();
}}

// Focus loss
onBlur={handleTypingEnd}

// Enter key
onKeyDown={(e) => e.key === 'Enter' && handleSend()}
```

### Button Events

```typescript
// Send message
<Button onClick={handleSend}>

// Load more messages
<Button onClick={loadMoreMessages}>

// Delete message
<button onClick={() => handleDelete(msgId)}>
<button onClick={() => handleDelete(msgId, true)}>
```

### Click Events

```typescript
// Toggle message options
onClick={(e) => {
  e.stopPropagation();
  setShowChatOptions((prev) => prev === msg.id ? null : msg.id);
}}
```

---

## Performance Optimizations

### 1. React.memo

Component is memoized to prevent unnecessary re-renders.

```typescript
export default React.memo(ChatComponent, (prevProps, nextProps) => {
  return prevProps.selectedChat?.id === nextProps.selectedChat?.id &&
    prevProps.selectedChat?.type === nextProps.selectedChat?.type;
});
```

**Comparison:**
- Only re-renders when `selectedChat.id` or `selectedChat.type` changes
- Prevents re-renders when parent updates unrelated props

### 2. useCallback

All event handlers are wrapped in `useCallback` to maintain referential equality.

```typescript
const handleSend = useCallback(() => {
  // ...
}, [messageText, selectedChat, currentUser, dispatch, getReceiverUserId]);

const handleDelete = useCallback(async (msgId, forEveryone) => {
  // ...
}, [selectedChat, dispatch]);

const loadMoreMessages = useCallback(() => {
  // ...
}, [pagination, loading, currentPage, fetchMessages]);
```

**Benefits:**
- Prevents child component re-renders
- Maintains stable function references
- Optimizes dependency arrays in effects

### 3. shallowEqual

Redux selectors use `shallowEqual` for shallow comparison.

```typescript
const currentUserData = useAppSelector(
  (state) => state.user, 
  shallowEqual
);

const isOnline = useAppSelector(
  (state) => {
    // ...
  },
  shallowEqual
);
```

**Benefits:**
- Prevents re-renders when object contents are same
- More efficient than deep equality checks

### 4. Refs for Non-render State

`userTypingRef` tracks typing state without causing re-renders.

```typescript
const userTypingRef = useRef(false);

// Update without re-render
userTypingRef.current = true;
```

**Benefits:**
- Avoids unnecessary component updates
- Faster state updates for transient data

### 5. Optimistic Updates

Messages are added to cache immediately before server confirmation.

```typescript
// Send via WebSocket
dispatch(sendMessage(...));

// Immediate local update
dispatch(addMessageToCache({
  chatType: selectedChat.type,
  chatId: selectedChat.id,
  message: newMessage,
}));
```

**Benefits:**
- Instant UI feedback
- Better perceived performance
- Feels more responsive

---

## Usage Examples

### 1. Basic Integration

```typescript
import ChatComponent from './ChatComponent';

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const dmAndTeam = useFetchDMAndTeam(); // Custom hook

  return (
    <div className="flex h-screen">
      <Sidebar onSelectChat={setSelectedChat} />
      <ChatComponent 
        selectedChat={selectedChat}
        dmAndTeam={dmAndTeam}
      />
    </div>
  );
}
```

### 2. Team Chat Selection

```typescript
function selectTeamChat(teamId: string, teamName: string) {
  setSelectedChat({
    type: 'team',
    id: teamId,
    name: teamName
  });
}

// Usage
<button onClick={() => selectTeamChat('team-123', 'Engineering')}>
  Select Engineering Team
</button>
```

### 3. Direct Message Selection

```typescript
function selectDirectMessage(dmId: string, userName: string) {
  setSelectedChat({
    type: 'direct',
    id: dmId,
    name: userName
  });
}

// Usage
<button onClick={() => selectDirectMessage('dm-456', 'John Doe')}>
  Message John Doe
</button>
```

### 4. Fetching DM and Team Data

```typescript
function useFetchDMAndTeam(): DMAndTeamResult {
  const [data, setData] = useState<DMAndTeamResult>({
    teams: [],
    friends: []
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/chat/dm-and-team');
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  return data;
}
```

### 5. Custom Message Actions

```typescript
// Extend handleDelete to include custom logic
const handleDelete = useCallback(async (msgId: string, forEveryone: boolean) => {
  // Show confirmation dialog
  const confirmed = await showConfirmDialog(
    forEveryone 
      ? 'Delete for everyone?' 
      : 'Delete for yourself?'
  );
  
  if (!confirmed) return;

  // Proceed with deletion
  dispatch(deleteMessageFromCache({
    chatType: selectedChat.type,
    chatId: selectedChat.id,
    messageId: msgId,
  }));
  
  // ... rest of deletion logic
}, [selectedChat, dispatch]);
```

### 6. Message Formatting

```typescript
// Add rich text support
function formatMessage(content: string): JSX.Element {
  // Parse URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return (
    <>
      {parts.map((part, i) => 
        urlRegex.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Use in message display
<p>{formatMessage(msg.content)}</p>
```

### 7. Notification Integration

```typescript
// Add desktop notifications for new messages
useEffect(() => {
  const lastMessage = messages[messages.length - 1];
  
  if (!lastMessage || lastMessage.sender.id === currentUser.id) return;
  
  // Check if user has permission
  if (Notification.permission === 'granted') {
    new Notification(lastMessage.sender.fullName, {
      body: lastMessage.content,
      icon: lastMessage.sender.avatar
    });
  }
}, [messages]);
```

---

## Integration Guide

### 1. Redux Setup

Ensure chat slice is added to store:

```typescript
// store.ts
import chatReducer from './features/chatSlice';
import userReducer from './features/userSlice';
import onlineUserReducer from './features/onlineUserSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
    onlineUser: onlineUserReducer,
  },
});
```

### 2. WebSocket Initialization

Initialize WebSocket before rendering ChatComponent:

```typescript
// App.tsx or ChatInitializer.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';