# Implementation Plan: Delete Workstation Feature

## 📋 Micro-Step Checklist
- [ ] Phase 1: Backend Infrastructure (API Endpoints)
  - [ ] Step 1.A: Implement `GET /api/workstations/config` in `server.js`
  - [ ] Step 1.B: Implement `DELETE /api/workstations` in `server.js`
- [ ] Phase 2: Frontend Data Access & State
  - [ ] Step 2.A: Define Action Helpers (`fetchConfigPolicy`, access control) in `App.jsx`
  - [ ] Step 2.B: Implement State Tracking (`deletingWorkstations` state & Polling Loop)
- [ ] Phase 3: UI Integration
  - [ ] Step 3.A: Add "Delete" button with danger styles
  - [ ] Step 3.B: Wire up native `confirm()` with fetched policy and `handleDelete` dispatcher

## 📝 Step-by-Step Implementation Details

### Phase 1: Backend Infrastructure (API Endpoints)
#### Step 1.A (The Configuration Fetcher):
*   *Target File:* `server.js`
*   *Instructions:* Add a new `GET /api/workstations/config` route to retrieve the configuration of a workstation. It should read `req.query.name` (the full resource path of the configuration). Validate the input, instantiate the client using `getUserScopedClient(req)`, and call `client.getWorkstationConfig({ name })`. Return the first element of the returned array as JSON.
*   *Verification:* Restart the server and test with `curl` or a browser (with a valid token) to ensure the endpoint returns configuration JSON containing `persistentDirectories`.

#### Step 1.B (The Delete Endpoint):
*   *Target File:* `server.js`
*   *Instructions:* Add a new `DELETE /api/workstations` route. Extract `name` (the full resource path of the workstation) from `req.body`. Validate the input starts with `'projects/'`. Instantiate the client and call `client.deleteWorkstation({ name })`. Return a JSON response with the returned operation name: `{ message: 'Deleting', operation: operation.name }`.
*   *Verification:* Trigger a delete using `curl` and verify it returns a valid operation name and that the GCP console reflects the deletion.

### Phase 2: Frontend Data Access & State
#### Step 2.A (Action Helpers):
*   *Target File:* `src/App.jsx`
*   *Instructions:* 
    *   Create `const isOwnerOrAdmin = (ws, user) => ...`. The logic should check if `user.email` matches `import.meta.env.VITE_ADMIN_EMAILS` OR matches `ws.annotations?.['workstations.googleapis.com/creator']`.
    *   Create a helper to extract the full configuration path from the workstation name: `const configPath = ws.name.split('/workstations/')[0]`.
    *   Create an asynchronous function `handleDelete(workstation)` that fetches the config policy (`fetch('/api/workstations/config?name=' + configPath)`), reads `persistentDirectories[0].gcePd.reclaimPolicy`, and opens a `window.confirm`.
*   *Verification:* Add `console.log` to test these functions in isolation when a mock workstation object is passed.

#### Step 2.B (State Tracking & Polling Loop):
*   *Target File:* `src/App.jsx`
*   *Instructions:*
    *   Add `const [deletingWorkstations, setDeletingWorkstations] = useState(new Set());`.
    *   In `handleDelete`, if the user confirms, call the `DELETE /api/workstations` endpoint. On success, add `workstation.name` to `deletingWorkstations` state.
    *   Add a `useEffect` that checks if `deletingWorkstations.size > 0`. If true, set an interval (e.g., 5000ms) to call `discoverWorkstations()`. Clean up the interval on unmount or when `size === 0`.
    *   Inside the same `useEffect`, compare `deletingWorkstations` against the current `workstations` array. If a tracked workstation is no longer in the array, remove it from the `deletingWorkstations` set.
*   *Verification:* Mock the delete endpoint to just return success and observe if the interval runs and stops correctly.

### Phase 3: UI Integration
#### Step 3.A (Button Styling & Structure):
*   *Target File:* `src/index.css`
*   *Instructions:* Add `.danger` button styling (e.g., background-color: #dc2626; color: white; hover states).
*   *Verification:* Apply the class to a test button and visually confirm the destructive styling.

#### Step 3.B (Wiring it together):
*   *Target File:* `src/App.jsx`
*   *Instructions:* 
    *   In the `.card-actions` div of the mapped workstations, conditionally render a "Delete" button if `isOwnerOrAdmin(ws, user)` is true.
    *   The button should be disabled if `deletingWorkstations.has(ws.name)`.
    *   If disabled due to deletion, change button text from "Delete" to "Deleting...".
    *   Ensure Start/Stop actions are also disabled when `deletingWorkstations.has(ws.name)`.
    *   Attach `onClick={() => handleDelete(ws)}`.
*   *Verification:* Run the full application. Attempt to delete a workstation. Verify the confirmation dialog shows the correct disk policy, the UI enters a "Deleting..." state, and the workstation disappears from the list once the backend deletion completes.
