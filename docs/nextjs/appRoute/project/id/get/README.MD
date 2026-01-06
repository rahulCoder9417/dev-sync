
***

# Project Page (`/projects/[id]`)

**File Path:** `src/app/projects/[id]/page.tsx`
## Overview
This is a Server Component responsible for fetching and rendering a specific project environment based on the URL parameter `id`. It acts as a gatekeeper, handling data fetching, error states, and access control (authorization) before rendering the main project editor.

## Workflow
1.  **Parameter Extraction:** Awaits the `params` object to retrieve the project `id`.
2.  **Data Fetching:** Calls `getProjectById(id)` to retrieve project metadata and content.
3.  **Error Handling:** Checks if the API response status is `200`. If not, renders an error screen with the specific error message.
4.  **Access Control:** Verifies user permissions. If the project is **Private** and the user is neither the **Owner** nor a **Team Member**, an "Access Denied" screen is rendered.
5.  **Successful Render:** If all checks pass, it renders the core project component.

## Dependencies

| Component/Function | Description |
| :--- | :--- |
| `getProjectById` | Server action to fetch project data from the database. |
| `Button` | UI component for navigation actions. |
| `ProjectCodeComp` | **[Link to ProjectCodeComp documentation - [ProjectCodeComp](../../../../componenets/project/get/ProjectCodeComp/README.MD)]**. The main component that displays the project code/editor. |

## Access Control Logic
The page enforces security using the following logic:
```javascript
if (
  data.responseData.type !== "PUBLIC" && 
  !(data.responseData.isOwner || data.responseData.isTeamMember)
) {
  // Render Access Denied
}
```

## Return States

### 1. Error State
Renders when the backend returns a non-200 status.
*   **UI:** Full-screen primary background.
*   **Content:** Error message, Status code, and a "Go to Projects" button.

### 2. Access Denied State
Renders when a user tries to access a private project they do not own or belong to.
*   **UI:** Full-screen primary background.
*   **Content:** "You are not the owner of this project" message and a "Go to Projects" button.

### 3. Success State
Renders the actual project interface. 
*   **Component:** `<ProjectCodeComp />` 
*   **Props Passed:** `data={data.responseData}`

***
`