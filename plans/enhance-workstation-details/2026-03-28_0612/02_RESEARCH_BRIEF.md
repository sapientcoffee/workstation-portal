# Research Brief: Workstation Details Implementation

## missing-codebase-knowledge
1.  **Workstation-to-Config mapping**: The `Workstation` object's `name` includes the location, cluster, and config. What is the most efficient way to fetch the `WorkstationConfig` for a specific workstation in `server.js` using its full name?
2.  **Cloud Monitoring Filter**: For a workstation with a given `host` (which looks like `80-<IP_PORT>.workstation.cloud.google.com`), how do we filter `compute.googleapis.com` metrics to target ONLY that specific instance? What's the exact `monitoring.timeSeries.list` filter string?
3.  **Authentication**: Since `server.js` uses `getUserScopedClient`, does the user need specific extra permissions beyond `roles/workstations.viewer` to fetch metrics?
4.  **UI Performance**: In `App.jsx`, what is the best approach for implementing a side drawer/panel given the current structure?

## questions
1.  Can we list all workstation configs for a project at once and cache them on the frontend to avoid individual `get` calls?
2.  What is the recommended period and alignment for the last hour of telemetry data for workstations?
3.  How can we render simple sparklines or charts for telemetry without adding too much weight to the single-file React app?
