
# 📘 QuickActions — Documentation

## File

`components/dashboard/QuickActions.tsx`

## Purpose

`QuickActions` provides **immediate next steps** for the user.

It answers:

> “What can I do right now?”

---

## Role in Dashboard

```
Dashboard
   ↓
QuickActions
   ↓
Navigation / Action Entry Points
```

It does **not** depend on user data or API calls.

---

## Behavior

* Pure UI component
* Static links / actions
* Always visible
* No async logic

---

## Why Static?

QuickActions is intentionally:

* **Predictable**
* **Instant**
* **Zero-latency**

This prevents:

* Loading delays
* Auth coupling
* State bugs

---

## Typical Actions (Conceptual)

Examples:

* Create new project
* Import from Git
* Join a team
* Open templates

(Exact actions can evolve without architectural change.)

---

## UI Philosophy

* Minimal
* Action-focused
* Clear intent per button
* No nested logic

---

## Extensibility

Future additions:

* Role-based actions
* Recently used actions
* Keyboard shortcuts

Component structure already supports this.
