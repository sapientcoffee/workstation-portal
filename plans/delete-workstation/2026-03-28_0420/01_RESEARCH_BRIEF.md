# Research Brief - Delete Workstation Feature

## Missing Technical Knowledge
I need to understand the current architecture of the workstation portal to correctly integrate the deletion feature.

## Factual Questions
1.  **Frontend Action Pattern**: Locate the component responsible for rendering individual workstations and their action buttons (Start, Stop, Launch). How are these actions triggered?
2.  **Backend API**: Search the backend codebase (`server.js` or similar) for any existing "delete" or "remove" endpoints related to workstations. If found, what parameters does it accept?
3.  **Authentication and Roles**: How does the frontend determine if the current user is an "Admin" or the "Owner" of a workstation? Is there a shared context or specific property in the workstation object?
4.  **GCP Workstations SDK/API**: In the backend, how are calls to the Google Cloud Workstations API made? Is it using the Node.js library (`@google-cloud/workstations`)? If so, what is the method signature for deletion, specifically concerning disk preservation?
5.  **State Management/Polling**: Once an action is triggered, how does the UI update to reflect the new state (e.g., from "RUNNING" to "STOPPING")? Is there a polling mechanism or a real-time database listener?
6.  **Snapshots**: Are there any existing implementations of disk snapshots in the project? If not, check if the GCP Workstations Node.js SDK supports taking a snapshot during deletion.
