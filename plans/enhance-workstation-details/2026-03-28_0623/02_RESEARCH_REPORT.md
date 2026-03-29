# Research Report: Workstation Detailed View

## Factual Mapping of the Codebase

### 1. Workstation List Structure (`src/App.jsx`)
- The workstation list is rendered using `workstations.map(ws => ...)` within the main `App` component's `return` block (lines 352-409).
- Each workstation is inside a `div` with `className="workstation-card"`.
- Action buttons for Start, Stop, Launch, and Delete are already present in a `div` with `className="card-actions"`.

### 2. Frontend Environment & Auth
- **Backend URL**: `const API_URL = import.meta.env.VITE_API_URL || '';`.
- **Bearer Token**: Requests to the backend use the `Authorization: Bearer ${accessToken}` header.
- **State Management**: `App.jsx` uses standard `useState` for `workstations`, `loading`, and `user`.

### 3. CSS Patterns (`src/index.css`)
- **Theme**: Dark theme with indigo primary accents.
- **Grid**: Uses CSS Grid for the card layout (`grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))`).
- **Modals**: A standard modal for deletion exists (`.modal-backdrop`, `.modal-content`).
- **Missing**: No current implementation of a side-drawer or slide-out panel.

### 4. Backend Implementation (`server.js`)
- **Library**: Currently uses `@google-cloud/workstations`.
- **Auth**: `getUserScopedClient` uses the `google-auth-library` to verify the bearer token and create an `authClient` for the GCP SDK.
- **Endpoints**: Existing endpoints for `all`, `start`, `stop`, and `delete`.

### 5. Dependency Gaps
- **Backend**: Need to add `@google-cloud/monitoring` to fetch telemetry.
- **Frontend**: Need to add `recharts` for data visualization.

## Factual Analysis
- The backend `getUserScopedClient` helper is reusable for the Monitoring API as it generates a standard `OAuth2Client` with the user's token.
- The `WorkstationConfig` name can be extracted from the workstation resource name: `projects/${PROJECT}/locations/${LOCATION}/workstationClusters/${CLUSTER}/workstationConfigs/${CONFIG}`.
- Telemetry data for a workstation is available via Cloud Monitoring under the `gce_instance` resource type. Filtering must be done by `workstation_id` (which matches the last part of the workstation's name).
