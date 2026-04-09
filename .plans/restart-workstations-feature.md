# Implementation Plan: Restart Workstation Feature

## Objective
Implement a "Restart" functionality for workstations in the Google Cloud Workstations Developer Portal. This allows users to stop and then immediately start a running workstation in one action.

## Key Files & Context
- `apps/workstations-api/src/app.js`: Backend routes handling GCP API calls.
- `apps/workstations-api/tests/app.test.js`: Test suite for the backend API.
- `apps/web/src/App.jsx`: Main frontend component displaying the UI and actions.

## Implementation Steps

### 1. Backend: Add `/api/workstations/restart` Endpoint
Modify `apps/workstations-api/src/app.js` to add a new `POST` route for restarting.
Since there is no native "restart" method in the GCP SDK, this route will:
- Call `stopWorkstation` and await its completion via `.promise()` (consistent with the existing `deleteWorkstation` implementation).
- Call `startWorkstation` once the workstation has fully stopped.
- Return the operation name of the start action.

### 2. Backend Tests: Update Mock & Add Test Case
Modify `apps/workstations-api/tests/app.test.js` to:
- Update the mock for `stopWorkstation` to return an operation object that includes a `promise` function (so it can be awaited).
- Add a new `describe` block for `POST /api/workstations/restart` to ensure it completes successfully and handles errors like invalid names.

### 3. Frontend: Add Restart Button to UI
Modify `apps/web/src/App.jsx` to:
- Include a "Restart" button in the `<div className="card-actions">` section alongside the "Stop" button.
- The button will display the `RefreshCw` icon from `lucide-react` (already imported).
- The button will trigger `handleAction(ws.name, 'restart')` when clicked.
- It will only be visible and enabled when the workstation is running (`!isStopped`).
- Update the JSDoc on `handleAction` to denote the `restart` action as valid.

## Verification & Testing
- Start the server `npm run dev` and mock out auth via test tokens.
- Ensure the "Restart" button displays correctly for running workstations.
- Click "Restart", verify that the app shows a loading state.
- Validate that the UI refreshes and the workstation status successfully transitions from stopping to starting.
- Run `npm run test` to verify backend vitest test coverage is maintained and passes.