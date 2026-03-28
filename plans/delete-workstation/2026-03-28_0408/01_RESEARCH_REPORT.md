# Research Report: Workstation Management Lifecycle

This report maps the current state of workstation management in the portal, covering frontend components, backend logic, authentication, and GCP integration patterns.

## 1. Frontend: Workstation List & Data Structure
- **Component:** The primary workstation management UI is located in `src/App.jsx` within the `App` component.
- **Data Source:** Workstations are retrieved via `discoverWorkstations` which calls `GET /api/workstations/all`.
- **Data Structure:** The workstation object (`ws`) follows the Google Cloud Workstations API schema:
    - `name`: Full resource identifier: `projects/{project}/locations/{location}/workstationClusters/{cluster}/workstationConfigs/{config}/workstations/{id}`.
    - `state`: Resource state (e.g., `STATE_RUNNING`, `STATE_STOPPED`).
    - `host`: The hostname used to construct the launch URL.
    - `labels`: Key-value pairs for organizational metadata.
    - `annotations`: Key-value pairs for technical metadata.
    - `workstationConfig`: Extracted from the `name` to identify the template used.

## 2. Workstation Actions & Backend Integration
- **Existing Actions:**
    - **Start:** Triggered by `handleAction(name, 'start')`. Sends a `POST` to `/api/workstations/start`.
    - **Stop:** Triggered by `handleAction(name, 'stop')`. Sends a `POST` to `/api/workstations/stop`.
    - **Launch:** Opens `https://80-${ws.host}` in a new tab. Only enabled when state is `RUNNING`.
- **Backend Routes (`server.js`):**
    - `GET /api/workstations/all`: Uses wildcard resource names (`locations/-/workstationClusters/-/workstationConfigs/-`) to list all workstations for a project.
    - `POST /api/workstations/start`: Wraps `client.startWorkstation({ name })`.
    - `POST /api/workstations/stop`: Wraps `client.stopWorkstation({ name })`.
- **SDK Usage:** The backend uses the `@google-cloud/workstations` Node.js client library. Actions are Long-Running Operations (LROs).

## 3. Authentication & Ownership
- **Authentication Flow:**
    - **Frontend:** Uses Firebase Authentication with `signInWithPopup` (Google Provider).
    - **Token Management:** An OAuth `accessToken` is retrieved from the Firebase result and stored in state.
- **Ownership Validation:**
    - The `accessToken` is passed in the `Authorization: Bearer` header for all API calls.
    - **Backend Scoping:** The `getUserScopedClient` helper in `server.js` validates the token and initializes the `WorkstationsClient` with the user's credentials.
    - **IAM Enforcement:** Actual resource ownership and permission checks are delegated to Google Cloud IAM via the user-scoped client.

## 4. UI Patterns for Confirmation
- **Current State:** There are **no confirmation patterns** currently implemented in the UI.
- **Action Execution:** Clicking "Start" or "Stop" immediately invokes the API call and sets the UI into a loading state.
- **Feedback:** Error messages are displayed in a top-level error message box in the `App` component.

## 5. Deletion & Resource Retention Patterns
- **API Research:** The `deleteWorkstation` method in the GCP SDK is a Long-Running Operation.
- **Persistent Disk Retention:**
    - Disk retention is **not** a parameter of the `DeleteWorkstation` request.
    - Instead, it is governed by the `reclaimPolicy` defined in the **Workstation Configuration** (`WorkstationConfig`).
    - Policies are typically `DELETE` (default) or `RETAIN`. If set to `RETAIN`, the disk persists after the workstation is deleted and must be managed manually.
- **Request Parameters:** `DeleteWorkstationRequest` accepts `name`, `validate_only`, and `etag`.
