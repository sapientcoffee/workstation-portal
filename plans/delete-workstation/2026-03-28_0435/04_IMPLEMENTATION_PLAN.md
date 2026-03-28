# Implementation Plan: Delete Workstation Feature

## 📁 1. Skeletal Structure
No new files need to be created. We will be modifying existing files:
- `src/index.css`: To add modal and danger button styles.
- `server.js`: To add the delete endpoint.
- `src/App.jsx`: To add state, handlers, the delete button, and the confirmation modal.

## 📋 2. Micro-Step Checklist
- [x] Task 1: Update `src/index.css` with modal styles.
- [x] Task 2: Add `POST /api/workstations/delete` to `server.js`.
- [x] Task 3: Implement `handleDelete` and `workstationToDelete` state in `src/App.jsx`.
- [x] Task 4: Add the "Delete" button to the workstation card in `src/App.jsx`.
- [x] Task 5: Implement the Confirmation Modal in `src/App.jsx`.

## 📝 3. Step-by-Step Implementation Details

### Task 1: Update `src/index.css` with modal styles
*   *Target File:* `src/index.css`
*   *Instructions:* Add CSS classes for `.modal-backdrop`, `.modal-content`, and `.btn-danger`. Ensure the modal backdrop covers the entire screen, has a semi-transparent background, and centers the modal content. The `.btn-danger` should have a red background (e.g., `#dc3545`) for destructive actions and white text.

### Task 2: Add `POST /api/workstations/delete` to `server.js`
*   *Target File:* `server.js`
*   *Instructions:* 
    1. Add a new POST route: `app.post('/api/workstations/delete', asyncHandler(async (req, res) => { ... }))`.
    2. Extract `name` from `req.body`.
    3. Use the authenticated `client` to call `client.deleteWorkstation({ name })`.
    4. Await the Long-Running Operation (LRO) using: 
       `const [operation] = await client.deleteWorkstation({ name });`
       `await operation.promise();`
    5. Return a `200 OK` JSON response upon successful completion (e.g., `res.json({ success: true })`).

### Task 3: Implement `handleDelete` and `workstationToDelete` state in `src/App.jsx`
*   *Target File:* `src/App.jsx`
*   *Instructions:*
    1. Add state variables: `const [workstationToDelete, setWorkstationToDelete] = useState(null);` and `const [isDeleting, setIsDeleting] = useState(false);`.
    2. Create `confirmDelete(workstation)` to set `workstationToDelete` to the passed workstation.
    3. Create `cancelDelete()` to set `workstationToDelete` to `null`.
    4. Create `executeDelete()` which:
       - Sets `isDeleting(true)`.
       - Makes a `POST` request to `/api/workstations/delete` with `JSON.stringify({ name: workstationToDelete.name })`.
       - Awaits the response.
       - If successful: calls `fetchWorkstations()`, clears `workstationToDelete` (closes modal), and sets `isDeleting(false)`.
       - If error: catches it, sets global `error` state (using existing `setError`), closes modal, and sets `isDeleting(false)`.

### Task 4: Add the "Delete" button to the workstation card in `src/App.jsx`
*   *Target File:* `src/App.jsx`
*   *Instructions:* Locate the workstation card rendering logic (specifically the actions section). Add a `<button>` with the text "Delete" or a Trash icon. Add the `.btn-danger` class to it. Attach an `onClick` handler: `onClick={() => confirmDelete(workstation)}`.

### Task 5: Implement the Confirmation Modal in `src/App.jsx`
*   *Target File:* `src/App.jsx`
*   *Instructions:* Add JSX at the end of the main return statement to conditionally render the modal if `workstationToDelete` is truthy. Include:
    - A backdrop `<div className="modal-backdrop">`.
    - Content `<div className="modal-content">`.
    - A clear warning title (e.g., "Delete Workstation").
    - Warning text referencing the specific workstation: `Are you sure you want to delete workstation {workstationToDelete.name}? Depending on the cluster configuration, the associated persistent disk and all data may be permanently deleted.`
    - A "Cancel" button calling `cancelDelete()`.
    - A "Confirm Delete" button calling `executeDelete()`. This button must display "Deleting..." and be disabled when `isDeleting` is true.

## 🧪 4. Verification Steps
After implementing the above tasks, the Engineer must verify the following harness:

*   **Testing the modal pops up:** Click the "Delete" button on a workstation card. Verify that the confirmation modal overlay appears and displays the correct workstation name.
*   **Testing the delete request triggers:** Click "Confirm Delete" in the modal. Check the Network tab in browser developer tools to ensure a `POST /api/workstations/delete` request is fired with the correct JSON payload.
*   **Testing the loading state while waiting for the LRO:** Observe the "Confirm Delete" button immediately after clicking it. It should change its text to "Deleting..." and become disabled, preventing duplicate submissions while the backend awaits the GCP LRO.
*   **Testing the list refreshes after deletion:** Wait for the backend request to complete (return 200). Verify that the modal closes automatically and the deleted workstation is no longer present in the refreshed UI list.