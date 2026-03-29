# High-Level Design: Workstation Detailed View

## 1. Backend Changes
- **Dependencies:** Add `@google-cloud/monitoring` to `package.json` to enable querying Cloud Monitoring telemetry.
- **API Endpoint:** Implement a new `GET /api/workstations/details` endpoint in `server.js`.
  - **Input:** Accepts `workstationName` via query parameters.
  - **Logic:** 
    - Parse the `workstationName` to extract the parent `WorkstationConfig` resource name.
    - Fetch the `WorkstationConfig` using the Cloud Workstations API to retrieve configuration details (Machine Type, Image, Idle Timeout, Disk Size).
    - Fetch historical CPU (`compute.googleapis.com/instance/cpu/utilization`) and Memory (`compute.googleapis.com/instance/memory/balloon/ram_used` or similar) metrics for the last hour using the Cloud Monitoring API, filtered by the specific workstation.
  - **Output:** Returns a combined JSON object containing both the configuration metadata and the time-series metric data.

## 2. Frontend Changes
- **Dependencies:** Add `recharts` to `package.json` for rendering the metric charts.
- **State Management:** Introduce a `selectedWorkstation` state in `App.jsx` to track the currently focused workstation.
- **UI Components:**
  - Create a new `DetailPanel` component.
  - **Trigger:** Update the main workstation list cards to have an `onClick` handler that sets the `selectedWorkstation` state.
  - **Layout:** The `DetailPanel` will be implemented as a side drawer/panel anchored to the right side of the screen, utilizing smooth CSS transitions (`transform: translateX`) for sliding in and out.
  - **Content:** 
    - Display the configuration fields (Machine Type, Container Image, Timeouts, Persistent Storage) mapped from the backend response.
    - Render two line charts using `recharts` to display the historical CPU and Memory metrics over the last hour.

## 3. Data Flow
1. **User Action:** The user clicks on a Workstation card in the UI.
2. **Frontend Request:** `App.jsx` sets `selectedWorkstation`, slides open the `DetailPanel`, and immediately fires a `GET /api/workstations/details?workstationName=<name>` request.
3. **Backend Processing:** 
   - `server.js` receives the request and validates the user's session token.
   - It performs two parallel (or sequential) requests to GCP APIs:
     - Calls the **Cloud Workstations API** (`workstationsClient.getWorkstationConfig`) to get hardware and image specs.
     - Calls the **Cloud Monitoring API** (`monitoringClient.listTimeSeries`) to get the past 60 minutes of CPU and Memory telemetry aligned at 1-minute intervals.
4. **Response:** The backend aggregates this data into a structured JSON payload and sends it back to the client.
5. **Frontend Render:** The `DetailPanel` updates its local state with the received payload, populating the configuration metadata and rendering the `recharts` line graphs.

## 4. Error Handling
- **API Errors:** 
  - If the backend fails to fetch the Workstation Config (e.g., permission denied, not found), it will return a `404` or `403` status code. The frontend `DetailPanel` must catch this and display an appropriate error banner (e.g., "Failed to load workstation details. Check permissions.").
  - If Cloud Monitoring fails (e.g., API not enabled), the backend should gracefully handle this by returning the configuration data but omitting the metrics, and logging a warning.
- **Missing Data:**
  - If a workstation has just been created or has been stopped for a long time, the Cloud Monitoring API may return an empty array for telemetry.
  - The frontend must handle empty metric arrays gracefully, rendering a "No recent telemetry available" placeholder instead of a broken or empty chart.
  - If specific configuration fields (e.g., `persistentDirectories`) are missing, the UI should display "N/A" or "None" to prevent undefined property errors.