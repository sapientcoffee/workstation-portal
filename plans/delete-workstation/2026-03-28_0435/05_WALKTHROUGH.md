# Walkthrough: Delete Workstation Feature

This document provides a comprehensive overview and verification evidence for the "Delete Workstation" feature implemented in the **Workstations Developer Portal**.

## 1. Feature Overview
The "Delete Workstation" feature allows developers to permanently remove Google Cloud Workstation resources directly from the portal UI. This enhances resource lifecycle management by providing a centralized way to clean up environments that are no longer needed.

### Key Components:
- **Backend API**: A new `POST /api/workstations/delete` endpoint in `server.js` that integrates with the `@google-cloud/workstations` Node.js SDK.
- **Frontend UI**: A "Delete" action button on workstation cards, a safety confirmation modal, and real-time deletion state handling in `src/App.jsx`.

---

## 2. Technical Implementation Summary

### Backend (`server.js`)
The backend now exposes a secure endpoint for deletion:
- **Endpoint**: `POST /api/workstations/delete`
- **Authentication**: Requires a valid Google OAuth2 bearer token in the `Authorization` header.
- **SDK Integration**: Uses `client.deleteWorkstation({ name })`.
- **LRO Handling**: The API waits for the Long-Running Operation (LRO) to complete before responding (`await operation.promise()`), ensuring the workstation is fully deleted before the frontend refreshes.

### Frontend (`src/App.jsx`)
- **State Management**: Uses `workstationToDelete` to manage the modal state and `isDeleting` to handle the asynchronous deletion process.
- **User Confirmation**: A modal backdrop and content area prevent accidental deletions by requiring a two-step process.
- **UI Interaction**: The "Delete" button is disabled if the workstation is in a transitional state (STARTING/STOPPING).

---

## 3. Verification Evidence

### Code Implementation (Grep Results)

#### Backend Endpoint Definition:
```javascript
/**
 * POST /api/workstations/delete
 * Deletes a specific Google Cloud Workstation.
 */
app.post('/api/workstations/delete', asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.startsWith('projects/')) return res.status(400).json({ error: 'Missing or invalid workstation name' });
    const client = await getUserScopedClient(req);
    const [operation] = await client.deleteWorkstation({ name });
    await operation.promise();
    res.json({ success: true });
}));
```

#### Frontend Delete Button & Modal:
```javascript
// Action Button in Card
<button 
  className="btn-danger" 
  onClick={() => confirmDelete(ws)}
  disabled={loadingState}
>
  <Trash2 size={16} /> Delete
</button>

// Confirmation Modal
{workstationToDelete && (
  <div className="modal-backdrop">
    <div className="modal-content">
      <h3>Delete Workstation</h3>
      <p>
        Are you sure you want to delete workstation {extractName(workstationToDelete.name)}? 
      </p>
      <div className="modal-actions">
        <button onClick={cancelDelete} disabled={isDeleting}>Cancel</button>
        <button 
          className="btn-danger" 
          onClick={executeDelete} 
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    </div>
  </div>
)}
```

### Live API Verification (cURL)
Hitting the endpoint locally (running on port 3001) confirms it is active and properly guarded:

```bash
# Verify the endpoint requires a token
curl -s -X POST http://localhost:3001/api/workstations/delete \
     -H "Content-Type: application/json" \
     -d '{"name": "projects/dummy/locations/-/workstationClusters/-/workstationConfigs/-/workstations/dummy"}'
```
**Response:**
`{"error":"Unauthorized: Missing bearer token"}`

---

## 4. End-to-End User Flow

1.  **Authentication**: User signs into the portal via Google/Firebase or provides a `test_token` in the URL for automated environments.
2.  **Discovery**: User enters their **Project ID** and clicks **Discover Workstations**.
3.  **Initiate Deletion**: User locates the target workstation card and clicks the **Delete** button.
4.  **Confirmation**: A modal appears asking for confirmation. The user clicks **Confirm Delete**.
5.  **Execution**: The button state changes to "Deleting...", and the frontend sends a POST request to the backend.
6.  **Completion**: Once the backend confirms deletion (following LRO completion), the modal closes and the workstation list is automatically refreshed.

---

## 5. Environment Cleanup
During this walkthrough, both the backend (`port 3001`) and frontend (`port 5173`) were started and verified. These processes have been gracefully stopped upon completion of this verification phase.
