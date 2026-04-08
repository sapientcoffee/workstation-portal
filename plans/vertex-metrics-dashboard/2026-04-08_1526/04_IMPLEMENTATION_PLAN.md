# Implementation Plan: Vertex AI Metrics Dashboard

## 📋 Micro-Step Checklist
- [x] Phase 1: Environment & Dependencies
  - [x] Step 1.A: Install Backend Dependencies
  - [x] Step 1.B: Install Frontend Dependencies
- [x] Phase 2: Backend Implementation
  - [x] Step 2.A: Create Metrics Router Test Harness
  - [x] Step 2.B: Implement Project Metrics Logic
  - [x] Step 2.C: Implement User Metrics Logic
  - [x] Step 2.D: Mount Metrics Router in `app.js`
- [x] Phase 3: Frontend Implementation
  - [x] Step 3.A: Implement `UsageChart` Component
  - [x] Step 3.B: Implement `MetricsDashboard` Component
  - [x] Step 3.C: Update `App.jsx` Routing & State
- [x] Phase 4: Integration & Security Checks
  - [x] Step 4.A: Handle IAM Errors (401/403) Gracefully
  - [x] Step 4.B: Manual E2E Verification

## 📝 Step-by-Step Implementation Details

### Phase 1: Environment & Dependencies
#### Step 1.A (Install Backend Dependencies):
*   *Target Directory:* `apps/workstations-api/`
*   *Instructions:* Install `@google-cloud/monitoring` and `@google-cloud/logging` using npm.
*   *Verification:* Run `npm i @google-cloud/monitoring @google-cloud/logging` in `apps/workstations-api/`. Check `package.json` to ensure they are added.

#### Step 1.B (Install Frontend Dependencies):
*   *Target Directory:* `apps/web/`
*   *Instructions:* Install `recharts` using npm.
*   *Verification:* Run `npm i recharts` in `apps/web/`. Check `package.json` to ensure it is added.

### Phase 2: Backend Implementation
#### Step 2.A (Create Metrics Router Test Harness):
*   *Target File:* `apps/workstations-api/tests/metrics.test.js`
*   *Verification:* Write explicit assertions for `/api/metrics/project` and `/api/metrics/user` endpoints. Ensure they check for 401 when no token is provided. Run `npm test` inside `apps/workstations-api/` to verify tests fail (Red).

#### Step 2.B (Implement Project Metrics Logic):
*   *Target File:* `apps/workstations-api/src/metrics.js`
*   *Instructions:* Implement logic in the `/project` endpoint using `MetricServiceClient`. Initialize it using the `authorization` header's bearer token. Query Google Cloud Monitoring for Vertex AI metrics and transform the response into a flat array structure for recharts (`[{ time: '...', value: 123 }, ...]`).
*   *Verification:* Update the test harness and run `npm test`.

#### Step 2.C (Implement User Metrics Logic):
*   *Target File:* `apps/workstations-api/src/metrics.js`
*   *Instructions:* Implement logic in the `/user` endpoint using `Logging`. Query Cloud Logging for Vertex AI logs filtered by the authenticated user's `principalEmail`. Transform the data for `recharts`.
*   *Verification:* Run `npm test`.

#### Step 2.D (Mount Metrics Router in `app.js`):
*   *Target File:* `apps/workstations-api/src/app.js`
*   *Instructions:* Import the `metricsRouter` from `./metrics.js` and mount it using `app.use('/api/metrics', metricsRouter)`.
*   *Verification:* Ensure all API tests pass.

### Phase 3: Frontend Implementation
#### Step 3.A (Implement UsageChart Component):
*   *Target File:* `apps/web/src/components/UsageChart.jsx`
*   *Instructions:* Replace the skeleton with an actual `recharts` `ResponsiveContainer`, `LineChart`, `XAxis`, `YAxis`, `Tooltip`, and `Line` rendering the `data` prop.
*   *Verification:* Check formatting and linter errors using `npm run lint` in the `web` workspace.

#### Step 3.B (Implement MetricsDashboard Component):
*   *Target File:* `apps/web/src/components/MetricsDashboard.jsx`
*   *Instructions:* Implement the `useEffect` hook to fetch data from `/api/metrics/project` and `/api/metrics/user` using the `fetch` API. Handle loading states. Ensure `authorization: Bearer ${token}` header is set. Map the response data to state.
*   *Verification:* Use React Developer Tools to verify state updates.

#### Step 3.C (Update App.jsx Routing & State):
*   *Target File:* `apps/web/src/App.jsx`
*   *Instructions:* Introduce a state `currentView` initialized to `'workstations'`. Add UI navigation (e.g. tabs or sidebar links) to toggle between `'workstations'` and `'metrics'`. Render `<MetricsDashboard token={token} userEmail={userEmail} />` when `currentView === 'metrics'`.
*   *Verification:* Run `npm run dev` and visually verify navigation toggles between views.

### Phase 4: Integration & Security Checks
#### Step 4.A (Handle IAM Errors):
*   *Target File:* `apps/web/src/components/MetricsDashboard.jsx`
*   *Instructions:* Ensure `401 Unauthorized` and `403 Forbidden` responses from the API gracefully set the `error` state. Validate that the UI displays a clear message indicating missing `Monitoring Viewer` or `Logging Viewer` roles.
*   *Verification:* Trigger a deliberate 403 error (e.g., using a test token with no roles) and visually confirm the error state in the browser.

#### Step 4.B (Manual E2E Verification):
*   *Target File:* Browser / UI
*   *Instructions:* Use `gcloud auth print-access-token` to get a valid token. Navigate to `http://localhost:5173/?test_token=<TOKEN>`. Click the "Metrics" view and verify charts render real Google Cloud data without console errors.
*   *Verification:* Successful render of graphs.
