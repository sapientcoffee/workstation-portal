# Structural Plan: Delete Workstation Feature

## 1. Overview
This structural plan details the exact files to be modified and the functions/boundaries that need to be created or changed to implement the "Delete Workstation" feature.

## 2. Modified Files & Skeletons

### `server.js`
This file acts as the backend API. We will add two endpoints.

**Additions:**
```javascript
/**
 * GET /api/workstations/config
 * Retrieves a specific Google Cloud Workstation Config.
 * @name GetWorkstationConfig
 * @route {GET} /api/workstations/config
 * @queryparam {string} name - The full resource name of the workstation config.
 */
app.get('/api/workstations/config', asyncHandler(async (req, res) => {
    // 1. Validate 'name' query param
    // 2. Fetch config via client.getWorkstationConfig({ name })
    // 3. Return JSON response
}));

/**
 * DELETE /api/workstations
 * Deletes a specific Google Cloud Workstation.
 * @name DeleteWorkstation
 * @route {DELETE} /api/workstations
 * @bodyparam {string} name - The full resource name of the workstation to delete.
 */
app.delete('/api/workstations', asyncHandler(async (req, res) => {
    // 1. Validate 'name' body param
    // 2. Call client.deleteWorkstation({ name })
    // 3. Return JSON response with operation name
}));
```

### `src/App.jsx`
This file contains the frontend React application. We need to introduce new state and the deletion workflow.

**Additions/Modifications:**
```javascript
// New State for tracking deletions
const [deletingWorkstations, setDeletingWorkstations] = useState(new Set());

// New Helper to check access
const isUserOwnerOrAdmin = (workstation, user) => {
    // 1. Admin check (VITE_ADMIN_EMAILS)
    // 2. Owner check (annotations/labels)
    return boolean;
};

// New Helper to fetch config policy
const fetchWorkstationPolicy = async (configName) => {
    // Fetch from /api/workstations/config
    // Extract and return reclaimPolicy (DELETE or RETAIN)
};

// New Action Handler for deletion
const handleDelete = async (workstation) => {
    // 1. Extract config name and fetch policy
    // 2. Trigger native confirm() dialog with policy
    // 3. If confirmed, call DELETE /api/workstations
    // 4. On success, add workstation.name to deletingWorkstations state
    // 5. Trigger polling loop
};

// Update Polling Loop
useEffect(() => {
    // If deletingWorkstations.size > 0, set an interval to call discoverWorkstations
    // If a tracked workstation is missing from the list, remove it from the set
}, [deletingWorkstations, workstations]);

// Update UI (Inside the workstation card render)
// 1. Conditional render of the Delete button using isUserOwnerOrAdmin
// 2. Disable card actions if workstation is in deletingWorkstations
// 3. Style the Delete button with a danger CSS class
```

### `src/index.css`
Update CSS to handle the destructive action UI properly.

**Additions:**
```css
/* Styling for the new Delete button */
button.danger {
    /* Red styling, distinct from secondary/primary */
}

/* Update workstation card to show a greyed out/disabled state during deletion if needed */
```

## 3. Interfaces and Signatures

*   **API Response for Config**:
    ```json
    {
      "name": "projects/...",
      "idleTimeout": "...",
      "persistentDirectories": [
        {
          "mountPath": "/home",
          "gcePd": {
            "sizeGb": 200,
            "fsType": "ext4",
            "diskType": "pd-standard",
            "reclaimPolicy": "DELETE" // or "RETAIN"
          }
        }
      ]
    }
    ```
*   **API Request for Delete**: `DELETE /api/workstations`
    ```json
    { "name": "projects/.../workstations/my-ws" }
    ```
*   **API Response for Delete**:
    ```json
    { "message": "Deleting", "operation": "projects/.../operations/..." }
    ```