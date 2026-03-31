# Implementation Plan: Delete Workstation

## 📋 Micro-Step Checklist
- [ ] Phase 1: Backend API Implementation
  - [ ] Step 1.A: Define the test harness for `POST /api/workstations/delete`
  - [ ] Step 1.B: Add `/api/workstations/delete` to `server.js` with basic deletion
  - [ ] Step 1.C: Integrate `WorkstationConfig` fetching and `reclaimPolicy` logic
- [ ] Phase 2: Frontend State & Logic
  - [ ] Step 2.A: Define test harness for UI rendering (e.g. dummy workstation data)
  - [ ] Step 2.B: Implement `isOwner` logic and `deleteModal` state in `src/App.jsx`
  - [ ] Step 2.C: Create the `handleDelete` function to call the backend endpoint
- [ ] Phase 3: UI Integration
  - [ ] Step 3.A: Add the Delete button to the workstation card actions
  - [ ] Step 3.B: Build and style the Confirmation Modal component
  - [ ] Step 3.C: Handle backend warnings (e.g. disk RETAIN message) in the UI

## 📝 Step-by-Step Implementation Details

### Phase 1: Backend API Implementation
#### Step 1.A (The Verification Harness):
*   *Target File:* `scripts/test-api.sh` (or create a specific curl test block)
*   *Verification:* Write a curl command targeting `POST http://localhost:3001/api/workstations/delete` with `{"name": "test", "deleteDisk": true}`. It should fail gracefully if "test" is invalid.

#### Step 1.B (The Core Change - Basic Deletion):
*   *Target File:* `server.js`
*   *Instructions:* Add `app.post('/api/workstations/delete', asyncHandler(async (req, res) => { ... }))`. Use `client.deleteWorkstation({ name })`. Return `{ message: 'Deleted', operation: op.name }`.
*   *Verification:* Start the server (`node server.js`) and test the route with the curl command from 1.A.

#### Step 1.C (The Core Change - Disk Policy Logic):
*   *Target File:* `server.js`
*   *Instructions:* Before calling `deleteWorkstation`, if `req.body.deleteDisk` is true, extract the `configName` from the workstation name string. Use `client.getWorkstationConfig({ name: configName })`. If `config.reclaimPolicy === 'RETAIN'`, set a `warning` string to return alongside the success message.
*   *Verification:* Ensure the server does not crash when parsing the name or calling `getWorkstationConfig`.

### Phase 2: Frontend State & Logic
#### Step 2.A (The Verification Harness):
*   *Target File:* `src/App.jsx`
*   *Verification:* Hardcode a `user` and `ws.annotations` to verify the ownership check works visually before wiring up the real data.

#### Step 2.B (State Hooks & Ownership):
*   *Target File:* `src/App.jsx`
*   *Instructions:* Import `Trash2` from `lucide-react`. Add `[deleteModal, setDeleteModal]` and `[deleteDisk, setDeleteDisk]`. Create a helper `const isOwner = (ws) => ws.annotations?.['workstations.googleapis.com/creator'] === user?.email || ws.labels?.owner === user?.email.split('@')[0];`.
*   *Verification:* Run the Vite dev server (`npm run dev`) and ensure no syntax errors.

#### Step 2.C (The `handleDelete` API caller):
*   *Target File:* `src/App.jsx`
*   *Instructions:* Implement `handleDelete = async () => { ... }` that reads `deleteModal.name` and `deleteDisk`. It should POST to `/api/workstations/delete`, handle errors, show any returned `warning` via `setError` or a toast, close the modal, and refresh the workstation list.

### Phase 3: UI Integration
#### Step 3.A (The Delete Button):
*   *Target File:* `src/App.jsx`
*   *Instructions:* In the `.card-actions` div, conditionally render the Delete button if `isOwner(ws)`. Clicking it calls `setDeleteModal(ws)`.
*   *Verification:* Verify the button appears only for the owned workstations.

#### Step 3.B (The Confirmation Modal):
*   *Target File:* `src/App.jsx` & `src/index.css`
*   *Instructions:* At the bottom of `App.jsx`, render the modal if `deleteModal` is truthy. Include a checkbox bound to `deleteDisk` and a warning paragraph. Style `.modal-overlay` and `.modal-content` in `index.css` to be centered with a semi-transparent background.
*   *Verification:* Click delete, verify the modal pops up, the checkbox toggles, and closing it dismisses the modal.

#### Step 3.C (Final Review):
*   *Target:* Entire flow
*   *Instructions:* Test deleting a workstation. Verify loading states are handled (the list refetches and eventually the workstation disappears). Verify the "RETAIN" warning appears if applicable.
*   *Verification:* Execute the full end-to-end flow manually in the UI.