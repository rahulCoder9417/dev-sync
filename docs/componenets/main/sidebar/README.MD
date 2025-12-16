# Dashboard Sidebar

## Purpose

The Dashboard Sidebar is the primary navigation component of the DevSync dashboard.  
It provides access to core routes and quick navigation to recently opened projects.

The component is state-driven, route-aware, and designed for scalability.

---

## High-Level Behavior

- Visible by default on desktop
- Can be collapsed or expanded
- Highlights the active route
- Renders recent projects dynamically from global state
- Hidden on mobile via responsive layout (not component logic)

---

## Data Flow

Redux Store (`recentProjects`)
↓  
DashboardSidebar  
↓  
Recent Project Links

- Navigation items are static
- Recent projects are dynamic and state-driven

---

## Sidebar Structure

### 1. Navigation Section

Navigation items are defined using a typed static configuration.

Each item includes:
- Icon
- Label
- Route

The active route is determined using `usePathname()` and highlighted accordingly.

**Routes**
- `/dashboard`
- `/projects`
- `/team`
- `/settings`

---

### 2. Recent Projects Section

Recent projects are sourced from the `recentProjects` Redux slice.

Each entry:
- Links to `/projects/:projectId`
- Displays project metadata:
  - Title
  - Type (PUBLIC / PRIVATE / GENERATED)
  - Framework (React, Next.js, etc.)

---

## State Management

| State | Scope | Purpose |
|------|-------|---------|
| `isOpen` | Local | Controls sidebar visibility |
| `recentProjects` | Redux | Stores recently accessed projects |

- UI-only state remains local
- Shared data is stored globally

---

## Performance Optimizations

- `useMemo` for:
  - Navigation items
  - Recent project list
- `React.memo` prevents unnecessary re-renders
- Static configuration avoids object recreation

---

## Extending the Sidebar

To add a new navigation item:
1. Update the sidebar configuration
2. Add the corresponding route/page

No changes to the sidebar component are required.

---

## Design Decisions

- Typed configuration prevents invalid routes
- Configuration and UI are separated for maintainability
- Redux enables shared recent project state
- No hardcoded paths ensure deployment safety

---

## Code Entry Points

- `components/dashboard/sidebar/DashboardSidebar.tsx`
- `components/dashboard/sidebar/sidebarConfig.ts`
- `lib/redux/slices/recentProjectsSlice.ts`

---

## Notes

- Mobile behavior is layout-controlled
- Sidebar does not fetch data directly
- New dynamic sections must be backed by global state
