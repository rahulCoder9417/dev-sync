
---

# 📄 `ChatPage`

### Chats Page – Server Component (Next.js App Router)

## Overview

This file defines the **Chats page** that fetches all **Direct Messages (DMs)** and **Team chats**, sorts them by recent activity, and renders the `Chat` UI component.

It is a **server component** that runs entirely on the server and handles:

* Data fetching
* Sorting logic
* Error fallback UI

---

## Responsibilities

* Fetch DM & Team chat metadata
* Sort chats by latest activity
* Gracefully handle fetch errors
* Render the main `Chat` component

---

## Imports Breakdown

```ts
import Chat from "@/components/team/Chat";
```

Main UI component responsible for rendering chats.

```ts
import getDMAndTeam from "@/lib/actions/chat/dmAndTeam";
```

Server action that fetches DM + Team data.

```ts
import type { DMAndTeamResult } from "@/lib/types/chat";
```

Shared type ensuring type safety between server and UI.

---

## Helper: `sortByLastMessage`

```ts
function sortByLastMessage<T extends { lastMessageAt: Date }>(items: T[]): T[]
```

### Purpose

Sorts chats by most recent message timestamp (descending).

### Why generic?

* Works for **both** team chats and DM chats
* Enforces presence of `lastMessageAt`

---

## Page Logic

```ts
const Page = async () => { ... }
```

### Flow

1. Calls `getDMAndTeam()` (server action)  -- [getDMAndTeam README](../../serverAction/getDMAndTeam/README.MD)
2. Sorts:

   * `teams`
   * `friends`
3. Passes sorted data to `<Chat />`

---

## Error Handling

If fetching fails:

* Shows a full-screen error UI
* Provides a **Go Home** button (`/dashboard`)

This prevents broken UX when:

* User is unauthorized
* Database is down
* Middleware fails

---
[Chat README](../../componenets/team/Chat/README.MD)
## Render Output

```tsx
return <Chat dmAndTeam={data} />; 
```

The page itself contains **no UI logic**—it delegates everything to the `Chat` component.

---

## Key Design Decisions

✅ Server-side sorting (better performance)
✅ Type-safe data contract
✅ Zero client-side fetching
✅ Clean separation of concerns

---

## Export

```ts
export default Page;
```

---
