
---

# 📘 Chat Page — Documentation

## Purpose

The **Chat page** is the central real-time communication layer of DevSync.
It combines **Direct Messages (DMs)** and **Team Chats** into a single, unified UI.

It is responsible for:

* Rendering the chat layout
* Managing the selected chat state
* Connecting Sidebar → ChatComponent
* Passing pre-fetched chat metadata to child components
* Used in team route -- [team README](../../../appRoute/team/README.MD)
---

## Data Model

### 🔹 `TeamChatItem`

Represents a **team-based chat**, usually associated with a project.

```ts
export type TeamChatItem = {
  type: "team";
  id: string;              // teamId (also chatId)
  name: string;            // team name
  projectId: string;       // linked project
  memberCount: number;     // total team members
  lastMessageRead: boolean;
  lastMessageAt: Date;
};
```

**Design notes**

* `type: "team"` allows discriminated unions
* `projectId` enables quick navigation to project context
* `lastMessageRead` is user-specific (viewer-based)

---

### 🔹 `DMChatItem`

Represents a **direct message chat** between two users.

```ts
export type DMChatItem = {
  type: "dm";
  id: string;              // friendshipId (chatId)
  userId: string;          // the OTHER user
  fullName: string;
  username: string;
  avatar: string | null;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};
```

**Design notes**

* `userId` ≠ `id`

  * `id` → chat identity
  * `userId` → recipient identity
* Optimized for:

  * online status checks
  * read receipts
  * chat toasts

---

### 🔹 `DMAndTeamResult`

Unified payload used across **Sidebar**, **Chat page**, and **ChatComponent**.

```ts
export type DMAndTeamResult = {
  teams: TeamChatItem[];
  friends: DMChatItem[];
};
```

**Why this shape matters**

* Single API call
* Single cache object
* Easy sorting & filtering
* Predictable rendering

---

## Chat Page Component

### File

```
app/chat/page.tsx (or equivalent)
```

### Component

```tsx
"use client";

import React, { useState } from "react";
import Sidebar from "@/components/team/sidebar";
import ChatComponent from "@/components/team/chatComponent";
import { DMAndTeamResult } from "@/lib/types/chat";

type SelectedChat = {
  type: "team" | "direct";
  id: string;
  name: string;
} | null;

const Chat = ({ dmAndTeam }: { dmAndTeam: DMAndTeamResult }) => {
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null);

  return (
    <div className="flex max-h-screen w-screen bg-primary">
      {/* Sidebar */}
      <Sidebar
        dmAndTeam={dmAndTeam}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      {/* Main Chat Area */}
      <ChatComponent
        selectedChat={selectedChat}
        dmAndTeam={dmAndTeam}
      />
    </div>
  );
};

export default Chat;
```

---

## State Ownership

### 🔹 `selectedChat`

Owned **only by the Chat page**.

```ts
type SelectedChat = {
  type: "team" | "direct";
  id: string;
  name: string;
} | null;
```

**Why this matters**

* Prevents Sidebar ↔ ChatComponent coupling
* Makes chat switching predictable
* Enables clean memoization

---

## Component Responsibilities

### 🧭 Chat (Page)

* Owns `selectedChat`
* Passes immutable data downward
* Acts as layout orchestrator

### 📂 Sidebar
* Sidebar [Sidebar README](Sidebar/README.MD)
* Displays:

  * Teams
  * Direct messages
* Updates `selectedChat`
* Handles search & discovery

### 💬 ChatComponent
* ChatComponent [ChatComponent README](ChatComponent/README.MD)
* Handles:

  * WebSocket messaging
  * Typing indicators
  * Read receipts
  * Message pagination
* Uses Redux cache
* Reacts to `selectedChat` changes

---

## Data Flow (High Level)

```
Server (getDMAndTeam)
        ↓
Chat Page
        ↓
 ┌──────────────┐
 │   Sidebar    │ ── setSelectedChat()
 └──────────────┘
        ↓
 ┌──────────────┐
 │ ChatComponent│
 └──────────────┘
```

---

## Key Design Decisions

### ✅ Why `DMAndTeamResult` is passed to both children

* Avoid duplicate fetching
* Shared reference = consistent state
* Enables cross-component logic (online status, read sync)

### ✅ Why Chat Page is client-side

* `selectedChat` is UI state
* WebSocket lifecycle depends on client
* Zero SEO impact

### ✅ Why discriminated unions (`type`)

* Exhaustive checks
* Safer reducers
* Cleaner switches

---
