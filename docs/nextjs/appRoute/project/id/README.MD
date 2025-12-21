Below is **structured, production-grade documentation** for your **Project Route + ProjectPage system**.
This covers **both the server route and the client-heavy ProjectPage**, because they form one logical feature.

---

# `Project Route & ProjectPage` — Full Documentation

This feature powers the **single project view**:
fetching project data, handling permissions, team management, and project actions.

---

## 1. High-Level Overview

```text
/app/projects/[id]/page.tsx
 └── Server Route (data fetching, error handling)
      └── <ProjectPage /> (client component)
           ├── Project header & actions
           ├── Project details
           ├── Team section
           ├── Settings modal
           └── Team management modal
```

---

## 2. Server Route (`ProjectRoute`)

### Purpose

* Fetch project + team data securely on the server
* Handle invalid project IDs
* Pass clean data into the client component

---

### Implementation Summary

```ts
export default async function ProjectRoute({ params }: any)
```

* **Server Component**
* Uses parallel fetching via `Promise.all`
* Defensive error handling
* Graceful fallback UI

---

### Data Fetching

```ts
const [projectData, teamData] = await Promise.all([
  getSingleProject(id),
  FetchTeam(id),
]);
```

✔ Parallel execution
✔ Faster TTFB
✔ Clean separation of concerns

---

### Error & Not-Found Handling

If either fetch fails:

```tsx
Project Not Found
[ Go Home ]
```

* Prevents rendering broken UI
* Avoids client-side crashes
* Redirect-style UX without navigation side effects

---

### Successful Path

```tsx
<ProjectPage
  project={projectData}
  teamInfo={teamData.team}
/>
```

Only valid, complete data reaches the client.

---

## 3. `ProjectPage` (Client Component)

```ts
"use client"
```

This is the **core interactive layer**.

---

## 4. Responsibilities of `ProjectPage`

### Project Management

* Star / unstar
* Archive / unarchive
* Change name, description, visibility

### Team Management

* Join / leave team
* Approve / reject members
* Ban / unban members
* View team by status

### Permissions

* Owner vs member vs outsider
* Private vs public access
* Action gating

---

## 5. Props

```ts
interface Props {
  project: ProjectPageType
  teamInfo: TeamType["team"]
}
```

These are **server-validated**, trusted inputs.

---

## 6. State Breakdown

| State               | Purpose                    |
| ------------------- | -------------------------- |
| `projectData`       | Live project state         |
| `teamData`          | Live team state            |
| `userStatus`        | Current user’s team status |
| `showSettingsModal` | Settings dialog            |
| `showTeamModal`     | Team management dialog     |
| `selectedMember`    | Active team member         |
| `editForm`          | Project edit buffer        |

---

## 7. User Status Logic

Derived from team info:

```ts
determineUserStatus(userId, teamInfo)
```

Possible values:

```ts
"idle" | "pending" | "rejected" | "banned" | "member"
```

Used everywhere to:

* Gate actions
* Change button behavior
* Control UI visibility

---

## 8. Project Actions

### Star / Unstar

```ts
updateProjectStatus({ action: "star" })
```

* Optimistic UI update
* Local star count sync
* Toast feedback

---

### Archive / Unarchive

```ts
updateProjectStatus({ action: "archive" })
```

* Owner/member gated
* UI reflects archived state instantly

---

### Edit Settings

Handled via modal:

* Name
* Description
* Visibility (`PUBLIC` / `PRIVATE`)

Uses:

```ts
updateProjectStatus({ action: "name" | "toggleType" })
```

---

## 9. Permission Model

### Code Visibility

```ts
canViewCode =
  project.type !== "PRIVATE" ||
  userStatus === "member" ||
  project.isOwner
```

### Team Join Rules

* Owners cannot join their own project
* Banned / pending users blocked
* Rejected users may re-request

---

## 10. Team Section

### Team Status Buckets

Rendered dynamically:

* `members`
* `pendingRequests`
* `bannedUsers`
* `rejected`

```ts
getMembersByStatus(status, teamData)
```

---

### Join / Leave Button Logic

Button behavior changes based on `userStatus`:

| Status   | Button             |
| -------- | ------------------ |
| idle     | Join Team          |
| pending  | Pending (disabled) |
| member   | Leave Team         |
| rejected | Join Team          |
| banned   | Banned (disabled)  |

---

## 11. Team Management (Owner Only)

### Member Actions

* Approve
* Revoke
* Ban
* Unban

Handled via:

```ts
manageProjectTeamMember()
```

State updates are **locally reconciled** after server success.

---

## 12. Subcomponents Overview

### `ProjectHeader`

* Title
* Star count
* Archive status
* Primary actions

---

### `ProjectDetails`

Displays:

* Framework
* Visibility
* Git repo
* Created / Updated timestamps

---

### `TeamSection`

* Team overview
* Join/leave controls
* Status-grouped member lists

---

### `SettingsModal`

* Controlled form
* No uncontrolled mutations
* Closes only on success/cancel

---

### `TeamManagementModal`

* Contextual actions per member
* Status-aware options
* Owner-only access

---

## 13. Utilities

### Formatting

* `formatDate`
* `capitalize`
* `date-fns` for consistency

### Visual State Helpers

* `getStatusColor`
* `getStatusIndicatorColor`

Ensures consistent semantic UI feedback.

---

## 14. Performance Characteristics

✔ Server-side data fetching
✔ Parallel requests
✔ Minimal re-renders
✔ Local optimistic updates
✔ No unnecessary refetches

Scales well even with large teams.

---
