

# 📘 Dashboard Page — Documentation

## File

`app/(dashboard)/dashboard/page.tsx` (or equivalent)

## Purpose

The **Dashboard page** is the **primary landing page** after authentication.
It gives users an **instant overview** of:

* Platform status (stats)
* Recent work (projects)
* Common next actions (quick actions)

This page is optimized for:

* Fast perceived loading
* Progressive rendering
* Server-first architecture

---

## High-Level Layout

```
Dashboard
├── HeaderHome
├── StatsCards (Suspense)
├── RecentProjects (Suspense)
└── QuickActions
```

---

## Rendering Strategy

The dashboard uses **React Suspense** to progressively load content:

```
Initial HTML
   ↓
Stats Skeleton
   ↓
StatsCards resolved
   ↓
RecentProjects resolved
```

This ensures:

* No blank screens
* Fast TTFB
* Smooth UX on slow networks

---

## Data Flow Diagram

```
Dashboard Page
   ↓
StatsCards      ← server fetch
RecentProjects  ← server fetch
QuickActions    ← static UI
```

| Component      | Responsibility            | Documentation Path                                  |
| -------------- | ------------------------- | --------------------------------------------------- |
| HeaderHome     | Top navigation & identity |  [HeaderHome README](../../componenets/main/headerHome/README.MD)    |
| RecentProjects | User’s recent work        | [RecentProjects README](../../componenets/dashboard/recentProject/README.MD) |
| QuickActions   | Common next actions       | [QuickActions README](../../componenets/dashboard/quickAction/README.MD)   |


---

## Key Design Decisions

| Decision            | Reason                          |
| ------------------- | ------------------------------- |
| `force-dynamic`     | Always fresh user-specific data |
| Suspense boundaries | Faster perceived performance    |
| Stateless page      | Easy to maintain & test         |
| Layout-first        | Clean mental model              |

