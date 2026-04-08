# Architecture Design: Delete Workstation Feature

## 1. Overview
This document outlines the architectural approach to implement the "Delete Workstation" feature, adhering to the required safety checks, visual feedback mechanisms, and technical constraints discovered in the research phase.

## 2. Backend Integration
To facilitate the deletion and disk policy inspection, two new endpoints will be added to `server.js`:

*   **`DELETE /api/workstations`**
    *   **Controller Logic**: Extract the `name` (full GCP resource path) from the request body.
    *   **SDK Usage**: Invoke `client.deleteWorkstation({ name })`.
    *   **Response**: Return the resulting Long-Running Operation (LRO) name to the frontend (`{ message: 'Deleting', operation: operation.name }`).

*   **`GET /api/workstations/config`**
    *   **Purpose**: Required to satisfy the constraint of informing the user about their disk's `reclaimPolicy` prior to deletion.
    *   **Controller Logic**: Extract `name` (the config's resource path) from the query string.
    *   **SDK Usage**: Invoke `client.getWorkstationConfig({ name })`.
    *   **Response**: Return the config object which contains `persistentDirectories[0].reclaimPolicy`.

## 3. Frontend Logic & State Management
The frontend (`src/App.jsx`) requires modification to seamlessly handle the deletion workflow:

*   **Action Pipeline**: Implement a specialized `handleDelete(workstation)` function.
*   **Disk Policy Resolution**: Before showing the confirmation, the frontend will derive the parent configuration path from the workstation's `name` and fetch its config from the new `GET /api/workstations/config` endpoint.
*   **Confirmation Dialog**: A native `window.confirm()` will display the contextual warning: 
    *   *"Are you sure you want to delete this workstation? [Current Disk Policy: {POLICY}]"*
    *   Graceful degradation: If the config fetch fails, the policy will display as *UNKNOWN*.
*   **Operation Tracking (Polling)**: 
    *   Maintain a new state variable: `deletingWorkstations` (an array/set of workstation resource names currently in the deletion LRO).
    *   When a workstation is added to this state, trigger a polling loop that calls `discoverWorkstations()` every 5 seconds.
    *   Once a tracked workstation is no longer present in the refreshed list, it has been successfully deleted; remove it from the tracking state.

## 4. UI/UX 
*   **Button Placement & Styling**: Add a "Delete" button in the `.card-actions` container. It should be styled with a destructive theme (e.g., a "danger" CSS class with red hues) to differentiate it from safe operations like Start/Stop.
*   **Loading State**: If a workstation is in the `deletingWorkstations` state, the entire card's action row should be disabled, and the button should read "Deleting...". 

## 5. Access Control (Owner/Admin Visibility)
To meet the requirement that only owners or Admins can see the Delete option:
*   **Owner Check**: Match `user.email` against standard ownership identifiers on the workstation resource (e.g., `workstation.annotations['workstations.googleapis.com/creator']` or `workstation.labels['owner']` depending on the exact labeling schema).
*   **Admin Check**: Check `user.email` against an environment variable (e.g., `VITE_ADMIN_EMAILS`) to grant administrative override.
*   Only render the "Delete" button if either condition is true.

## 6. Risks & Mitigation
*   **Polling Exhaustion**: LROs can take several minutes. To prevent API rate limiting, the polling mechanism must be strictly conditionally based on `deletingWorkstations.length > 0` and should use a sensible delay (e.g., 5000ms).
*   **Accidental Deletions**: The two-step process (fetching config -> native confirm) ensures deliberate action. By avoiding custom React modals, we adhere strictly to the out-of-scope constraints while fulfilling the UX requirements.
