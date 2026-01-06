
***

# Project Code Component (`ProjectCodeComp`)

**File Path:** `src/components/project/id/ProjectCodeComp.tsx`

## Overview
This is the main **Client Component** that renders the IDE interface. It acts as the layout orchestrator, managing the state for opened files, tabs, panel resizing, and visibility. It initializes the real-time collaboration session and passes connection handlers down to child components.

## Key Features
*   **Resizable Layout:** Users can drag borders to resize the File Explorer, Code Editor, Preview, and Chat panels.
*   **Panel Toggling:** A floating action button allows users to toggle the visibility of specific panels.
*   **Tab Management:** Manages the state of active code tabs and handles opening/closing files.
*   **Access Control:** Redirects unauthorized users to the dashboard.
*   **Collaboration Root:** Initializes the WebSocket connection via `useCollab`.

## Props
| Prop | Type | Description |
| :--- | :--- | :--- |
| `data` | `ProjectById["responseData"]` | The full project metadata, including file structure, team members, and permissions. |

## Dependencies & Child Components
This component relies on the following sub-components and hooks:

*   **Logic & State:**
    *   [Link to useCollab Hook](../../../../features/useCollab/README.MD) - Handles WebSocket connections, cursors, and CRDTs.
*   **UI Components:**
    *   [Link to FileExplorer](../FileExplorer/README.MD) - Displays the directory tree and handles file operations.
    *   [Link to CodeEditor](../CodeEditor/README.MD) - The Monaco editor instance.
    *   [Link to Preview](../preview/README.MD) - The live web container/terminal preview.

## State Management

### Layout Visibility
The `visibleSection` state object controls which panels are rendered. Logic is included to prevent mobile users from opening too many panels simultaneously.

### Resizing Logic
Ref-based event listeners (`mousemove`, `mouseup`) calculate the percentage width of panels based on the container size.

***
