
# 📘 RecentProjects — Documentation

## File

`components/root/RecentProjects.tsx`

## Purpose

`RecentProjects` displays the **last updated projects** the user has access to.

It answers one question:

> “What was I working on recently?”

---

## Behavior

* Fetches projects **on the server**
* Limits results (default: 3)
* Sorted by last update
* Hidden entirely if no projects exist

---

## Data Flow

```
Server Component
   ↓
getProjects({ type: "recent" })
   ↓
Formatted Project[]
   ↓
ProjectCard
```

---

## Why Server Component?

* Uses secure user context
* No client-side fetching
* No loading spinners in JS
* Better SEO & performance

---

## Rendering Logic

```
If projects.length === 0
   → render nothing
Else
   → render grid of ProjectCard
```

This avoids empty UI clutter.

---

## ProjectCard Relationship

Each project is rendered as:

```
Link (/projects/:id)
   ↓
ProjectCard
```

This ensures:

* Prefetching via Next.js
* Full card clickability
* Clean navigation UX

---

## Extensibility

Future upgrades can include:

* Pagination
* Filters (starred, archived)
* Sorting options
* Infinite scroll

Without changing the API shape.
