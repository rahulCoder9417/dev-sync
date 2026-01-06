
---

# DevSync – System Architecture Documentation

## 1. What is DevSync?

**DevSync** is a real-time collaborative developer platform that allows multiple users to:

* Create and manage coding projects
* Collaborate live on files with code syncing
* Chat and broadcast events in real time
* Execute code safely inside isolated containers
* Preview running applications securely

DevSync is architected as **three independent but tightly integrated systems**:

1. **Next.js Frontend + API Layer**
2. **Main Backend (Realtime + Persistence)**
3. **Execution Backend (Docker + PTY Runtime)**

This separation is intentional and critical for **scalability, security, and correctness**.

---

## 2. High-Level Architecture Overview

```
┌──────────────────────────┐
│        Browser           │
│  (Next.js Frontend)      │
└───────────▲──────────────┘
            │ HTTP / WS
            ▼
┌──────────────────────────┐
│   Main Backend Server    │
│  (Node.js / Express)    │
│                          │
│ • Auth & Users           │
│ • Projects & Teams       │
│ • File CRUD              │
│ • WebSocket Broadcast    │
│ • Code Sync              │
└───────────▲──────────────┘
            │ Secure API / WS
            ▼
┌──────────────────────────┐
│ Execution Backend        │
│ (Docker + PTY Runtime)   │
│                          │
│ • Node PTY               │
│ • Xvfb (GUI apps)        │
│ • Proxy Middleware       │
│ • Preview Server         │
│ • Ephemeral Disk         │
└──────────────────────────┘
```

---

## 3. Core Design Principles

DevSync is designed around these principles:

* **Separation of concerns**
* **Ephemeral execution, persistent state**
* **WebSocket-first real-time communication**
* **Zero trust between services**
* **Scalable horizontally**

Each system can scale or fail independently without breaking the entire platform.

---

## 4. System 1 – Next.js Frontend + API Layer

### 4.1 Purpose

The Next.js application is responsible for:

* UI rendering
* User interaction
* Client-side state
* Authenticated API access
* Lightweight server-side logic

It is **not** responsible for:

* Heavy real-time logic
* Terminal execution
* File syncing logic

---

### 4.2 Frontend Pages & Sections

The frontend is structured into the following major sections:

#### 1. Dashboard

* Entry point after login
* Lists projects and recent activity
* Displays team and collaboration status

#### 2. Projects

* Create / open projects
* View file tree
* Launch terminal preview
* Collaborate on code

#### 3. Profile

* User details
* Account settings
* Connected identities

#### 4. Teams

* Create teams
* Invite users
* Manage roles and permissions

#### 5. Settings

* App preferences
* Editor behavior
* Notification settings

---

### 4.3 API Routes (Next.js)

Next.js API routes are used **only for lightweight tasks**, such as:

* Auth callbacks
* Project metadata actions
* Triggering background workflows
* Proxying requests to backend services

**Important:**
No WebSocket logic and no PTY logic lives here.

This keeps frontend deployments **fast and serverless-friendly**.

---

## 5. System 2 – Main Backend (Realtime + Persistence)

### 5.1 Purpose

The main backend is the **brain of DevSync**.

It handles:

* Data persistence
* Real-time communication
* Multi-user synchronization
* Business logic

---

### 5.2 Responsibilities

#### 1. Authentication & Authorization

* Validates users
* Enforces access control
* Ensures project-level permissions

#### 2. Project Management

* Create projects
* Store metadata
* Associate users and teams

#### 3. File CRUD

* Create, update, delete files
* Store file content in database
* Maintain directory structure
* Track versions and timestamps

> Files are stored **in the database**, not on disk.

---

### 5.3 Code Sync System

This is one of DevSync’s most important features.

#### How it works:

* Every file edit is sent via WebSocket
* Backend validates and stores changes
* Changes are broadcast to:

  * Other connected users
  * Execution backend (if running)

This ensures:

* Single source of truth
* No file conflicts
* Real-time collaboration

---

### 5.4 WebSocket Broadcast Layer

The backend maintains WebSocket rooms for:

* Projects
* Teams
* Global notifications

It broadcasts:

* File updates
* Cursor positions
* Chat messages
* Save events
* Terminal lifecycle events

This backend is **stateful**, unlike Next.js.

---

### 5.5 Chat System

Chat is implemented as:

* WebSocket-based
* Project-scoped
* Real-time broadcast

Messages:

* Are persisted
* Can be deleted
* Can trigger notifications

---

## 6. System 3 – Execution Backend (Docker Runtime)

### 6.1 Purpose

The execution backend is a **sandboxed runtime environment**.

Its job:

* Execute user code
* Run terminals
* Expose previews
* Isolate execution safely

This backend is **never directly exposed** to the public internet.

---

### 6.2 Why Docker?

Docker provides:

* Process isolation
* Resource limits
* Security boundaries
* Clean teardown

Each execution session runs inside a **controlled container environment**.

---

## 6.3 Node PTY (Terminal Execution)

Inside the container:

* A **Node PTY** is spawned
* Shell (bash/sh) is attached
* Input/output is streamed via WebSocket

This gives:

* Real terminal behavior
* Support for interactive commands
* Compatibility with standard tooling

---

### 6.4 Ephemeral Disk Strategy

When a terminal session starts:

1. Backend requests project files from Main Backend
2. Files are reconstructed on container disk
3. Disk exists only for the session duration

On exit:

* Disk is destroyed
* No state persists locally

Persistence always flows **back to the main backend database**.

---

## 6.5 Proxy Middleware (Preview System)

When an app starts (e.g. `npm run dev`):

* Backend detects exposed ports
* Assigns a secure token
* Proxies traffic through a middleware

Preview URL pattern:

```
/preview/{userId}/{port}?token=xyz
```

This prevents:

* Port scanning
* Unauthorized access
* Cross-user leaks

---

## 6.6 Xvfb (GUI Support)

Some apps require a display (e.g. GUI tools, headless browsers).

For this:

* **Xvfb (X Virtual Framebuffer)** is used
* Provides a virtual display inside container
* GUI output is proxied via web endpoints

This allows:

* GUI apps
* Visual tools
* Admin dashboards

---

## 7. Data Flow – End to End

### Example: User edits code and runs project

1. User edits file in frontend
2. Change sent via WebSocket
3. Main backend saves file
4. Main backend broadcasts update
5. Execution backend receives update
6. File is updated on disk
7. User runs command
8. PTY executes inside Docker
9. Output streamed back
10. Preview port detected
11. Secure preview exposed

---

## 8. Why This Architecture Works

### Scalability

* Frontend scales independently
* Execution backend scales horizontally
* Main backend controls coordination

### Security

* No direct container access
* Tokenized previews
* No persistent disk in containers

### Reliability

* Stateless execution
* Centralized persistence
* Clean teardown on failure

---

## 9. What Makes DevSync Different

* Real PTY, not fake terminals
* DB-first file storage
* Execution environments are disposable
* True real-time collaboration
* Clean separation of frontend, logic, and execution

---

## 10. Routes
---
* ## Nextjs Routes
  * Dashboard -> [dashboard](../nextjs/appRoute/dashboard/README.MD)
  * Project -> [project](../nextjs/appRoute/project/README.MD)
  * Settings -> [settings](../nextjs/appRoute/settings/README.MD)
  * Chat -> [chat](../nextjs/appRoute/team/README.MD)
  * Profile -> [profile](../nextjs/appRoute/profile/README.MD)
---
* ## Main Beckend 
  * Server -> [server](../mainBeckend/server/README.MD)

---
* ## Secondary Beckend
  * Server -> [server](../renderBeckend/server/README.MD)

---
