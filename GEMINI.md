# Workstation Portal: Agent Guidance

## Core Mandates
- **Safety: NO DESTRUCTIVE ACTIONS.** During testing and automated walkthroughs, you MUST NOT perform any destructive actions. Specifically, you are **strictly forbidden** from clicking the "Delete" button or executing any workstation deletion.
- **Testing Before Implementation:** Before making UI or backend changes, refer to the local testing documentation.
- **Environment:**
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:3001` (proxied by Vite)

## Foundational Testing Knowledge
For a significantly faster testing workflow and troubleshooting common networking/auth issues, **read the [Local Testing & Troubleshooting Guide](./docs/local-testing.md) first**.

### Key Quick-Links
- **Auth Bypass:** Navigate to `?test_token=mock-token` for layout testing.
- **Identity-Linked Testing:** Use `gcloud auth print-access-token` for real-account testing ([details](./docs/local-testing.md#👤-identity-linked-testing-real-account)).
- **Troubleshooting:** See the [Troubleshooting & Speed-Up Tips](./docs/local-testing.md#troubleshooting--speed-up-tips) for handling proxy errors or clearing zombie processes.
- **Specs:** View the [Agentic Testing Specifications](./docs/agentic-testing.md) for automated E2E walkthrough steps.
