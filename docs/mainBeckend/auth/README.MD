
---

# Authentication Utility – `getAuthData`

## Purpose

`getAuthData` is a **server-side authentication helper** that:

1. Verifies a **Clerk-issued JWT**
2. Extracts the user’s **email** from the token payload
3. Resolves the user from the **application database**
4. Returns a **normalized user metadata object** used across WebSocket and HTTP layers

This function acts as the **bridge between Clerk (identity)** and **your internal user model**.

---

## Function Signature

```ts
async function getAuthData(token: string): Promise<UserMeta | null>
```

### Returns

* `UserMeta` → when authentication succeeds
* `null` → when verification or lookup fails

---

## UserMeta Shape

```ts
type UserMeta = {
  userId: string;
  username: string;
  fullName: string;
  avatar: string | null;
};
```

This is intentionally **minimal and stable**:

* Safe to attach to WebSocket connections
* Cheap to serialize
* Enough for presence, chat, and attribution

---

## Authentication Flow

### Step-by-step

```
Client JWT
   ↓
verifyToken (Clerk)
   ↓
Extract email
   ↓
getUserByEmail (DB)
   ↓
Return UserMeta
```

---

## Implementation Breakdown

### 1. Token Verification (Clerk)

```ts
const payload = await verifyToken(token, {
  secretKey: process.env.CLERK_SECRET_KEY!,
});
```
* Clerk JWT is set on their website inside JWT template
* Uses **Clerk backend verification**
* Relies on `CLERK_SECRET_KEY`
* Rejects expired, malformed, or forged tokens

**Important**

* Token must be generated using a **JWT template that includes email**
* This is assumed and enforced

---

### 2. Email Extraction

```ts
const email = payload.email as string;
```

* Email is the **primary lookup key**
* If missing → authentication fails

**Why email instead of userId?**

* Clerk user IDs are external
* Your DB owns the canonical user identity

This keeps your system **provider-agnostic**.

---

### 3. User Resolution (Database)

```ts
const response = await getUserByEmail(email);
```

* Fetches user from application database
* Ensures user exists internally
* Prevents ghost / partially registered users

---

### 4. UserMeta Mapping

```ts
return {
  userId: response.id,
  username: response.username,
  avatar: response.avatar,
  fullName: response.fullName,
};
```

Only safe, public fields are returned.

No:

* Emails
* Roles
* Tokens
* Sensitive metadata

---

## Error Handling Strategy

### Fail-Closed Design

Any failure results in:

```ts
return null;
```

Errors include:

* Invalid / expired JWT
* Missing email in token
* User not found in DB
* Unexpected runtime errors

All errors are **logged server-side** but **never leaked to clients**.

This is the correct posture for auth.

---

## Logging

```ts
console.log("Error happend finding user", error);
```

* Logs for observability
* Does not expose internals upstream
* Suitable for production (can be upgraded to structured logs)

---

## Where This Is Used

Typically consumed by:

* WebSocket connection handshake
* HTTP middleware
* Request context initialization

Example (WebSocket):

```ts
const user = await getAuthData(token);
if (!user) ws.close();
ws.userId = user.userId;
```

---

## Security Guarantees

* ✔ Token integrity verified
* ✔ Identity provider validated
* ✔ Internal user existence enforced
* ✔ No sensitive data exposed
* ✔ Safe for long-lived WebSocket sessions

---

## Design Decisions (Strong Opinion)

* **Clerk for auth, DB for identity** → best of both worlds
* **Email as join key** → portable & human-stable
* **Return null, not throw** → caller controls flow
* **Minimal UserMeta** → prevents auth creep

This function does exactly what it should — nothing more.

---

## Known Assumptions & Constraints

* JWT **must include email**
* User **must exist in DB**
* Clerk is the active auth provider
* Not suitable for role-based access control (by design)

---
