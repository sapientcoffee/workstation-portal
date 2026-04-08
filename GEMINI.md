# Workstation Portal: Agent Guidance

## Repository Structure (Monorepo)
The codebase has been migrated to a Turborepo-powered monorepo:
- **Frontend:** `apps/web/` (React/Vite). Configuration in `apps/web/vite.config.js`.
- **Backend:** `apps/workstations-api/` (Express). Source in `apps/workstations-api/src/`.
- **Shared Scripts:** `scripts/` in the root.

## Core Mandates
- **Safety: NO DESTRUCTIVE ACTIONS.** During testing and automated walkthroughs, you MUST NOT perform any destructive actions. Specifically, you are **strictly forbidden** from clicking the "Delete" button or executing any workstation deletion.
- **Environment:**
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:3001` (proxied by Vite)
- **Environment Variables:** For local frontend development, use `apps/web/.env.local`.

## Foundational Testing Knowledge
For a significantly faster testing workflow and troubleshooting common networking/auth issues, **read the [Local Testing & Troubleshooting Guide](./docs/local-testing.md) first**.

### Key Quick-Links
- **Auth Bypass (UI Only):** Navigate to `?test_token=mock-token` for frontend layout testing. **Note:** Backend API calls will fail with `401 Unauthorized` as `mock-token` is not a valid GCP credential.
- **Identity-Linked Testing (Full E2E):** 
    1. Run `gcloud auth print-access-token` locally.
    2. Navigate to `http://localhost:5173/?test_token=<TOKEN>`.
    3. This provides full authenticated access to real GCP resources.
- **Troubleshooting:** See the [Troubleshooting & Speed-Up Tips](./docs/local-testing.md#troubleshooting--speed-up-tips) for handling proxy errors or clearing zombie processes.
- **Specs:** View the [Agentic Testing Specifications](./docs/agentic-testing.md) for automated E2E walkthrough steps.

## Development Commands (Root)
- `npm install`: Installs dependencies for all workspaces.
- `npm run dev`: Starts both frontend and backend using Turborepo.
- `npm run build`: Builds the frontend.
- `npm run test`: Runs backend vitest.
