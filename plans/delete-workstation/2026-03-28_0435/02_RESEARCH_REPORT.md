# Research Report: DELETE Workstation Feature

## Existing Patterns & Infrastructure

### 1. Backend Architecture (`server.js`)
- **SDK:** Uses `@google-cloud/workstations` Node.js client.
- **Auth:** `getUserScopedClient(req)` extracts OAuth tokens from the `Authorization` header to authenticate GCP requests.
- **Actions:** Start and Stop are implemented as `POST /api/workstations/start` and `POST /api/workstations/stop`. They return an LRO object name.
- **Error Handling:** `asyncHandler` is used for global error management.

### 2. Frontend Architecture (`src/App.jsx`)
- **State:** `workstations`, `loading`, `error`, and `accessToken` are the primary state hooks.
- **Action Handler:** `handleAction(workstationName, action)` is a generic async function for POST requests to the backend.
- **Polling:** Currently uses a naive `setTimeout` approach (3s and 8s) to refresh the UI after an action is triggered.
- **Icons:** Uses `lucide-react`.

### 3. UI Components & Styling
- **Layout:** Workstations are rendered in a grid (`.workstations-grid`) with individual cards (`.workstation-card`).
- **CSS:** `src/index.css` contains all styles. It currently **LACKS** modal classes (`.modal-backdrop`, `.modal-content`, etc.), although these are expected by `scripts/check-css.js`.
- **Modals:** No existing React modal component or state is present.

### 4. Technical Gaps Identified
- **Missing API:** No `DELETE` endpoint in `server.js`.
- **Missing Modal:** Need to implement a custom React modal and the corresponding CSS.
- **Polling Logic:** To satisfy the "Wait for Completion" requirement, the current `setTimeout` polling should be replaced with a more robust mechanism (e.g., recursive polling or a blocking backend call).

## Recommendations for Design
- **Backend:** Add `POST /api/workstations/delete`. For "Wait for Completion", we can either `await operation.promise()` in the backend or implement proper polling in the frontend. Given the frontend's current simplicity, a blocking backend call with a timeout might be the easiest "Wait for Completion" implementation, or we can use the existing `handleAction` pattern and improve the polling.
- **Frontend State:** Add `deleteWorkstation` state (null or workstation object) to control the modal visibility.
- **CSS:** Add `.modal-backdrop`, `.modal-content`, and `.btn-danger` to `src/index.css` to pass the `check-css.js` script.
