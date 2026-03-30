# Implementation Plan: Workstation Detail View

## 📋 Micro-Step Checklist
- [ ] Phase 1: Dependencies and Initialization
  - [ ] Step 1.A: Add `@google-cloud/monitoring` to project dependencies
  - [ ] Step 1.B: Import monitoring module in Express backend
- [ ] Phase 2: Backend API Endpoint (BFF)
  - [ ] Step 2.A: Create backend verification harness
  - [ ] Step 2.B: Implement `/api/workstations/details` endpoint logic
- [ ] Phase 3: Frontend Detail Component
  - [ ] Step 3.A: Create frontend verification harness (Playwright)
  - [ ] Step 3.B: Implement `WorkstationDetailPanel.jsx` and styling
- [ ] Phase 4: Frontend State & Integration
  - [ ] Step 4.A: Integrate Side Panel into `App.jsx` and wire click handlers

## 📝 Step-by-Step Implementation Details

### Phase 1: Dependencies and Initialization
#### Step 1.A (Add `@google-cloud/monitoring` to project dependencies):
*   *Target File:* `package.json`
*   *Instructions:* Add `@google-cloud/monitoring` to the dependencies list or install via npm.
*   *Verification:* Run `npm install @google-cloud/monitoring --save`. Verify `package.json` is updated and `npm start` still runs successfully.

#### Step 1.B (Import monitoring module in Express backend):
*   *Target File:* `server.js`
*   *Instructions:* At the top of the file, add `const monitoring = require('@google-cloud/monitoring');` and initialize `const monitoringClient = new monitoring.MetricServiceClient();`.
*   *Verification:* Ensure the server still starts by running `node server.js` briefly.

### Phase 2: Backend API Endpoint (BFF)
#### Step 2.A (The Verification Harness):
*   *Target File:* `scripts/test-api-detail.sh`
*   *Verification:* Create a script that hits `GET http://localhost:3001/api/workstations/details?name=invalid-name`. It should assert a failure explicitly before we implement the endpoint (expect 404).

#### Step 2.B (The Core Change):
*   *Target File:* `server.js`
*   *Instructions:* Implement `app.get('/api/workstations/details', async (req, res) => { ... })`. Ensure `req.query.name` is provided. Extract the config path. Await `workstationsClient.getWorkstationConfig` and await `monitoringClient.listTimeSeries` to aggregate both payload pieces. Catch errors and return 500 appropriately. Return the aggregated `{ config, telemetry }` JSON.
*   *Verification:* Modify `scripts/test-api-detail.sh` to expect a 200, 400, or 401. Run `bash scripts/test-api-detail.sh` and see it PASS.

### Phase 3: Frontend Detail Component
#### Step 3.A (The Verification Harness):
*   *Target File:* `tests/workstation-detail.spec.js`
*   *Verification:* Write an E2E Playwright test (Red) that mocks the API, simulates a workstation card click, and asserts a `.detail-panel` side-drawer with `workstation.name` is visible. Ensure it fails first by running `npm run test:e2e tests/workstation-detail.spec.js`.

#### Step 3.B (The Core Change):
*   *Target File:* `src/components/WorkstationDetailPanel.jsx` (and `WorkstationDetailPanel.css`)
*   *Instructions:* Implement the UI component taking `workstation` and `onClose` props. It should manage a `details` state. Trigger a `fetch` against `/api/workstations/details?name=${workstation.name}` inside `useEffect` on mount. Render a loading state, error state, and the slide-in drawer displaying telemetry and config data using Lucide icons (Server, HardDrive, Cpu, MemoryStick). Use Google copyright headers.
*   *Verification:* Ensure files compile without React errors (`npm run build`).

### Phase 4: Frontend State & Integration
#### Step 4.A (The Core Change):
*   *Target File:* `src/App.jsx`
*   *Instructions:* Import `WorkstationDetailPanel`. Add `const [selectedWorkstation, setSelectedWorkstation] = useState(null)`. Find the workstation card mapping and change its `onClick` or add an 'Inspect' button to call `setSelectedWorkstation(ws)`. Just before the closing `</div>` of the main layout, add `{selectedWorkstation && <WorkstationDetailPanel workstation={selectedWorkstation} onClose={() => setSelectedWorkstation(null)} />}`.
*   *Verification:* Run `npm run test:e2e tests/workstation-detail.spec.js` and verify the test now passes (Green).