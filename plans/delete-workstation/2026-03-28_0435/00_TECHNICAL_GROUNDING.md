# Technical Grounding: Deleting Google Cloud Workstations

## Official Resource Documentation
- [Delete a Workstation (Google Cloud Console)](https://cloud.google.com/workstations/docs/delete-resources#delete_a_workstation)
- [gcloud workstations delete](https://cloud.google.com/sdk/gcloud/reference/workstations/delete)
- [REST API: delete](https://cloud.google.com/workstations/docs/reference/rest/v1/projects.locations.workstationClusters.workstationConfigs.workstations/delete)

## Technical Constraints & Considerations

### 1. Data Retention & Persistent Disks
- **Reclaim Policy:** The workstation configuration (Config) specifies a `reclaimPolicy` for persistent disks (Home directories).
  - If set to `DELETE`, the persistent disk is automatically deleted when the workstation is deleted. **DATA LOSS IS PERMANENT.**
  - If set to `RETAIN`, the persistent disk remains as a standalone resource after the workstation is deleted. This incurs storage costs until the disk itself is deleted.
- **Action Required:** Before deletion, the application should inform the user whether their data (persistent disk) will be deleted or retained based on the config.

### 2. Operational Flow
- **Asynchronous Operation:** The delete request returns a Long-Running Operation (LRO). The UI should ideally track this operation or at least handle the state transition (e.g., showing "Deleting..." then removing from the list).
- **Graceful Termination:** It is generally safer to stop a workstation before deleting, although the API might handle forceful termination. 

### 3. Permissions
- The user/service account must have the `workstations.workstations.delete` permission on the specific workstation resource.

### 4. Billing
- Deleting the workstation stops the hourly charges for the workstation runtime.
- If the persistent disk is retained, it continues to incur storage costs.

## Implementation Path
- **Step 1:** Fetch the workstation details to check the associated configuration.
- **Step 2:** (Optional but recommended) Fetch the configuration to determine the `reclaimPolicy`.
- **Step 3:** Show a confirmation dialog to the user, highlighting data loss risk.
- **Step 4:** Execute the `DELETE` request.
- **Step 5:** Handle the LRO or refresh the workstation list.
