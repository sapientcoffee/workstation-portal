# Research Report: Workstation Detailed View

## Factual Map

### Workstation Configuration Retrieval
- **API Call**: `workstationsClient.getWorkstationConfig({ name: configName })`.
- **Config Name Extraction**: The full resource name of a workstation is `projects/{p}/locations/{l}/workstationClusters/{c}/workstationConfigs/{cfg}/workstations/{w}`. The config name is the path up to `.../workstationConfigs/{cfg}`.
- **Key Fields to Display**:
  - `machineType` (e.g., `e2-standard-4`)
  - `container.image` (e.g., `us-central1-docker.pkg.dev/cloud-workstations-images/predefined/code-oss:latest`)
  - `idleTimeout` (e.g., `3600s`)
  - `runningTimeout` (e.g., `43200s`)
  - `persistentDirectories[0].mountPath` and `diskSizeGb` (e.g., `/home`, `100`)

### Telemetry (Cloud Monitoring)
- **Library**: `@google-cloud/monitoring`.
- **Filter**: `metric.type = "compute.googleapis.com/instance/cpu/utilization" AND metadata.system_labels.workstation_id = "{WORKSTATION_ID}"`.
- **Alternative Filter**: `metric.type = "compute.googleapis.com/instance/cpu/utilization" AND resource.labels.instance_id = "{INSTANCE_ID}"`. Since we have the `host` in the Workstation object, we might be able to map it, but `workstation_id` label in system metadata is safer.
- **Metrics to Fetch**:
  - `compute.googleapis.com/instance/cpu/utilization`
  - `compute.googleapis.com/instance/memory/balloon/ram_used` (Note: This requires the guest agent to be running, which is true for Workstations).
- **Time Range**: `startTime: now - 1 hour`, `endTime: now`.
- **Alignment**: `alignmentPeriod: 60s`, `perSeriesAligner: ALIGN_MEAN`.

### UI Implementation
- **Side Panel**: A fixed position div with `right: 0`, `height: 100vh`, and a `transition` for sliding.
- **Charts**: Use `recharts` for React. It's lightweight and easy to use.
- **Icons**: Use existing `lucide-react`.

### Authentication & Permissions
- The `getUserScopedClient` already handles token propagation.
- User needs:
  - `workstations.workstationConfigs.get`
  - `monitoring.timeSeries.list`

## Synthesized Patterns
- **Backend**: Add a new route `GET /api/workstations/details` that takes `workstationName` and returns both the `WorkstationConfig` and the last hour of telemetry.
- **Frontend**: 
  - Add `selectedWorkstation` state.
  - On card click, set `selectedWorkstation` and fetch details.
  - Display side panel if `selectedWorkstation` is set.
