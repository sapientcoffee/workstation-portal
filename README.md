# Workstations Developer Portal

## Overview & Purpose

The **Workstations Developer Portal** is a centralized management interface designed to streamline the developer experience when working with Google Cloud Workstations. In large-scale enterprise environments, managing dozens of workstations across multiple regions and configurations can be cumbersome via the standard Google Cloud Console.

This portal provides:
- **Centralized Visibility**: See all workstations across all locations and configs in a single, unified view.
- **Improved Discoverability**: Instantly find resources assigned to your project without navigating complex console sub-menus.
- **Optimized Lifecycle Management**: Fast start/stop actions to help manage costs and resource availability.
- **Glassmorphism UI**: A premium, high-performance interface built for speed and aesthetics.

## Monorepo Architecture
This project is structured as a **Turborepo** monorepo:
- **`apps/web`**: React/Vite frontend.
- **`apps/workstations-api`**: Node.js/Express backend.
- **`packages/`**: Shared configurations and utilities (future).

## Getting Started

### Prerequisites
- Node.js (v18+)
- Active Google Cloud credentials configured (e.g., `gcloud auth application-default login`)
- Permissions to Access Google Cloud Workstations (`roles/workstations.user`)

### Setup and Installation

1. **Install Dependencies** (from the root)
   ```bash
   npm install
   ```

2. **Run the Development Environment**
   This command starts both the frontend (port 5173) and the backend (port 3001) concurrently using Turborepo.
   ```bash
   npm run dev
   ```

3. **Access the Portal**
   Open your browser to `http://localhost:5173`.

## Environment Configuration
- Frontend variables (`VITE_FIREBASE_...`) should be placed in `apps/web/.env.local`.
- Backend variables can be placed in `apps/workstations-api/.env`.

## Testing

For detailed information on automated testing, layout bypasses, and identity-linked testing, see the [Local Testing Guide](docs/local-testing.md).

### Quick Testing Commands:
- `npm run test`: Runs unit tests for the backend.
- `npm run lint`: Runs ESLint across all workspaces.

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

Copyright 2026 Google LLC
