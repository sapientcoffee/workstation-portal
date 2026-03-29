# Implementation Plan: Workstation Detailed View

## 📋 Micro-Step Checklist
- [ ] Phase 1: Dependencies Integration
  - [ ] Step 1.A: Create Dependency Verification Harness
  - [ ] Step 1.B: Install Backend and Frontend Dependencies
- [ ] Phase 2: Backend Implementation
  - [ ] Step 2.A: Create API Verification Harness
  - [ ] Step 2.B: Implement Workstation Details & Telemetry API
- [ ] Phase 3: Frontend State & Styling
  - [ ] Step 3.A: Create UI Structural Verification Harness
  - [ ] Step 3.B: Add Drawer CSS and App State
- [ ] Phase 4: Frontend Component Integration
  - [ ] Step 4.A: Create Component Verification Harness
  - [ ] Step 4.B: Implement DetailPanel and Recharts Integration

## 📝 Step-by-Step Implementation Details

### Phase 1: Dependencies Integration
#### Step 1.A (The Verification Harness):
*   *Target File:* `scripts/verify-dependencies.sh`
*   *Verification:* Write a bash script that checks `package.json` for `@google-cloud/monitoring` and `recharts` using `grep`. It should fail initially (Red).
    ```bash
    # scripts/verify-dependencies.sh
    grep -q "\"@google-cloud/monitoring\"" package.json && grep -q "\"recharts\"" package.json || exit 1
    echo "Dependencies found."
    ```

#### Step 1.B (The Core Change):
*   *Target File:* `package.json`
*   *Instructions:* Install the required backend and frontend packages.
*   *Verification:* Run `npm install @google-cloud/monitoring recharts`. Then run `bash scripts/verify-dependencies.sh` to see it pass (Green).

### Phase 2: Backend Implementation
#### Step 2.A (The Verification Harness):
*   *Target File:* `scripts/test-workstation-details.sh`
*   *Verification:* Create a script using `curl` to test `GET http://localhost:8080/api/workstations/details?name=invalid_name`. Assert that it does not return a 404. This must fail (404 Not Found) before the route is implemented.

#### Step 2.B (The Core Change):
*   *Target File:* `server.js`
*   *Instructions:*
    1. Import `monitoring` from `@google-cloud/monitoring`.
    2. Initialize `const metricClient = new monitoring.MetricServiceClient();`.
    3. Add a helper function to parse GCP resource names to extract the `projectId` and `location` from the workstation name.
    4. Implement `app.get('/api/workstations/details', async (req, res) => { ... })`.
    5. Inside the route, extract the `name` query parameter.
    6. Fetch workstation configuration details via `workstationsClient.getWorkstation({ name })`.
    7. Construct a time series filter string for CPU/Memory metrics and fetch using `metricClient.listTimeSeries()`.
    8. Combine both the configuration data and the formatted timeseries arrays, and return as JSON.
*   *Verification:* Run `node server.js` and execute `bash scripts/test-workstation-details.sh` to ensure it passes (returns 400 or 200, not 404).

### Phase 3: Frontend State & Styling
#### Step 3.A (The Verification Harness):
*   *Target File:* `scripts/check-detail-css.js`
*   *Verification:* Write a small Node script reading `src/index.css` to assert the presence of a `.detail-panel` or `.drawer` CSS class definition. Must fail initially.

#### Step 3.B (The Core Change):
*   *Target File:* `src/index.css` & `src/App.jsx`
*   *Instructions:*
    1. In `src/index.css`, add CSS for a right-side sliding drawer panel (e.g., fixed position, top 0, right 0, specific width, high z-index, transform transitions, drop shadow).
    2. In `src/App.jsx`, import `useState` and add `const [selectedWorkstationName, setSelectedWorkstationName] = useState(null);`.
    3. Update the existing workstation list rendering (e.g., table rows or cards) to attach an `onClick` handler that calls `setSelectedWorkstationName(workstation.name)`.
*   *Verification:* Run `node scripts/check-detail-css.js` to verify CSS changes. Start the Vite dev server (`npm run dev`) and verify no compilation errors.

### Phase 4: Frontend Component Integration
#### Step 4.A (The Verification Harness):
*   *Target File:* `scripts/verify-frontend.js`
*   *Verification:* Update the existing verify-frontend script to assert that `src/App.jsx` contains the `DetailPanel` component definition and imports from `recharts` (e.g., `import { LineChart`). Must fail initially.

#### Step 4.B (The Core Change):
*   *Target File:* `src/App.jsx`
*   *Instructions:*
    1. Import components from `recharts`: `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`.
    2. Create a new component `function DetailPanel({ workstationName, onClose })`.
    3. Implement `useEffect` within `DetailPanel` to fetch `fetch('/api/workstations/details?name=' + encodeURIComponent(workstationName))`.
    4. Manage local state for `details` and `loading`.
    5. Render the workstation configuration details (Status, Host IP, Create Time, Annotations, etc.).
    6. Render the telemetry charts using `<ResponsiveContainer>` and `<LineChart>` feeding in the time series data retrieved from the API.
    7. Render `<DetailPanel workstationName={selectedWorkstationName} onClose={() => setSelectedWorkstationName(null)} />` in the main `App` return block, conditionally wrapped or styled if `selectedWorkstationName` is truthy.
*   *Verification:* Run `node scripts/verify-frontend.js`. Then manually verify by loading `http://localhost:5173`, clicking a workstation row, and asserting the drawer opens, displays configuration details, and renders the telemetry chart successfully.