# Walkthrough: Vertex AI Metrics Dashboard

## 📊 Technical Summary
This feature adds a comprehensive dashboard to the Workstation Portal to track token and AI model usage metrics against Vertex AI.

### Key Changes:
- **Backend (`apps/workstations-api`):**
    - Refactored authentication and client instantiation into `src/auth.js` for architectural consistency.
    - Implemented a new `metricsRouter` with `GET /api/metrics/project` (Project-wide aggregated metrics) and `GET /api/metrics/user` (Individual usage via Cloud Logging).
    - Verified with a suite of 13 unit tests in `tests/metrics.test.js`.
- **Frontend (`apps/web`):**
    - Added the `recharts` library for data visualization.
    - Implemented the `UsageChart` component for high-quality, time-series plotting.
    - Developed the `MetricsDashboard` component to fetch and display data with robust error handling (including detailed prompts for missing IAM roles).
    - Integrated a new navigation tab into `App.jsx` to switch between views.

## 🖼️ Visual Evidence

### 1. New Navigation Button
The app now features a "Vertex AI Metrics" button in the header, allowing users to switch away from the workstation list.

![Main Dashboard](/plans/vertex-metrics-dashboard/2026-04-08_1526/01_main_page.png)

### 2. Error & Permissions Handling
The dashboard gracefully handles cases where the user lacks the necessary GCP IAM roles (`roles/monitoring.viewer` or `roles/logging.viewer`) or if metrics are not yet available in the project.

![Error State](/plans/vertex-metrics-dashboard/2026-04-08_1526/02_error_state.png)

## ✅ Verification Evidence
The feature has been verified in the local development environment (`Turborepo`):
- **Backend Tests:** All Vitest tests passed for the new metrics routes.
- **Frontend Build:** The application builds successfully with no linting errors.
- **Manual Verification:** Live navigation between views correctly fetches and displays the metrics dashboard containers.
