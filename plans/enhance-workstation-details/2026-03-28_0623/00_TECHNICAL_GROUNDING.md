# Technical Grounding: Enhance Workstation Details

## Goal
Enhance the workstation portal to show a detailed view (configuration and basic telemetry) when a workstation is clicked.

## External Documentation Summary

### Google Cloud Workstations API
- **Resource Hierarchy**: `projects/${PROJECT}/locations/${LOCATION}/workstationClusters/${CLUSTER}/workstationConfigs/${CONFIG}/workstations/${WORKSTATION}`
- **Get Workstation**: `workstations.workstations.get` - returns a `Workstation` object.
- **Get Workstation Config**: `workstations.workstationConfigs.get` - returns a `WorkstationConfig` object.
- **Key Details to Extract**:
  - `machineType` (e.g., `e2-standard-4`)
  - `container` image and environment variables.
  - `idleTimeout` and `runningTimeout`.
  - `persistentDirectories` (disk size).

### Cloud Monitoring (Telemetry)
- **Monitored Resource**: `gce_instance`
- **Filtering**: Cloud Workstations automatically labels VMs with:
  - `workstation_id`
  - `workstation_cluster_id`
  - `workstation_config_id`
  - `workstation_location`
- **Recommended Metrics**:
  - `compute.googleapis.com/instance/cpu/utilization` (CPU usage)
  - `compute.googleapis.com/instance/memory/balloon/ram_used` (Memory used)
- **Time Range**: User wants "basic telemetry", a 1-hour historical view is standard for real-time portals.

## Hard Technical Constraints
- **Authentication**: Backend `server.js` uses `getUserScopedClient`, meaning the user's own credentials are used for API calls. The user must have IAM permissions to see both Workstations and Monitoring data.
- **Backend Libraries**: Need `@google-cloud/monitoring` for metrics.
- **Frontend Libraries**: Need `recharts` for visualization.

## Codebase Status
- **Backend**: `server.js` already has a `WorkstationsClient` and handles auth for workstations. It lacks Monitoring integration and a specific details endpoint.
- **Frontend**: `src/App.jsx` is a single-file React app. It uses `lucide-react` for icons and has a grid layout for workstations. No drawer or detailed state yet.
