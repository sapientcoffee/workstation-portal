# Research Report: Workstation Detail View

## 1. Google Cloud Workstations SDK Details

To retrieve detailed configuration, the `@google-cloud/workstations` Node.js client provides the `getWorkstationConfig` method.

### Key Fields in `WorkstationConfig` object:
*   **`name`**: Full resource name (e.g., `projects/.../locations/.../workstationClusters/.../workstationConfigs/...`).
*   **`displayName`**: Human-readable name.
*   **`idleTimeout`**: Duration (in seconds) of inactivity before the workstation automatically stops.
*   **`runningTimeout`**: Maximum duration a workstation can run before being automatically stopped.
*   **`host.gceInstance`**:
    *   **`machineType`**: The GCE machine type (e.g., `e2-standard-4`).
    *   **`serviceAccount`**: The identity used by the workstation.
    *   **`disablePublicIpAddress`**: Security setting.
    *   **`poolSize`**: Number of pre-warmed instances.
*   **`container`**:
    *   **`image`**: The container image (e.g., `us-central1-docker.pkg.dev/...`).
    *   **`env`**: Environment variables passed to the container.
*   **`persistentDirectories`**:
    *   **`mountPath`**: Where the disk is mounted (e.g., `/home`).
    *   **`gcePd.sizeGb`**: Size of the persistent disk.
    *   **`gcePd.reclaimPolicy`**: Whether to `DELETE` or `RETAIN` the disk on workstation deletion.

### Key Fields in `Workstation` object:
*   **`name`**: Full resource name.
*   **`state`**: Current status (`STATE_STARTING`, `STATE_RUNNING`, `STATE_STOPPING`, `STATE_STOPPED`).
*   **`host`**: The hostname or IP address (available when running).
*   **`createTime` / `startTime`**: Timestamps for lifecycle management.

## 2. Metrics & Monitoring

### Metrics Retrieval
The Google Cloud Workstations API **does not** provide real-time CPU or Memory metrics directly. These must be retrieved via the **Cloud Monitoring API** (`@google-cloud/monitoring`).

### Specific Metric Names (Resource Type: `workstation`)
*   **CPU Usage**: `workstations.googleapis.com/workstation/cpu/usage_time` (Cumulative). To get utilization, you calculate the rate over time.
*   **Memory Usage**: `workstations.googleapis.com/workstation/memory/usage` (Gauge).
*   **Network Traffic**: 
    *   `workstations.googleapis.com/workstation/network/received_bytes_count`
    *   `workstations.googleapis.com/workstation/network/sent_bytes_count`

## 3. Machine Types Reference

| Machine Type | vCPUs | RAM (GB) | Typical Use Case |
| :--- | :--- | :--- | :--- |
| `e2-standard-2` | 2 | 8 | Light web development, scripts |
| `e2-standard-4` | 4 | 16 | Standard development (VS Code, IntelliJ) |
| `e2-standard-8` | 8 | 32 | Heavy compilation, data processing |
| `n2-standard-4` | 4 | 16 | High-performance balanced workloads |

## 4. UI Patterns for Item Selection

### Existing Patterns in Project
The project currently uses a **Modal** pattern for workstation deletion (`workstationToDelete` state in `App.jsx`).

### Selection Strategy for Detailed View
*   **Recommended Pattern**: **Side Panel (Drawer)**.
*   **Rationale**:
    1.  **Context Preservation**: Users can see the details of a workstation while still seeing the rest of the list.
    2.  **Navigation**: Fast switching between different workstations in the grid without repeated opening/closing of modals.
    3.  **Space Efficiency**: A vertical side panel is well-suited for displaying a list of properties, configuration fields, and metrics graphs.
*   **Implementation**:
    *   Add `selectedWorkstation` state to `App.jsx`.
    *   Create a `WorkstationDetailPanel` component.
    *   Use CSS transitions to slide the panel in from the right.
