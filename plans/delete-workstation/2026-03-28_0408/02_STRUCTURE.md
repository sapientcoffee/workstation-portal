# Structural Skeleton: Delete Workstation

## Vertical Phases

### Phase 1: Backend Implementation (`server.js`)
*   **Goal:** Provide the secure API proxy to trigger `client.deleteWorkstation()`.
*   **Components:**
    *   Add `POST /api/workstations/delete` route.
    *   Integrate `client.getWorkstationConfig({ name: configName })` for `reclaimPolicy` lookup (if `deleteDisk` is requested).
    *   Ensure robust error mapping (e.g., if a user lacks IAM permissions).
*   **Key Interface:**
    ```typescript
    // POST /api/workstations/delete
    interface DeleteRequest {
      name: string;        // Full GCP resource name
      deleteDisk: boolean; // User choice from Modal
    }
    
    interface DeleteResponse {
      message: string;
      operation: string;   // LRO name
      warning?: string;    // If deleteDisk=true but reclaimPolicy=RETAIN
    }
    ```

### Phase 2: Frontend Logic & State (`src/App.jsx`)
*   **Goal:** Add UI elements and React state for the confirmation modal without cluttering the main component unnecessarily.
*   **Components:**
    *   State hooks: `[deleteModal, setDeleteModal]` (holding the workstation object or null).
    *   State hooks: `[deleteDisk, setDeleteDisk]` (boolean for the checkbox).
    *   Helper function: `isOwner(ws, user)` to compare email addresses.
    *   Action function: `handleDelete(workstationName, deleteDisk)`.

### Phase 3: UI Integration (`src/App.jsx` & `src/index.css`)
*   **Goal:** The view layer for the modal and button.
*   **Components:**
    *   **Delete Button:** A Lucide-react `Trash2` icon button, rendered conditionally if `isOwner(ws, user)` is true.
    *   **Modal Overlay:** A fixed-position CSS modal:
        *   Title: "Delete Workstation?"
        *   Text: "Are you sure you want to delete {id}?"
        *   Checkbox: "[ ] Also delete persistent disk"
        *   Warning Note: "If your organization..."
        *   Buttons: "Cancel", "Delete" (styled destructively).
*   **Key Interface:**
    ```jsx
    // Modal Skeleton
    {deleteModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Delete Workstation</h3>
          {/* ... warning & checkbox ... */}
        </div>
      </div>
    )}
    ```