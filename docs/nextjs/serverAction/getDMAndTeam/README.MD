

---

# 📄 `getDMAndTeam`

### Server Action – Fetch DM & Team Chats

## Overview

This server action fetches and formats **all chat sidebar data** for the authenticated user:

* Team chats
* Direct messages (friends)

Runs **only on the server**.
---
### Used in - ChatPage  : [team README](../appRoute/team/README.MD)
---

## Directive

```ts
"use server";
```

Ensures this function:

* Cannot run on the client
* Can access DB securely
* Can use authentication middleware

---

## Responsibilities

* Authenticate the user
* Fetch team chats
* Fetch DM chats
* Format raw DB data into UI-friendly types

---

## Authentication

```ts
const dbUser = await middleWare();
```

If the user is not authenticated:

```ts
throw new Error("Unauthorized");
```

This bubbles up to the page’s `try/catch`.

---

## Team Chats Query

```ts
const teams = await db.team.findMany({ ... });
```

### What’s fetched

* Team ID & name
* Member count
* Linked project ID
* Latest visible message
* Last activity timestamp

### Filters

* User must be a team member
* Messages deleted by the user are excluded
* Teams with less than 2 members are removed

---

## Team Formatting

```ts
const formattedTeams: TeamChatItem[] = ...
```

### Output Shape

```ts
{
  type: "team",
  id,
  name,
  projectId,
  memberCount,
  lastMessageRead,
  lastMessageAt
}
```

⚠️ `lastMessageRead` is currently forced to `true`

> Likely intentional for MVP — can be expanded later

---

## Direct Messages Query

```ts
const friendships = await db.friendship.findMany({ ... });
```

### Conditions

* Friendship must be `accepted`
* User is either initiator or receiver
* Only latest message is fetched

---

## DM Formatting

```ts
const formattedFriends: DMChatItem[] = ...
```

### Key Logic

```ts
const lastMessageRead =
  !lastMessage ||
  lastMessage.senderId === dbUser.id ||
  lastMessage.isRead;
```

✔️ Correctly marks unread messages only when:

* The message exists
* It was sent by the other user
* It is unread

---

## Final Return

```ts
return {
  teams: formattedTeams,
  friends: formattedFriends,
};
```

Matches `DMAndTeamResult` exactly.

---

## Why This Design Is Solid

✅ Single DB hit per section
✅ Minimal data selection (fast)
✅ No over-fetching messages
✅ Clean mapping layer
✅ UI-ready output

---
