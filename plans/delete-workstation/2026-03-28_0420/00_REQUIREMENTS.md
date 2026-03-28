# Requirements: Delete Workstation Feature (Finalized)

## Objective
Provide users with the ability to delete their Google Cloud Workstations directly from the `workstation-portal` interface. 

## User Stories
* As a workstation **owner** or **Admin**, I want to be able to delete a workstation I no longer need so I can manage my resources and save on costs.
* As a user deleting a workstation, I want to be prompted to confirm the deletion using a native browser `confirm()` dialog to prevent accidental destructive actions.
* As a user deleting a workstation, I want to be informed if the workstation's disk is configured to be deleted or kept upon removal (based on its existing `reclaimPolicy`).
* As a user, I want to see clear visual feedback (e.g., "Deleting...") and have the UI track the specific operation progress until the workstation is successfully removed.

## Technical Constraints & Specifications
1. **Confirmation UX (Native Alerts):**
   * The flow should use the browser's native `confirm()` dialog.
   * Flow:
     1. User clicks "Delete" on a workstation card.
     2. A native `confirm("Are you sure you want to delete this workstation? [Current Disk Policy: DELETE/RETAIN]")` dialog appears.
     3. The message will clearly state whether the persistent home directory will be deleted or kept based on the workstation's `reclaimPolicy`.
2. **Backend Integration:**
   * **New Endpoint**: `DELETE /api/workstations` in `server.js`.
   * **SDK Call**: Use the user-scoped `WorkstationsClient` to invoke `deleteWorkstation({ name })`.
   * **Return Value**: The backend must return the long-running operation (LRO) name to the frontend.
3. **State Management & Polling:**
   * **Operation Tracking**: The frontend will capture the `operation.name` from the delete response.
   * **Robust Polling**: Instead of fixed-delay polling, the frontend should periodically check the status of the specific deletion operation or re-fetch the list until the workstation is no longer present.
   * **Blocking UI**: The "Delete" button should be disabled for workstations in a "DELETING" or "UNKNOWN" state.
4. **Access Control:**
   * Only workstation **owners** or users with **Admin** roles should see the "Delete" option in the UI.

## Out of Scope
* Implementing disk snapshots before deletion.
* Implementing pre-emptive updates to the `reclaimPolicy` via the portal.
* Building custom React modals for the deletion confirmation.
