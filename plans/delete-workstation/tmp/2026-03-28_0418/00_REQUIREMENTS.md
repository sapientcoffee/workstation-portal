# Requirements: Delete Workstation Feature

## Objective
Provide users with the ability to delete their Google Cloud Workstations directly from the `workstation-portal` interface. 

## User Stories
* As a developer, I want to be able to click a "Delete" button on one of my workstations so I can remove environments I no longer need.
* As a user deleting a workstation, I want to be prompted to confirm the deletion to prevent accidental destructive actions.
* As a user deleting a workstation, I want to choose whether the attached persistent disk (home directory) is deleted alongside the workstation, or if it is retained for future recovery.

## Technical Constraints & Specifications
1. **Confirmation UX (Native Alerts):**
   * Since the requested confirmation UX is a Native Alert, the flow should use the browser's native dialogs. 
   * Flow:
     1. User clicks "Delete" on a workstation.
     2. A native `confirm("Are you sure you want to delete this workstation?")` dialog appears.
     3. If accepted, a second `confirm("Do you also want to delete the persistent disk (home directory) attached to this workstation?")` dialog appears to capture the disk handling preference.
2. **Disk Handling:** 
   * The decision on whether to delete the disk must be captured and sent to the backend.
3. **Backend Integration:**
   * The feature will utilize an existing backend endpoint or mechanism (e.g., an existing Firebase callable function or API route). The frontend will pass the workstation identifier and the `deleteDisk` boolean flag to this endpoint.
4. **State Management:**
   * The UI should reflect the "Deleting" state gracefully (e.g., indicating the workstation is currently being torn down, as this is a long-running operation in GCP).

## Out of Scope
* Creating new backend server logic from scratch (an existing endpoint handles the actual cloud execution).
* Building custom React modals for the deletion confirmation (native alerts preferred for simplicity).
