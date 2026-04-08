# Architecture Structure: Vertex AI Metrics Dashboard

## 📂 Directory Additions
```text
apps/web/src/
└── components/
    ├── MetricsDashboard.jsx (New)
    └── UsageChart.jsx (New)

apps/workstations-api/src/
└── metrics.js (New)
```

## 🏗️ Structural Boundaries & Skeletons

### 1. Backend Module: `apps/workstations-api/src/metrics.js`
This module will handle the business logic and external API calls to Google Cloud Monitoring and Logging. It exports an Express Router to be mounted in `app.js`.

**Key Responsibilities:**
- Implement `GET /api/metrics/project`
- Implement `GET /api/metrics/user`
- Utilize `@google-cloud/monitoring` and `@google-cloud/logging` clients scoped to the authenticated user's token.

### 2. Frontend Component: `apps/web/src/components/MetricsDashboard.jsx`
A container component for the metrics view.

**Key Responsibilities:**
- Fetch data from `/api/metrics/project` and `/api/metrics/user`.
- Handle loading and error states (especially 401/403 for missing IAM roles).
- Render `UsageChart` components for visualization.

### 3. Frontend Component: `apps/web/src/components/UsageChart.jsx`
A presentational component built on top of `recharts`.

**Key Responsibilities:**
- Accept a `data` array prop and a `title` prop.
- Render a line or bar chart using `recharts` primitives (`LineChart`, `XAxis`, `YAxis`, `Tooltip`, `Line`).
