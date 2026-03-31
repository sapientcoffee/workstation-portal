# Monorepo Migration Plan

## Objective
Restructure the `workstation-portal` codebase from a monolith into a Turborepo-powered monorepo with `apps/web` (React frontend) and `apps/workstations-api` (Express backend). This establishes an enterprise-grade foundation for future microservices and shared packages.

## Scope & Impact
- **Root Directory:** Cleaned up to only contain configuration, documentation, and the workspace definition.
- **Frontend (`apps/web`):** Encapsulates all UI code and Vite configurations.
- **Backend (`apps/workstations-api`):** Encapsulates the Express API, tests, and Google Cloud integrations.
- **Dependencies:** Isolated per application. The root will manage orchestration tools like `turbo` and `eslint`.

## Implementation Steps

### 1. Root Configuration Updates
- Update the root `package.json` to include `"workspaces": ["apps/*", "packages/*"]`.
- Remove all application-specific dependencies (React, Express, Google Auth, Vite plugins, etc.) from the root.
- Add `"turbo": "latest"` as a root `devDependency`.
- Create a `turbo.json` file in the root directory configuring pipelines for `build`, `dev`, `lint`, and `test`.

### 2. Scaffold Frontend Workspace (`apps/web`)
- Create `apps/web/`.
- Move the following from root to `apps/web/`:
  - `src/` directory
  - `public/` directory
  - `index.html`
  - `vite.config.js`
- Move `client.Dockerfile` to `apps/web/Dockerfile`.
- Create `apps/web/package.json`:
  - Name: `"web"`
  - Scripts: `dev`, `build`, `preview`, `lint`
  - Dependencies: `firebase`, `lucide-react`, `react`, `react-dom`
  - devDependencies: `@vitejs/plugin-react`, `vite`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@types/react`, `@types/react-dom`

### 3. Scaffold Backend Workspace (`apps/workstations-api`)
- Create `apps/workstations-api/src/` and `apps/workstations-api/tests/`.
- Move `app.js` and `server.js` into `apps/workstations-api/src/`.
- Move `app.test.js` into `apps/workstations-api/tests/` and update its import path from `./app.js` to `../src/app.js`.
- Move `server.Dockerfile` to `apps/workstations-api/Dockerfile`.
- Create `apps/workstations-api/package.json`:
  - Name: `"workstations-api"`
  - Scripts: `dev`, `start`, `test`, `lint`
  - Dependencies: `@google-cloud/workstations`, `cors`, `dotenv`, `express`, `google-auth-library`
  - devDependencies: `supertest`, `vitest`

### 4. Adjust Tooling and References
- Ensure the root `.eslintrc` or `eslint.config.js` is globally applicable, or duplicate/extend configurations inside the apps. For simplicity, keep it at the root and ensure it targets `apps/**/*.js` and `apps/**/*.jsx`.
- Update the `scripts/` directory: check `verify-frontend.js` and `check-css.js` to ensure they point to `apps/web/src/...` instead of `src/...`.
- Update `nginx.conf` references if needed (or move it to `infrastructure/nginx/`).
- Update `package.json` root scripts to use Turborepo (`"dev": "turbo dev"`, `"build": "turbo build"`).

### 5. Finalize Workspaces
- Delete the existing `node_modules` directory and `package-lock.json` file at the root.
- Run `npm install` at the root to generate the new, workspace-aware `package-lock.json` and link all intra-repo dependencies.

## Verification
- `npm run build` from the root executes successfully without errors, building Vite.
- `npm run test` executes `vitest` in the `workstations-api` and passes.
- `npm run dev` starts both the frontend (`localhost:5173`) and the backend (`localhost:3001`) simultaneously.
- Manual verification: Open the browser and ensure the UI loads and authenticates as before.
