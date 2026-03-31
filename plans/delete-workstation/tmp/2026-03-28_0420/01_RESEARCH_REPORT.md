---
date: 2026-03-28T04:35:00Z
researcher: Supervisor
git_commit: 46c3d1b4523b7da81356fe21a946767a165096af
branch: main
repository: workstation-portal
topic: "Delete Workstation Feature & Technical Mapping"
tags: [research, codebase, frontend, backend, workstations, gcp]
status: complete
last_updated: 2026-03-28
last_updated_by: Supervisor
---

# Research: Delete Workstation Feature & Technical Mapping

**Date**: 2026-03-28 04:35
**Researcher**: Supervisor
**Git Commit**: 46c3d1b4523b7da81356rowed-e2e-123
**Branch**: main
**Repository**: workstation-portal

## Research Question
Identify the current codebase patterns for workstation actions and determine the technical feasibility of the "Delete Workstation" feature with user-selected disk retention.

## Summary
The `workstation-portal` follows a clear pattern for workstation management. The frontend (`src/App.jsx`) initiates actions like `start` and `stop` via REST API calls to the backend (`server.js`). The backend uses the `@google-cloud/workstations` Node.js SDK to trigger these actions as Long-Running Operations (LROs). However, the current implementation lacks a "Delete" endpoint. Crucially, Google Cloud Workstations manage disk retention at the **Configuration** level (via `reclaimPolicy`), not as a parameter of the `deleteWorkstation` call.

## Detailed Findings

### Frontend Action Pattern (`src/App.jsx`)
-   **Workstation List**: Rendered in `App.jsx` using a map over the `workstations` state.
-   **Actions Trigger**: The `handleAction(workstationName, action)` function ([line 153](src/App.jsx#L153)) is the central dispatcher for 'start' and 'stop'.
-   **API Communication**: Uses `fetch` with a Bearer Token from Firebase Auth to POST to `${API_URL}/api/workstations/${action}`.
-   **UI Feedback**: Actions are optimistic and fire-and-forget. The UI triggers delayed `setTimeout` refreshes at 3s and 8s to poll for the final state ([lines 170-171](src/App.jsx#L170)).
-   **State Visibility**: The "Start" and "Stop" buttons are only enabled when the workstation is in a "terminal state" (RUNNING or STOPPED).

### Backend Implementation (`server.js`)
-   **Authenticated Client**: `getUserScopedClient(req)` ([line 33](server.js#L33)) creates a `WorkstationsClient` using the user's OAuth token.
-   **Endpoints**: `/api/workstations/start` and `/api/workstations/stop` are implemented. They both accept a `name` (full GCP resource path) and return the operation ID.
-   **Missing Logic**: There is no delete endpoint. No logic for snapshots or disk handling currently exists.

### GCP Workstations API/SDK Limitations
-   **Delete Request**: The `deleteWorkstation` method only takes the resource name. It **does not** accept a `deleteDisk` or `reclaimPolicy` override ([RPC Documentation](https://cloud.google.com/workstations/docs/reference/rpc/google.cloud.workstations.v1#google.cloud.workstations.v1.DeleteWorkstationRequest)).
-   **Disk Policy**: This is defined in the `WorkstationConfig`'s `reclaimPolicy` field (DELETE or RETAIN).
-   **Snapshots**: Snapshots are part of the `WorkstationConfig`'s `archiveTimeout` or can be manually triggered via the `Compute Engine` API (SnapshotsClient), but are not a native part of the `deleteWorkstation` operation itself.

## Architecture Documentation
-   **Frontend**: React (Vite) + Tailwind CSS + Firebase Auth.
-   **Backend**: Node.js + Express.
-   **GCP Integration**: Uses user-scoped credentials to perform actions, ensuring users can only delete workstations they have permissions for in GCP.

## Open Questions
-   If disk retention must be user-selectable, should we attempt to update the `WorkstationConfig`'s `reclaimPolicy` before deletion? (This might affect other workstations using the same config).
-   Should we use the `@google-cloud/compute` SDK to take manual snapshots before deletion?

## Recommendations for Design (Internal Note)
-   Inform the user about the existing `reclaimPolicy` of the workstation instead of offering a choice that the API doesn't support directly.
-   Or, if a choice is mandatory, investigate if updating the workstation resource itself (not the config) allows for an override (unlikely given the RPC specs).
