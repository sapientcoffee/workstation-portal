# Research Brief: DELETE Workstation Feature

## Missing Knowledge
1.  **Frontend Resource Listing:** How are workstation resources rendered in the UI? Is there a card-based layout or a table?
2.  **API Integration Pattern:** What is the standard way of making API calls to Google Cloud Workstations? Is there a shared service or hook?
3.  **Component Patterns:** Are there existing patterns for confirmation modals or loading states?
4.  **Action Handlers:** How are "Start", "Stop", and "Launch" actions implemented? I need to see the code that triggers these.
5.  **LRO Handling:** Is there already logic to poll or wait for Google Cloud Long-Running Operations?

## Target Files
- `src/App.jsx`
- `src/main.jsx`
- `server.js` (to see if actions are proxied or direct)
- Any files related to API services or hooks.
