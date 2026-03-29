# Technical Grounding: Enhance Workstation Details

## Goal
Enhance the workstation portal to show a detailed view (configuration and basic telemetry) when a workstation is clicked.

## External Documentation Summary

### Google Cloud Workstations API
- **Resource Hierarchy**: `projects/${PROJECT}/locations/${LOCATION}/workstationClusters/${CLUSTER}/workstationConfigs/${CONFIG}/workstations/${WORKSTATION}`
- **List Workstations**: `workstations.workstations.list` (already used in `server.js`).
- **Get Workstation**: `workstations.workstations.get` - returns a `Workstation` object.
- **Get Workstation Config**: `workstations.workstationConfigs.get` - returns a `WorkstationConfig` object, which contains:
  - `machineType` (e.g., `e2-standard-4`)
  - `container` (image, command, args, env, etc.)
  - `persistentDirectories` (disk size, mount path)
  - `idleTimeout` (e.g., `3600s`)
  - `runningTimeout`
  - `enableAuditLogs`

### Cloud Monitoring (Telemetry)
- **Monitored Resource**: `gce_instance`
- **Filtering**: Workstations report metrics under `gce_instance`. We can filter by `metadata.system_labels.workstation_id` or `metadata.system_labels.workstation_cluster_id`.
- **Relevant Metrics**:
  - `compute.googleapis.com/instance/cpu/utilization` (CPU)
  - `compute.googleapis.com/instance/memory/balloon/ram_used` (Memory)
  - `compute.googleapis.com/instance/disk/read_bytes_count` (Disk Read)
  - `compute.googleapis.com/instance/disk/write_bytes_count` (Disk Write)

## Hard Technical Constraints
- **Authentication**: The portal uses Firebase Auth / OAuth 2.0. The backend `server.js` must have permissions to fetch metrics and workstation configs.
- **API Scope**: `getUserScopedClient` in `server.js` relies on the user's token. The user must have IAM roles like `roles/monitoring.viewer` and `roles/workstations.viewer`.
- **GCP Pagination**: `listWorkstations` in `server.js` handles all workstations by wildcarding. Fetching config for each might require individual `get` calls or a `listConfigs` call and local mapping.

## Codebase Status
- **Backend**: `server.js` uses `express` and `@google-cloud/workstations`. It currently doesn't have an endpoint for workstation configuration or metrics.
- **Frontend**: `App.jsx` is a single-file React app. It uses `lucide-react` for icons. It uses a grid view for workstations.

## Next Steps
1.  Define the exact details to show in the "Detailed View".
2.  Design the UI for the detail view (e.g., a modal or a sidebar).
3.  Add backend endpoints for `getWorkstationConfig` and metrics fetching.
4.  Update the frontend to handle clicking a workstation and displaying the detail view.
