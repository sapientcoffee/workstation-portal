# Requirements - Delete Workstation Feature

## Objective
Provide a secure and user-friendly way for workstation owners to delete their Google Cloud Workstations directly from the portal.

## User Stories
- As a workstation **owner**, I want to be able to delete my workstation if I no longer need it to save on costs.
- As a workstation **owner**, I want to choose whether my persistent home directory (disk) is deleted or kept for future recreation.
- As a workstation **owner**, I want a simple confirmation dialog to prevent accidental deletions.

## Constraints
- **Permissions**: Only the workstation owner (based on the `owner` field in the database/API) should see the "Delete" option.
- **Safety**: A "Simple Confirmation" dialog must appear before any deletion call.
- **Disk Persistence**: The user MUST be given a choice (e.g., checkbox "Also delete persistent disk") during the confirmation step.
- **Backend API**: The backend should call the Google Cloud Workstations API to execute the deletion.
- **UI Consistency**: The "Delete" button should be styled consistently with existing workstation management actions (Start, Stop, Launch).

## Technical Decisions
- **Confirmation Mechanism**: Standard browser/React modal with a checkbox.
- **Disk Policy**: User choice (default to keeping it for safety).
- **Access Control**: Owner-only visibility.
