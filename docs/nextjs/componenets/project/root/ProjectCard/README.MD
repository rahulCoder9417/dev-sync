
---

# `ProjectCard` — Component Documentation

A reusable UI component that renders a **single project preview card** with metadata, collaborators, and status indicators.

Designed to be used inside project grids, lists, and dashboards.

---

## 1. Purpose

`ProjectCard` visually represents a project and its key attributes:

* Title & description
* Visibility status (public / private / generated)
* Framework
* Last updated date
* Collaborators
* Git / Archive / Star indicators

It is **purely presentational** and has no internal state.

---

## 2. Usage

```tsx
import { ProjectCard } from "@/components/project/ProjectCard";

<ProjectCard project={project} />
```

Typically wrapped inside a `Link` for navigation:

```tsx
<Link href={`/projects/${project.id}`}>
  <ProjectCard project={project} />
</Link>
```

---

## 3. Props

### `ProjectCardProps`

```ts
interface ProjectCardProps {
  project: Project;
}
```

### Required `project` fields

The component expects the following properties on `Project`:

| Field           | Type                          | Purpose           |
| --------------- | ----------------------------- | ----------------- |
| `title`         | `string`                      | Project name      |
| `description`   | `string`                      | Short summary     |
| `type`          | `ProjectVisibility`           | Visibility badge  |
| `framework`     | `string`                      | Tech stack label  |
| `lastUpdated`   | `string` (ISO)                | Display date      |
| `collaborators` | `Array<{ fullName; avatar }>` | Avatar display    |
| `isGitImport`   | `boolean`                     | Git indicator     |
| `isArchived`    | `boolean`                     | Archive indicator |
| `isStarred`     | `boolean`                     | Star indicator    |

---

## 4. Utilities

### `getVisibilityClass(type)`

Maps project visibility to Tailwind background color.

```ts
function getVisibilityClass(type: ProjectVisibility): string
```

| Visibility | Badge Color |
| ---------- | ----------- |
| `PUBLIC`   | Green       |
| `PRIVATE`  | Blue        |
| `GENRATED` | Red         |
| default    | Gray        |

Used for the top-right status badge.

---

### `getFrameworkColor(framework)`

Returns a color used for the framework indicator dot.

```ts
function getFrameworkColor(framework: string): string
```

Default mappings:

| Framework | Color         |
| --------- | ------------- |
| React     | Brand primary |
| Nextjs    | Black         |
| Js        | Yellow        |
| Ts        | Blue          |
| Unknown   | Brand primary |

Safe fallback ensures UI never breaks.

---

## 5. Layout Structure

### Header

* Project title
* Visibility badge
* Hover color transition

```tsx
<h3>{project.title}</h3>
<span>{project.type}</span>
```

---

### Description

* Clamped to 2 lines
* Muted secondary text color

```tsx
<p className="line-clamp-2">
  {project.description}
</p>
```

---

### Meta Information

Displays:

* Framework with color dot
* Last updated date (YYYY-MM-DD)

```tsx
(project.lastUpdated).split("T")[0]
```

> Assumes ISO timestamp input.

---

### Footer

#### Collaborators

* Shows **up to 3 avatars**
* Remaining count displayed as `+N`

```ts
const visibleCollaborators = project.collaborators.slice(0, 3);
```

Uses the shared `Avatar` component.

---

#### Status Icons

Uses `lucide-react` icons:

| Condition     | Icon          |
| ------------- | ------------- |
| `isGitImport` | GitBranch     |
| `isArchived`  | FolderArchive |
| `isStarred`   | Star          |

Icons render **only when true**.

---

## 6. Styling & UX

* Rounded card layout
* Border with hover shadow
* Group hover transitions
* Cursor pointer for click affordance

```tsx
className="p-6 rounded-xl border transition-all hover:shadow-lg"
```

Fully compatible with dark mode via CSS variables.

---

## 7. Dependencies

```ts
lucide-react      // Icons
Avatar            // Collaborator avatars
Project types     // Strong typing
```

No external state or side effects.

---

## 8. Performance Characteristics

✔ No `useState`
✔ No `useEffect`
✔ Pure render component
✔ Cheap to re-render
✔ Safe to memoize if needed

Example optimization (optional):

```ts
export default React.memo(ProjectCard);
```

---
