# High-Level Design: DELETE Workstation Feature

## 1. Backend Changes
We will implement a new endpoint: `POST /api/workstations/delete`.

**Implementation Details:**
- **Route:** `router.post('/api/workstations/delete', asyncHandler(async (req, res) => { ... }))`
- **SDK Call:** Use the authenticated GCP client to call `client.deleteWorkstation({ name: req.body.name })`.
- **Execution Model (Blocking):** The Google Cloud SDK returns a Long-Running Operation (LRO) for the delete action. To fulfill the "Wait for Completion" requirement cleanly without introducing complex frontend polling state machines, the backend will **block and wait** for the LRO to complete using `await operation.promise()`. 
- **Response:** Once the promise resolves, the backend will return a `200 OK` response indicating successful deletion.

## 2. Frontend Changes

### State Management
We will introduce two new pieces of state in `src/App.jsx`:
- `workstationToDelete` (Object | null): Stores the workstation object currently selected for deletion. When non-null, the confirmation modal is rendered.
- `isDeleting` (Boolean): Tracks the active deletion request to show a loading state within the modal and disable interactions.

### Handlers
- **`confirmDelete(workstation)`**: Triggered by the "Delete" button on the card. Sets `workstationToDelete` to the selected workstation.
- **`cancelDelete()`**: Clears the `workstationToDelete` state, closing the modal.
- **`executeDelete()`**: The core function that:
  1. Sets `isDeleting` to true.
  2. Makes the `POST /api/workstations/delete` request with the workstation name.
  3. Awaits the response.
  4. On success, closes the modal, clears state, and calls `fetchWorkstations()` to refresh the list.
  5. On error, captures and displays the error.

### UI Components
- **Delete Button:** Add a "Delete" `<button>` (using a Trash icon from `lucide-react` or similar text) to the `.workstation-card` actions section. It will use a new `.btn-danger` CSS class.
- **Confirmation Modal:** Implement a modal overlay that appears when `workstationToDelete` is set.
  - **Structure:** Will use `.modal-backdrop` and `.modal-content` CSS classes.
  - **Content:** Display a warning message: "Are you sure you want to delete workstation [Name]? Depending on the cluster configuration, the associated persistent disk and all data may be permanently deleted."
  - **Controls:** "Cancel" and "Confirm Delete" buttons. The confirm button will show a spinner or "Deleting..." text while `isDeleting` is true.

## 3. Operation Tracking
The "Wait for Completion" requirement will be satisfied through a combination of the blocking backend call and frontend UI state:
1. **Frontend:** The modal's "Delete" button enters a loading state (`isDeleting = true`), providing immediate visual feedback that the process has started and preventing duplicate submissions.
2. **Backend:** The Node.js server awaits the Google Cloud LRO (`await operation.promise()`).
3. **Completion:** When the LRO finishes on GCP, the backend responds to the frontend. The frontend then drops the loading state, closes the modal, and refreshes the workstation list, ensuring the UI accurately reflects the current state of GCP.

## 4. Error Handling
- **Backend:** The endpoint will be wrapped in the existing `asyncHandler`. If the GCP API call fails (e.g., due to insufficient permissions) or the LRO fails, the error will be caught and passed to the Express error middleware, returning a structured JSON error response (e.g., `500 Internal Server Error`).
- **Frontend:** The `executeDelete` function will wrap the `fetch` call in a `try/catch` block. If the response is not `ok`, it will extract the error message from the response body. This error message will be set using the existing global `setError` state, displaying an error banner at the top of the application to inform the user of the failure. The modal will be closed or remain open with the error displayed, depending on the exact UX flow (prefer closing and showing global error for consistency with existing app behavior).
