

# 📘 Chat Sidebar — Documentation

## Purpose

The **Sidebar** is the **navigation and discovery layer** of the chat system.

It allows users to:

* View **Teams** and **Direct Messages**
* See **unread indicators**
* Switch between chats
* Search **locally** and **globally**
* Open quick chat popups
* Collapse / expand sidebar on smaller screens

The Sidebar does **not** manage chat data itself — it only **reads state and emits selection events**.

---

## Props

```ts
interface SidebarProps {
  dmAndTeam: DMAndTeamResult;
  selectedChat: {
    type: "team" | "direct";
    id: string;
    name: string;
  } | null;
  setSelectedChat: (chat: {
    type: "team" | "direct";
    id: string;
    name: string;
  }) => void;
}
```

### Responsibilities of each prop

* **`dmAndTeam`**

  * Pre-fetched, normalized chat metadata
  * Single source of truth for sidebar rendering

* **`selectedChat`**

  * Determines active highlight state
  * Prevents sidebar from owning chat state

* **`setSelectedChat`**

  * Emits intent only
  * Actual chat logic handled elsewhere

---

## Internal State

### 1️⃣ Search & Filtering

```ts
const [searchTerm, setSearchTerm]
const [activeTab, setActiveTab] // "all" | "unread"
const [searchMode, setSearchMode] // "local" | "global"
```

* **Local search**

  * Filters existing `dmAndTeam` data
* **Global search**

  * Calls backend search APIs
* **Unread tab**

  * Filters based on `lastMessageRead`

---

### 2️⃣ Remote Search State

```ts
const [showFetched, setShowFetched]
const [fetchedData, setFetchedData]
```

Why this exists:

* Avoid mixing **local data** and **API results**
* Clear UX boundary between:

  * “Chats you already have”
  * “New users / teams globally”

---

### 3️⃣ Sidebar Visibility

```ts
const [isSidebarOpen, setIsSidebarOpen]
```

* Mobile-first UX
* Sidebar can collapse into a floating toggle button
* Desktop remains persistent

---

## Derived Data (Memoized)

### Filtered Teams

```ts
filteredTeams = useMemo(...)
```

Filters by:

* unread state
* search term
* local data only

---

### Filtered Users

```ts
filteredUsers = useMemo(...)
```

Filters by:

* unread state
* fullName
* username

---

## Rendering Logic

### 🧩 Sections

1. **Search Header**

   * Input
   * Local / Global toggle
   * Tabs (All / Unread)

2. **Teams Section**

   * Local teams
   * OR global search results
   * Shows:

     * member count
     * unread dot
     * project navigation
     * quick chat popup

3. **Users Section**

   * Direct messages
   * OR global user search
   * Uses `UserListItem` for local chats

---

## Events Emitted

| Action          | Effect            |
| --------------- | ----------------- |
| Click team/user | `setSelectedChat` |
| Quick send      | `updateChatPopUp` |
| Global search   | Fetch API         |
| Clear search    | Reset to local    |

---

## Key Design Decisions

### ✅ Sidebar does NOT own chat state

* Prevents re-renders
* Keeps Chat page as orchestrator

### ✅ Local vs Global search split

* Avoids unnecessary API calls
* Improves UX clarity

### ✅ Unread logic handled at metadata level

* No message-level inspection here
* Cheap and fast

---

## Summary

The Sidebar is:

* **Pure UI + filtering**
* **State-light**
* **Highly optimized**
* **Scales with chat types**

---

# 📘 UserListItem — Documentation

## Purpose

`UserListItem` represents **one direct message entry** inside the Sidebar.

It handles:

* Online/offline status
* Unread message indicator
* Selection highlight
* Quick chat popup trigger

It is **memoized** for performance.

---

## Types

### `DirectChatUser`

```ts
export type DirectChatUser = {
  id: string;           // chatId (friendship id)
  userId: string;       // actual user id
  fullName: string;
  username: string;
  avatar?: string | null;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};
```

### `SelectedChat`

```ts
export type SelectedChat =
  | { type: "direct"; id: string; name: string }
  | { type: "team"; id: string; name: string }
  | null;
```

---

## Props

```ts
interface UserListItemProps {
  user: DirectChatUser;
  selectedChat: SelectedChat;
  setSelectedChat: (chat: Exclude<SelectedChat, null>) => void;
  clearSearch?: () => void;
}
```

---

## Internal Logic

### 🟢 Online Status

```ts
const isOnline = useAppSelector(...)
```

* Uses global `onlineUser` slice
* Zero re-renders for unrelated users

---

### 🔵 Unread Detection

```ts
const last = useAppSelector(...)
```

* Reads last message from Redux cache
* Updates unread dot reactively
* No polling
* No backend calls

---

## Actions

### Select Chat

```ts
setSelectedChat({ type: "direct", id, name })
```

* Updates active chat
* Clears search if needed

---

### Open Popup Chat

```ts
updateChatPopUp({ isOpen: true, selectedChat })
```

* Does not change main chat
* Allows parallel conversations

---

## Rendering States

| State    | UI                   |
| -------- | -------------------- |
| Selected | Highlight background |
| Online   | Green dot            |
| Offline  | Gray                 |
| Unread   | Blue indicator       |
| Hover    | Quick send button    |

---

## Memoization Strategy

```ts
export default memo(UserListItem)
```

Why memo works here:

* Stable props
* Redux selectors scoped per user
* Prevents sidebar-wide re-renders

---

## Key Design Decisions

### ✅ No message rendering here

* Keeps sidebar fast

### ✅ Uses Redux cache, not props

* Ensures real-time sync

### ✅ Quick-send is optional

* Desktop only
* Clean mobile UX

---
