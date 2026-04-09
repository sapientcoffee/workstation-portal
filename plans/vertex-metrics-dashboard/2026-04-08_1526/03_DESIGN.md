# High-Level Design: Vertex AI Metrics Dashboard

## 1. Architectural Overview & Alignment
The Vertex AI Metrics Dashboard will be integrated into the existing Turborepo monorepo structure, strictly adhering to the established pattern of a React SPA (Frontend) and an Express.js REST API (Backend). 

To remain aligned with the existing security posture, this feature will utilize **Delegated Authorization**. The backend will not use a backend service account to fetch global data and implement custom RBAC; instead, it will instantiate Google Cloud SDK clients using the calling user's OAuth token. This ensures all data access is strictly governed by the user's exact IAM permissions in GCP.

## 2. Backend Design (`apps/workstations-api`)
The backend will serve as an authenticated proxy and aggregator for Google Cloud Monitoring and Logging APIs.

### API Endpoints
*   **`GET /api/metrics/project`**: 
    *   **Source:** Cloud Monitoring API (`monitoring.googleapis.com`).
    *   **Purpose:** Retrieves aggregated, project-wide Vertex AI metrics (e.g., `request_count`, `token_count`).
    *   **Client:** `@google-cloud/monitoring` (Requires addition to `package.json`).
*   **`GET /api/metrics/user`**:
    *   **Source:** Cloud Logging API (`logging.googleapis.com`).
    *   **Purpose:** Retrieves user-specific usage by filtering log entries matching the authenticated user's `principalEmail`.
    *   **Client:** `@google-cloud/logging` (Requires addition to `package.json`).

### Patterns & Trade-offs
*   **Pattern - Scoped Clients:** We will reuse the `getUserScopedClient(req)` pattern currently established in `server.js` or standard middleware, extending it to initialize the Monitoring and Logging clients.
*   **Trade-off - Direct Querying vs. Caching:** We are opting for direct querying of GCP APIs on every request rather than implementing a caching layer (like Redis or in-memory LRU). While caching reduces GCP API quota usage and improves latency, the delegated authorization model requires the data to be fetched in the context of the user's specific token. Caching per-user metrics introduces unnecessary complexity and potential cross-contamination risks for the initial rollout.

## 3. Frontend Design (`apps/web`)
The frontend will introduce a new view to display the metrics, maintaining the current application's lightweight, hook-based React architecture and Tailwind CSS for styling.

### Component Structure
*   **Routing State:** We will introduce a `currentView` state (e.g., `'workstations'`, `'metrics'`) within `src/App.jsx` to manage top-level navigation without introducing a heavy client-side router library.
*   **`MetricsDashboard` (New Component):** A container component responsible for fetching data from the new API endpoints and managing loading/error states.
*   **`UsageChart` (New Component):** A presentational component for visualizing token and request counts over time.

### Visualization & Trade-offs
*   **Library Choice:** We will adopt **`recharts`** for data visualization in the `apps/web` workspace.
*   **Trade-off:** Compared to D3.js (steep learning curve, highly imperative) or Chart.js (canvas-based, harder to style with CSS), `recharts` is built specifically for React, uses composable SVG components, and aligns perfectly with our functional component and declarative architecture.

## 4. Security & Authorization Risks
*   **IAM Dependencies:** Because we are using delegated auth, users will experience API errors if they do not have the `Monitoring Viewer` and `Logging Viewer` roles in their Google Cloud Project. 
*   **Mitigation:** The frontend must gracefully handle `403 Forbidden` and `401 Unauthorized` responses from the `/api/metrics/*` endpoints. It must display a clear, user-friendly UI state explaining the required GCP permissions (e.g., "Missing Logging/Monitoring Viewer roles") rather than a generic crash or unhandled promise rejection.
