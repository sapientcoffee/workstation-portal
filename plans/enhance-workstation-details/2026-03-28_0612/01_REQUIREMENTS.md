# Requirements: Workstation Detailed View

## Objective
Enhance the Workstations Developer Portal to provide a comprehensive detailed view for each workstation, including its configuration, metadata, and historical telemetry data.

## User Stories
1.  **View Configuration**: As a developer, I want to see the machine type, container image, and timeouts of my workstation to understand its setup.
2.  **Monitor Performance**: As a developer, I want to see historical charts (last hour) for CPU and Memory utilization to identify performance trends.
3.  **Inspect Metadata**: As a developer, I want to see all labels, annotations, and creation/update timestamps in a dedicated panel.
4.  **Easy Navigation**: As a developer, I want to open this detail view by clicking on a workstation in the list and close it easily without losing my place in the list.

## Functional Requirements
1.  **Side Drawer/Panel**: Implement a side panel that slides in from the right when a workstation card is clicked.
2.  **Configuration Details**: Display:
    - Machine Type
    - Container Image
    - Idle Timeout
    - Running Timeout
    - Disk Size (if available)
3.  **Telemetry Data**: Display historical charts (last hour) for:
    - CPU Utilization
    - Memory Usage (balloon/ram_used)
4.  **Metadata Section**: Display labels and annotations in a clear, formatted section.
5.  **Timestamps**: Show Creation and Last Update times.
6.  **Backend Support**:
    - New API endpoint to fetch `WorkstationConfig` for a given workstation.
    - New API endpoint to fetch historical metrics from Cloud Monitoring for a specific workstation.

## Technical Constraints
- Must integrate with existing `server.js` (Node.js/Express) and `App.jsx` (React/Vite).
- Must handle authentication using the existing bearer token mechanism.
- Must respect user permissions for both Workstations API and Cloud Monitoring.

## Success Criteria
- Clicking a workstation card opens a side panel with full configuration and telemetry details.
- Telemetry shows at least the last hour of data in a graphical format (sparklines or simple charts).
- The portal remains responsive and performant.
