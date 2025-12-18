

# 👤 Public Profile Page — Documentation

## Overview

The **Public Profile Page** displays another user’s public identity, projects, and friendship relationship.
It is **server-rendered** for SEO and fast initial load, with **client-side interactivity** for friendship actions.

Route:

```
/profile/[username]
```

---

## High-Level Architecture

```
Profile Page (Server Component)
├── Avatar
├── User Info (name, username, bio)
├── FriendshipButton (Client)
├── Stats (Projects, Friends)
└── Projects Grid
    └── ProjectCard
```

---

## Rendering Strategy (Important)

| Part             | Type             | Reason               |
| ---------------- | ---------------- | -------------------- |
| Page             | Server Component | SEO, fast data fetch |
| FriendshipButton | Client Component | User interaction     |
| Avatar / Cards   | Shared           | Reusable UI          |

This split is **intentional and optimal**.

---

## Data Fetching

### Source

```ts
getUserDetails(username)
```

### Returned Shape (Conceptual)

```ts
{
  success: boolean
  user: {
    id
    username
    fullName
    avatar
    bio
    totalFriends
    isFriend
    projects[]
  }
}
```

### Failure Handling

If the user does not exist:

* Page renders a full-screen fallback
* No crash, no redirect loop

---

## Profile Header Section

### Responsibilities

* Identity display
* Friendship interaction
* Social stats

### Components Used

| Component        | Role                 |
| ---------------- | -------------------- |
| Avatar           | User identity        |
| FriendshipButton | Relationship control |
| Stat             | Numeric highlights   |

---

## FriendshipButton Component

### Purpose

Handles **all friendship states and actions** between:

* Current logged-in user
* Profile owner

This is the **only interactive piece** on the profile page.

---

## Friendship States

Defined by `FriendshipStatus`:

```
none        → No relationship
pending     → Request sent by you
acceptHim  → Request sent to you
accepted    → Friends
blocked     → Blocked state
```

---

## Action Mapping

| Current State | Primary Action | Resulting State |
| ------------- | -------------- | --------------- |
| none          | request        | pending         |
| pending       | disabled       | pending         |
| acceptHim     | accept         | accepted        |
| accepted      | reject         | none            |
| blocked       | disabled       | blocked         |

---

## API Contract

### Endpoint

```
PUT /api/friend/toggle
```

### Payload

```json
{
  "userId": "target-user-id",
  "action": "request | accept | reject"
}
```

### Design Notes

* Stateless API
* Client maintains optimistic state
* Server is source of truth

---

## Optimistic UI Strategy

* Button updates **after successful request**
* No refetch required
* Loading state prevents double actions

This keeps the UI **instant and responsive**.

---

## Guards & Safety

```ts
if (!currentUserId || currentUserId === userId) return null;
```

Why:

* No button when logged out
* No self-friend actions
* Prevents invalid API calls

---

## Button Configuration Logic

All button visuals are derived from state:

```ts
icon
label
variant
```

Centralized via `useMemo` →
✔ Clean JSX
✔ Easy to extend
✔ No condition soup

---

## Projects Section

### Behavior

* Shows only **public projects**
* Empty state handled gracefully
* Cards are clickable and navigable

### Layout

Responsive grid:

```
1 col (mobile)
2 cols (tablet)
3 cols (desktop)
```

---

## Subcomponent: Stat

### Purpose

Simple numeric display used for:

* Project count
* Friend count

Stateless, reusable, minimal.

---
