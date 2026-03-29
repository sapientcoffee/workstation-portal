# Research Brief: Workstation Detailed View

## Questions for Research Swarm
1.  **Workstation List Component**: How is the workstation card structured in `src/App.jsx`? Is it a separate component or inline? Where exactly in the `map` function can I safely add a click handler?
2.  **API URL Configuration**: How is the backend URL managed in the frontend? Does it use `import.meta.env.VITE_API_URL` or something else?
3.  **Authentication Header**: Confirm the exact header and bearer token format used for API requests in the frontend.
4.  **Existing CSS Patterns**: Are there any existing drawer or modal styles in `src/index.css` that I should follow or avoid?
5.  **Recharts Integration**: Are there any other charting libraries already in `node_modules` that I should use instead of `recharts`?
6.  **Backend Auth for Monitoring**: In `server.js`, how does `getUserScopedClient` work? Does it handle the OAuth 2.0 flow for the user's token correctly for both Workstations and Monitoring APIs?
