# Requirements: Workstation Detailed View

## Objective
Enhance the Workstations Developer Portal to provide a detailed view when a workstation is clicked, showing its configuration and last hour's performance data.

## User Stories
1.  **View Detail**: As a developer, I want to click a workstation in the list to open a detailed side-panel.
2.  **Inspect Configuration**: I want to see technical details like machine type, container image, and timeout settings.
3.  **Performance Insights**: I want to see small, simple charts of CPU and Memory usage for the last hour to understand the resource utilization.
4.  **Metadata Visibility**: I want to see labels and timestamps to know when it was created and last updated.

## Functional Requirements
1.  **Drawer Panel**: A slide-out panel that opens from the right side of the screen when a workstation is clicked.
2.  **Detailed Configuration**:
    - Machine Type (e.g., e2-standard-4)
    - Image (e.g., us-central1-docker.pkg.dev/...)
    - Idle/Running Timeouts
    - Disk size (GB)
3.  **Telemetry Data**:
    - CPU Utilization % (last hour)
    - Memory Usage (last hour)
    - Charts must be generated using `recharts`.
4.  **Backend Integration**:
    - New API route `GET /api/workstations/details` in `server.js`.
    - Backend must fetch from `Workstations API` (to get the Config) and `Cloud Monitoring API` (for time-series data).
5.  **State Management**:
    - Clicking "Close" in the drawer should clear the detailed state.
    - Refreshing the main list should not lose the current detailed view if open.

## Non-Functional Requirements
- **Responsive**: Drawer should fit comfortably on screen.
- **Performant**: API should aggregate data quickly.

## Success Criteria
- Clicking a workstation card opens a side panel.
- Configuration and charts are displayed.
- The user can close the panel and return to the list.
