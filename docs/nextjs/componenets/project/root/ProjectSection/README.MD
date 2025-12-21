
---

# `ProjectSection` — Client Component Docs

A fully client-side project listing component for **Next.js App Router** that supports:

* Fetching projects
* Filtering (type, framework, starred, archived, git import)
* Searching
* Pagination
* URL-driven filters (`?filter=`)
* Memoized performance optimizations

---

## 1. Purpose

`ProjectSection` is responsible for rendering a **paginated, searchable, and filterable grid of projects**.
It integrates with server actions (`getProjects`) and reacts to URL search params.

---

## 2. Usage

```tsx
"use client";

import ProjectSection from "@/components/project/ProjectSection";

export default function ProjectsPage() {
  return <ProjectSection />;
}
```

> Must be a **client component** because it uses:

* `useState`
* `useEffect`
* `useMemo`
* `useSearchParams`
* client-side navigation

---

## 3. Core Features

### ✅ Project Fetching

* Fetches **recent projects** on mount
* Fetches **starred projects on demand** (cached after first fetch)

### ✅ Filtering

Supports filtering by:

* Visibility (`PUBLIC`, `PRIVATE`, `GENRATED`)
* Framework (dynamic, derived from data)
* Starred projects
* Archived projects
* Git-imported projects

Filters can be:

* Triggered via UI
* Triggered via URL: `?filter=react`

---

### ✅ Searching

Searches across:

* `title`
* `description`
* `framework`

Search is:

* Case-insensitive
* Combined with filters
* Pagination-aware

---

### ✅ Pagination

* Configurable items per page
* Smart ellipsis pagination for large datasets
* Smooth scroll on page change

---

## 4. Constants

```ts
const ITEMS_PER_PAGE = 12;
```

Controls how many projects appear per page.

---

## 5. State Breakdown

| State              | Type                | Purpose                       |
| ------------------ | ------------------- | ----------------------------- |
| `allProjects`      | `Project[]`         | Master project list           |
| `starred`          | `Project[] \| null` | Cached starred projects       |
| `filteredProjects` | `Project[]`         | Result of applied filter      |
| `showFiltered`     | `boolean`           | Toggle filtered vs all        |
| `searchQuery`      | `string`            | Search input value            |
| `currentPage`      | `number`            | Active pagination page        |
| `message`          | `string`            | Empty / loading state message |

---

## 6. Data Flow

### Initial Load

```text
Mount
 └── fetchProjects()
       └── getProjects({ type: "recent" })
```

---

### URL Filter Sync

```ts
const filterParam = searchParams.get("filter");
```

When `filterParam` changes:

* Enables filtered mode
* Applies the filter automatically

---

## 7. Filtering Logic

### `handleFilterChange(filter: string)`

Supported filters:

| Filter        | Behavior                 |
| ------------- | ------------------------ |
| `public`      | `type === "PUBLIC"`      |
| `private`     | `type === "PRIVATE"`     |
| `genrated`    | `type === "GENRATED"`    |
| `archieve`    | `isArchived === true`    |
| `gitImport`   | `isGitImport === true`   |
| `starred`     | Fetches starred projects |
| `<framework>` | Matches framework name   |
| `none`        | Clears results           |

```ts
if (filter === "starred") {
  if (!starred) {
    filtered = await getProjects({ type: "starred" });
    setStarred(filtered);
  }
}
```

> Starred projects are fetched **once** and cached.

---

## 8. Memoized Computations

### Unique Frameworks

```ts
const uniqueFrameworks = useMemo(
  () => [...new Set(allProjects.map(p => p.framework))],
  [allProjects]
);
```

Used to populate the filter dropdown dynamically.

---

### Search + Filter Combo

```ts
const searchedAndFilteredProjects = useMemo(() => {
  const base = showFiltered ? filteredProjects : allProjects;
  ...
}, [showFiltered, filteredProjects, allProjects, searchQuery]);
```

Prevents unnecessary re-renders and expensive filtering.

---

## 9. Pagination Logic

### Page Calculations

```ts
const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
```

### Smart Pagination Range

Shows:

* Full range for ≤ 7 pages
* Ellipsis for large datasets

Example:

```text
1 ... 4 5 6 ... 12
```

---

## 10. UI Components Used

| Component        | Responsibility             |
| ---------------- | -------------------------- |
| `FilterDropdown` | Filter selection UI        |
| `ProjectCard`    | Individual project preview | 
| `Link`           | Client-side navigation     |

 * Project card [ProjectCard](../ProjectCard/README.MD)
---

## 11. Empty States

Handled cleanly:

* No search results
* No filtered results
* Loading starred projects

```tsx
{searchedAndFilteredProjects.length === 0 && (
  <p>No projects found</p>
)}
```

---

## 12. Performance Notes

✔ `React.memo` prevents unnecessary re-renders
✔ `useMemo` optimizes expensive list operations
✔ Starred projects cached after first fetch
✔ Pagination slices instead of re-fetching

---

## 13. Types

### Project Visibility

```ts
export type ProjectVisibility = 
  | "PUBLIC"
  | "PRIVATE"
  | "GENRATED";
```

---
