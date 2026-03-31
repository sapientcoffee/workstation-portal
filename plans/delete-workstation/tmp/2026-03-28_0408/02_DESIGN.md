# Architecture & Design: Delete Workstation

## 1. Where We Are Going (Architecture Overview)
**Goal:** Introduce a secure and explicit deletion flow for Cloud Workstations within the developer portal.
**Alignment:** We are adhering to the existing lightweight MVC-like pattern. The React frontend handles user intent and basic UI gating, while the Express backend acts as a proxy, relying on Google Cloud IAM via a user-scoped OAuth client for absolute security. No new state management libraries or database schemas are introduced.

## 2. Component Design & Trade-offs

### 2.1 Ownership Verification (Frontend & Backend)
*   **Frontend Check:** The UI will implement a visibility gate for the "Delete" button. We will compare the authenticated user's email (`user.email`) against the workstation's creator annotation (`ws.annotations['workstations.googleapis.com/creator']`) or owner label (`ws.labels['owner']`).
*   **Security Trade-off:** Client-side hiding is purely for User Experience. If a malicious user bypasses the UI, the backend's user-scoped `WorkstationsClient` ensures that GCP IAM policies block the deletion if the user lacks the `workstations.workstations.delete` permission.

### 2.2 Confirmation Modal & The Disk Policy Limitation
*   **The Constraint:** The GCP `DeleteWorkstation` API does not accept a parameter to retain or delete the persistent disk. Disk lifecycle is strictly governed by the `reclaimPolicy` defined on the parent `WorkstationConfig`.
*   **Design Solution:**
    1.  **User Choice:** The React confirmation modal will include a checkbox: `[ ] Also delete persistent disk`.
    2.  **Disclaimer:** The UI will clearly state: *"Note: If your organization's Workstation Configuration enforces a RETAIN policy, your disk will not be deleted even if checked. An administrator must manually reclaim it."*
    3.  **Backend Logic:** The backend endpoint (`/api/workstations/delete`) will accept a `deleteDisk` boolean. 
        *   It will execute the `DeleteWorkstation` request.
        *   If `deleteDisk` is true, the backend will fetch the `WorkstationConfig`. If the config's `reclaimPolicy` is `RETAIN`, the API will return a HTTP 202 (Accepted) with a specific `warning` payload, allowing the frontend to alert the user that manual admin intervention is required for the disk.

### 2.3 Backend API Integration
*   **Endpoint:** `POST /api/workstations/delete`
*   **Pattern:** Follows the existing `asyncHandler` pattern in `server.js`.
*   **LRO Handling:** Like start/stop, deletion is a Long-Running Operation (LRO). The backend will return the operation name, and the frontend will enter a polling/loading state until the resource is removed from the `GET /api/workstations/all` list.

## 3. Structural Boundaries
- **`src/App.jsx`**: Handles the Modal state (`isDeleteModalOpen`, `selectedWorkstation`, `deleteDiskChecked`). Maps `handleDelete` to the new API.
- **`server.js`**: Exposes the `POST /api/workstations/delete` route, integrates the `@google-cloud/workstations` SDK for deletion and config retrieval.