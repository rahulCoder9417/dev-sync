
# 📘 HeaderHome — Documentation

## Purpose

`HeaderHome` is the **top navigation header** of the DevSync dashboard.
It provides:

* Global navigation context
* Project search
* Quick project actions
* Notifications
* User identity visibility

It is **responsive**, **state-aware**, and **UI-only** 

---

## High-Level Structure

```
HeaderHome
├── Logo
├── SearchBar
├── MobileNav
├── DesktopActions
└── AvatarNotify
```

---

## Data Flow (High-Level)

```
Redux Store (user)
        ↓
   AvatarNotify
        ↓
 UI Notification State
```

`HeaderHome` itself is **stateless**.
Only `AvatarNotify` interacts with global state.

---

## Component Responsibilities

---

# 1️⃣ HeaderHome

### File

`components/dashboard/HeaderHome.tsx`

### Responsibility

* Layout orchestration
* Responsive alignment
* Composition of header sub-components

### Key Design Decisions

* No internal state
* No Redux usage
* Acts as a **layout shell**

### Why this matters

This makes the header:

* Easy to refactor
* Safe to reuse
* Cheap to render

### Visual Layout

```
+---------------------------------------------------+
|  Logo | Search | Nav | Actions | AvatarNotify     |
+---------------------------------------------------+
```

---

# 2️⃣ Logo

### Purpose

* Brand identity
* Quick dashboard recognition

### Behavior

* Icon always visible
* Text hidden on small screens

### Why memoized

* Never changes
* Prevents unnecessary re-renders

---

# 3️⃣ SearchBar

### Purpose

* Future global search entry point
* Projects, files, team members

### Behavior

* Desktop-only
* UI-only (no handlers yet)

### Why separated

* Search will later connect to:

  * API
  * Debounced input
  * Command palette

Keeping it isolated avoids future rewrites.

---

# 4️⃣ MobileNav

### Purpose

* Bottom-style navigation for mobile users

### Props

```ts
interface MobileNavProps {
  pathname: string;
}
```

### Behavior

* Active route highlighting
* Icon-only navigation
* Hidden on desktop

### Routing Logic

```ts
pathname.startsWith(item.href)
```

This allows:

* `/projects/123`
* `/projects/settings`

to still highlight **Projects**.

---

# 5️⃣ DesktopActions

### Purpose

Quick access to **high-value actions**:

* Import project from Git
* Create new project

### Why desktop-only

* These actions require focus
* Avoid clutter on mobile

### Design Choice

Buttons are **links**, not handlers
→ better routing + prefetching.

---

# 6️⃣ AvatarNotify

### Purpose

* Notification management
* User identity display
* Entry point for future profile menu

### Data Source

```
Redux → user slice
```

### Responsibilities

* Notification badge
* Notification dropdown
* Optimistic delete
* Outside-click handling
* User avatar / initials

### Internal State

```ts
isOpen: boolean
```

### Cleanup Logic

* Removes document listeners on unmount
* Prevents memory leaks

---

## Notification Flow Diagram

```
Bell Click
   ↓
Open Dropdown
   ↓
User clicks ❌
   ↓
Optimistic Redux Update
   ↓
DELETE /api/notification/delete
```

---

## Performance Considerations

| Technique        | Why                     |
| ---------------- | ----------------------- |
| `memo()`         | Prevent re-renders      |
| `useMemo()`      | Stable navigation items |
| Stateless layout | Cheap rendering         |
| Optimistic UI    | Instant feedback        |

---

## Future Extension Points

* 🔍 Command Palette (SearchBar)
* 👤 Profile Menu (AvatarNotify)
* 🔔 Live notifications (WebSocket)
* 📱 Gesture-based mobile nav
