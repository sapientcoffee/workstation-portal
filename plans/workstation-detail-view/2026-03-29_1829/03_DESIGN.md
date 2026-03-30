# Architecture Review: Workstation Detail View

## 1. Executive Summary
This document outlines the architectural approach for introducing a "Detail View" to the Workstation Portal. The goal is to provide users with deep-dive information (configuration and telemetry) for a selected workstation without losing the context of their workstation list. We will implement a Drawer (Side Panel) UI pattern on the frontend, supported by a new aggregation endpoint on the Node.js/Express backend.

## 2. Backend Architecture (Express BFF)
To keep the React client thin and avoid multiple round-trips, the Express server (`server.js`) will act as a Backend-For-Frontend (BFF), aggregating data from multiple Google Cloud APIs.

*   **New Endpoint:** `GET /api/workstations/details`
    *   **Query Parameters:** `name` (The full GCP resource name of the workstation).
    *   **Integration 1: Workstations API:** Calls `getWorkstationConfig` using the parent path extracted from the workstation name to retrieve `machineType`, `persistentDirectories` (disk size), and `idleTimeout`.
    *   **Integration 2: Cloud Monitoring API:** Calls `@google-cloud/monitoring` to fetch the latest `cpu/usage_time` and `memory/usage` for the specific workstation resource.
    *   **Response Payload:** A consolidated JSON object containing both `config` and `telemetry` nodes.

## 3. Frontend Architecture (React)
The frontend will use a Side Panel (Drawer) pattern to display details, maintaining the master-detail relationship with the main workstation grid.

*   **State Management (`App.jsx`):**
    *   Introduce a new state variable: `const [selectedWorkstation, setSelectedWorkstation] = useState(null);`.
    *   Clicking a workstation card sets this state; clicking a backdrop or close button clears it (`null`).
*   **Component Structure:**
    *   Create a `WorkstationDetailPanel` component (rendered within `App.jsx`).
    *   **Props:** `workstation` (basic info passed from the list), `onClose` (handler to clear selection).
    *   **Internal State:** `details` (fetched data payload), `isLoading` (boolean), `error` (string).
    *   **Lifecycle:** A `useEffect` hook triggers a fetch to `/api/workstations/details?name=${workstation.name}` whenever the `workstation.name` prop changes.

## 4. UI/UX Design & Styling
*   **Layout:** The Side Panel will be fixed to the right side of the viewport (`position: fixed; right: 0;`), taking up a constrained width (e.g., 400px), with a smooth slide-in CSS transition. A semi-transparent overlay (`backdrop`) will cover the rest of the app to focus attention while allowing the underlying grid to remain partially visible.
*   **Visual Elements:**
    *   **Header:** Workstation display name, current state badge, and an 'X' close button.
    *   **Config Section:** A grid or vertical list using Lucide icons to denote fields (e.g., `Server` for machine type, `HardDrive` for disk size, `Clock` for timeouts).
    *   **Telemetry Section:** Simple visual indicators (like progress bars or stat cards) showing current CPU utilization and Memory usage percentages based on the fetched snapshot.
*   **Theming:** Strict adherence to existing CSS variables (e.g., `var(--bg-surface)`, `var(--text-primary)`, `var(--border-color)`) to ensure native integration with the application's dark/light modes.

## 5. Architectural Trade-offs & Decisions
*   **Side Panel vs. Modal:** We explicitly rejected a Modal for the detail view. A Side Panel preserves the context of the main list, supports a vertical reading rhythm ideal for key-value property lists, and allows rapid switching between items.
*   **Snapshot vs. Streaming Telemetry:** Given the constraints (historical charts out of scope), we are opting for a "point-in-time snapshot" of telemetry data fetched only when the panel opens. This drastically simplifies the architecture by avoiding WebSockets or aggressive polling, reducing both client-side resource usage and Google Cloud API costs. 
*   **BFF Aggregation:** Aggregating the Workstation Config and Monitoring Data on the backend reduces the number of API requests the client makes, centralizes GCP authentication, and abstracts Google Cloud-specific API complexity away from the React UI.