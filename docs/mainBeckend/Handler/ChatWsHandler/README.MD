
# Chat WebSocket Handler Documentation

This module implements a **real-time chat system** on top of the shared `BaseWsHandler`.
It supports **direct messages**, **team chats**, **typing indicators**, **read receipts**, **presence**, and **notifications**.

---

## Architecture Overview

```
Client
  ⇅ WebSocket (/ws/chat)
ChatWsHandler
  └── extends BaseWsHandler
        ├── Authenticated upgrade
        ├── Heartbeat (ping/pong)
        ├── Safe message handling
        └── Connection lifecycle
```

**Key Dependencies**

* `BaseWsHandler` → connection lifecycle & safety
- Base Handler: [BaseWsHandler README](../BaseWshandler/README.MD)
* `RoomManager` → rooms, users, broadcasts
- Room Manager (Chat): [RoomManager Chat README](../../RoomManager/Chat/README.MD)
* Database actions → messages, read receipts, notifications

---

## WebSocket Path

```ts
/ws/chat
```

All chat traffic flows through this endpoint.

---

## Client → Server Message Protocol

All client messages must conform to the `ChatClientMessage` union type.

```ts
export type ChatClientMessage =
  | SendMessage
  | JoinRoom
  | DeleteMessage
  | LeaveRoom
  | ReadMessage
  | TypingStart
  | TypingEnd;
```

---

## Message Types

### 1. Send Message

```json
{
  "action": "send_message",
  "chatType": "team" | "direct",
  "chatId": "string",
  "id": "message-id",
  "content": "Hello",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE",
  "reciverId": "user-id"
}
```

**Behavior**

* Persists message in DB
* Broadcasts to room members
* Handles read receipts automatically
* Triggers notifications if receiver is offline

---

### 2. Join Chat Room

```json
{
  "action": "join",
  "chatType": "team" | "direct",
  "chatId": "string"
}
```

**Behavior**

* Adds socket to room
* For team chats, broadcasts online status

---

### 3. Leave Chat Room

```json
{
  "action": "leave",
  "chatType": "team" | "direct",
  "chatId": "string"
}
```

**Behavior**

* Removes socket from room
* Stops receiving messages

---

### 4. Delete Message

```json
{
  "action": "deleteMessage",
  "chatId": "string",
  "messageId": "string",
  "chatType": "team" | "direct"
}
```

**Behavior**

* Broadcasts delete event to room
* Client decides how to visually remove message

---

### 5. Read Message (Read Receipt)

```json
{
  "action": "read",
  "chatId": "string",
  "reciverId": "string"
}
```

**Behavior**

* Notifies the other user that messages were read
* Updates DB read status (direct chat)

---

### 6. Typing Indicator (Start)

```json
{
  "action": "typingStart",
  "chatId": "string"
}
```

**Behavior**

* Adds user to typing state
* Broadcasts typing indicator

---

### 7. Typing Indicator (End)

```json
{
  "action": "typingEnd",
  "chatId": "string"
}
```

**Behavior**

* Removes user from typing state
* Broadcasts typing stop

---

## Server → Client Events

### Chat Message

```json
{
  "type": "chatMessage",
  "id": "string",
  "content": "Hello",
  "chatId": "string",
  "chatType": "direct",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE",
  "isRead": true,
  "user": {
    "userId": "string",
    "username": "string",
    "fullName": "string",
    "avatar": "string | null"
  }
}
```

---

### Chat Toast (Direct, Receiver Online but Not in Room)

```json
{
  "type": "chatToast",
  "content": "Hello",
  "chatId": "string",
  "id": "string",
  "isRead": false,
  "user": { ... }
}
```

---

### Read Receipt

```json
{
  "type": "chatRead",
  "chatId": "string",
  "userId": "string"
}
```

---

### Delete Message

```json
{
  "type": "deleteMessage",
  "chatId": "string",
  "messageId": "string",
  "chatType": "direct"
}
```

---

### Presence Events

#### User Online

```json
{
  "type": "user_online",
  "userId": "string"
}
```

#### User Offline

```json
{
  "type": "user_offline",
  "userId": "string"
}
```

#### Team User Online

```json
{
  "type": "userOnlineTeam",
  "userId": "string"
}
```

---

## ChatWsHandler Class

### Inheritance

```ts
export class ChatWsHandler extends BaseWsHandler
```

This means:

* ✔ Authenticated upgrades
* ✔ Heartbeat & stale socket cleanup
* ✔ Safe message handling
* ✔ Automatic disconnect handling

All chat logic is layered **on top** of the base infrastructure.

---

## Core Responsibilities

### `handleMessage`

* Parses JSON safely
* Validates action type
* Routes to correct handler
* Prevents malformed or unknown actions

---

### `handleDisconnect`

* Removes user from all rooms
* Updates global user list
* Notifies friends of offline status

---

### `sendGlobalUserList`

* Adds user to global presence
* Notifies friends when user comes online
* Syncs online state on connection

---

## Message Flow (Direct Chat)

```
Client → send_message
  ↓
ChatWsHandler
  ↓
createMessage (DB)
  ↓
RoomManager
  ├── both users online → mark read + broadcast
  ├── receiver online → toast notification
  └── receiver offline → createNotification
```

---

