
---

# 📘 CreateProject — Documentation

## Purpose

`CreateProject` is a **controlled project creation form** used to create a new DevSync project **without Git import**.

It allows a user to:

* Define project metadata
* Choose visibility (public/private)
* Select collaborators from friends
* Submit data to a server action
* Navigate to the created project on success

This component is **UI + orchestration only**.
All persistence and validation are delegated to the server action.

---

## File Location

```
components/projects/CreateProject.tsx
```

---

## Component Signature

```ts
interface Props {
  action: (data: CreateProjectInput) => Promise<any>;
}
```

### Why this matters

* The component is **framework-agnostic**
* It does **not care** how the project is created (DB, queue, background job)
* Makes the component reusable for:

  * Manual project creation
  * Wizard flows
  * Admin tools

---

## High-Level Structure

```
CreateProject
├── Header (Back navigation + title)
├── Card
│   ├── Project Metadata
│   │   ├── Name
│   │   ├── Description
│   │   ├── Language / Framework
│   │   └── Visibility
│   ├── Team Selection
│   │   └── Friends Avatars
│   └── Actions
│       ├── Cancel
│       └── Submit
```

---

## State Management

### Local State

```ts
const [friends, setFriends]
const [selectedFriends, setSelectedFriends]
const [isSubmitting, setIsSubmitting]
const [formData, setFormData]
```

### Why local state is correct here

* This data is **temporary**
* No cross-page reuse
* No collaboration
* No real-time sync required

Redux would be **overkill**.

---

## Data Flow (End-to-End)

```
User Input
   ↓
Local State (formData, selectedFriends)
   ↓
handleSubmit()
   ↓
CreateProjectInput
   ↓
Server Action (action prop)
   ↓
Project Created
   ↓
Router → /projects/:id
```
* [ProjectRoute](../../../appRoute/project/id/README.MD)
---

## Friend Selection Logic

Friends are fetched once on mount:

```ts
GET /api/user/findFriend
```

Selection behavior:

* Clicking an avatar toggles selection
* Selected friends are converted into:

```ts
members: { userId: string }[]
```

### Design choice

* Avatar-only UI reduces noise
* Ring indicator keeps UX lightweight
* No extra text or checkboxes

---

## Validation Strategy

### Client-side (minimal)

* Ensures:

  * Project name exists
  * Language selected

```ts
if (formData.name.length === 0 || formData.packages.length === 0)
```

### Server-side (authoritative)

* Ownership
* Permissions
* Limits
* Database consistency

This avoids duplicated logic.

---

## Visibility Handling

```ts
type: "PUBLIC" | "PRIVATE"
```

### Why clickable cards instead of radio buttons

* Better discoverability
* Clear visual feedback
* Easier to extend (e.g. “Team-only” later)

---

## Navigation Guarantees

* ❌ No redirect before success
* ✅ Redirect only after project is created
* ❌ No optimistic navigation

```ts
navigate.push(`/projects/${res.projectId}`)
```

This prevents:

* Broken routes
* Phantom projects
* Inconsistent state

---

## Error Handling

| Scenario                | Behavior                 |
| ----------------------- | ------------------------ |
| Friends fetch fails     | Toast + continue         |
| Missing required fields | Client toast             |
| Server action fails     | Error toast              |
| Success                 | Success toast + redirect |

All failures are **recoverable**.

---

## Why This Component Is Safe

* No direct DB access
* No hardcoded API calls
* No auth assumptions
* No side effects on render
* Fully controlled submission

This makes it:

* Testable
* Reusable
* Deploy-safe

---