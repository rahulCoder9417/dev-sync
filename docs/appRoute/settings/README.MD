

# ⚙️ Settings Page — Documentation

## Overview

The **Settings Page** is a client-side dashboard section where users can:

* Edit their **profile information**
* View **friendship statistics**
* Manage their **friends list** (accept / unfriend)

It is **UI-focused**, state-driven, and communicates with backend APIs and server actions.

Route:

```
/settings
```

---

## High-Level Architecture

```
Settings Page
├── Tabs
│   ├── Profile
│   └── Friends
│
├── FriendshipStatus (stats)
│
├── Profile (form)
│
└── FriendsList
    ├── Filters
    ├── FriendRow
    └── Actions (Accept / Unfriend)
```

---

## Data Flow (Important)

### Friends Data

```
/api/friend/userFriends
        ↓
   Settings Page (state)
        ↓
FriendshipStatus
        ↓
   FriendsList
```

### Profile Data

```
Redux Store (user)
        ↓
   Profile Form
        ↓
updateProfile (server action)
        ↓
 Redux update (updateUserInfo)
```

---

## Settings Page (`settings/page.tsx`)

### Responsibilities

* Owns **tab state**
* Fetches **friends data**
* Computes **derived stats**
* Orchestrates child components

### Key Design Decisions

* Uses `useMemo` for derived counts (accepted / pending)
* Uses `AbortController` for safe fetch cancellation
* Keeps logic minimal — delegates UI & actions to children

### State

```ts
activeTab: 'profile' | 'friends'
friends: Friend[]
loading: boolean
```

### Derived State

```ts
acceptedCount
pendingCount
```

No redundant state. Everything is derived cleanly.

---

## Tabs Component

### Purpose

* Switch between **Profile Settings** and **Friends**
* Visual-only component

### Why it’s good

* No internal state
* Fully controlled by parent
* Easy to extend with more tabs later

---

## FriendshipStatus Component

### Purpose

Displays quick stats:

* Accepted friends
* Pending requests

### Props

```ts
acceptedCount: number
pendingCount: number
```

### Notes

* Pure presentational component
* No business logic
* Cheap to render

---

## FriendsList Component

### Responsibilities

* Display friends
* Filter by status
* Handle accept / unfriend actions
* Handle optimistic UI updates

### Props

```ts
friends: Friend[]
acceptedCount: number
pendingCount: number
loading: boolean
setFriends: Dispatch<SetStateAction<Friend[]>>
```

### Internal State

```ts
filter: 'all' | 'accepted' | 'pending'
actionLoadingId: string | null
```

### Why this design works

* **Single source of truth**: parent owns friends
* Child mutates via `setFriends`
* Action loading scoped per friend (not global)

---

## Friend Actions Logic

```ts
pending → accept
accepted → unfriend
```

### Optimistic Update Strategy

* UI updates immediately after action
* No refetch required
* Keeps app feeling fast

---

## FriendRow Component

### Purpose

* Displays individual friend
* Shows avatar, name, username
* Handles action buttons

### UI States

* Accepted badge
* Pending badge
* Loading button state

---

## Profile Component

### Responsibilities

* Edit user profile
* Sync Redux → local form
* Upload avatar
* Submit profile updates

### State Separation (Important)

| State       | Purpose          |
| ----------- | ---------------- |
| Redux       | Global user data |
| Local state | Editable form    |
| avatarFile  | File upload only |

This prevents accidental Redux mutation.

---

## Profile Update Flow

```
User edits form
      ↓
handleSubmit()
      ↓
updateProfile (server action)
      ↓
Success → Toast
      ↓
Redux updated (updateUserInfo)
```

### Why this is solid

* Server is source of truth
* Redux updated only after success
* Avatar preview handled locally

---

## UI Helper: Field Component

### Purpose

* Consistent label + spacing
* Reduces duplication
* Keeps Profile JSX clean

---

## Error & UX Handling

* Fetch errors logged safely
* AbortController prevents memory leaks
* Disabled username field (immutable)
* Action buttons disabled while processing

---
