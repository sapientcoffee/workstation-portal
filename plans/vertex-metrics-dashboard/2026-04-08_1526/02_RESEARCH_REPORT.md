# Research Report: Vertex AI Metrics Dashboard

## 1. Technical Grounding (GCP Metrics Discovery)
- **Primary Metrics Source:**
    - **Cloud Monitoring API (`monitoring.googleapis.com`):** Best for project-wide, aggregated metrics like `request_count`, `token_count`, and `error_count`.
    - **Cloud Logging API (`logging.googleapis.com`):** Best for user-specific usage attribution. Vertex AI logs contain `principalEmail`, which can be used to filter usage by the logged-in user's email.
- **Key Metrics identified:**
    - `vertexai.googleapis.com/llm/request_count`
    - `vertexai.googleapis.com/llm/token_count`
- **User Attribution:** Metrics in Cloud Monitoring are generally aggregated. For the "User-Specific" view, the backend will need to query Cloud Logging for entries matching the user's `principalEmail` to derive their specific usage.

## 2. Granularity & Filtering
- **Project-Wide:** Readily available through the `monitoring` SDK with `project_id`.
- **User-Specific:** Requires fetching logs via `logging` SDK and filtering by `protoPayload.authenticationInfo.principalEmail`. This requires the user's token to have `logging.viewer` permissions.

## 3. Frontend Architecture (Navigation & Layout)
- **Location:** `apps/web/src/App.jsx`.
- **Navigation Structure:** Current navigation is handled directly in `App.jsx` using simple state variables (`user`, `accessToken`).
- **Implementation Strategy:** Introduce a `currentView` state (e.g., `'workstations'`, `'metrics'`) to switch between the existing workstation list and the new dashboard.

## 4. Visualization Patterns
- **Current State:** No data visualization libraries are currently installed.
- **Recommendation:** Install `recharts` in the `apps/web` workspace. It is a React-friendly SVG library that integrates well with functional components and hooks.

## 5. Backend API Patterns
- **Location:** `apps/workstations-api/src/app.js`.
- **Client Instantiation:** Leverage the existing `getUserScopedClient` pattern but expand it to initialize `@google-cloud/monitoring` and `@google-cloud/logging` clients using the user's OAuth token.
- **Endpoint Design:** Add new GET endpoints:
    - `/api/metrics/project`: Aggregated project metrics.
    - `/api/metrics/user`: Usage specifically for the authenticated user.

## 6. Authorization & RBAC
- **Delegated IAM:** The backend will continue to use the user's token directly. Access to metrics will succeed only if the user has the necessary GCP IAM roles (e.g., `Monitoring Viewer`, `Logging Viewer`).
- **No local RBAC:** No change to the existing "delegated authorization" model is required.
