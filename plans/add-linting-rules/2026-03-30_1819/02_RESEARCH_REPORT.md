# Research Report: Add Linting Rules

## 1. Current State Assessment

### Tech Stack & Languages
- **Monorepo:** Turborepo-powered.
- **Languages:** Entirely **JavaScript (ES Modules)**. No TypeScript is used in any application or script.
- **Frontend (`apps/web`):** React/Vite. Using `.jsx` and `.js` files.
- **Backend (`apps/workstations-api`):** Express/Node.js. Using `.js` files.

### Existing Infrastructure
- **ESLint:** 
    - A root `eslint.config.js` using the modern **Flat Config** format exists.
    - Root `devDependencies` include `eslint`, `@eslint/js`, and `globals`.
    - `apps/web` has `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`, and a `lint` script.
    - `apps/workstations-api` has **no** linting setup or dependencies.
- **Prettier:** Completely absent. No configuration or dependencies were found.
- **CI:** A `.github/workflows/lint.yml` exists and executes `npm run lint`.
- **Turborepo:** Root `lint` script delegates to `turbo lint`.

## 2. Technical Grounding

### Shared Configuration in Turborepo
Turborepo typically supports shared configurations via a `packages/` workspace, but in this specific repo, a centralized root `eslint.config.js` is already in place. Enhancing this root config to be context-aware (based on file paths) is the most efficient path.

### ESLint Flat Config & Prettier
The modern way to integrate Prettier with ESLint Flat Config is using `eslint-config-prettier` to disable conflicting rules and `eslint-plugin-prettier` to run Prettier as a lint rule (if desired), or simply running them side-by-side.

### Recommended Plugins
- **Frontend:** `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`.
- **Backend:** `eslint-plugin-n` (Node.js rules).
- **Global:** `eslint-config-prettier`.

## 3. Implementation Strategy
1.  **Centralize Tooling:** Install ESLint, Prettier, and all core plugins at the root `devDependencies`.
2.  **Add Prettier:** Create `.prettierrc` and `.prettierignore` at the root.
3.  **Refine Flat Config:** Update `eslint.config.js` to:
    - Include recommended React rules for `apps/web`.
    - Include recommended Node.js rules for `apps/workstations-api`.
    - Integrate Prettier (disable conflicting rules).
4.  **Unify Scripts:**
    - Ensure both `apps/web` and `apps/workstations-api` have a `lint` script.
    - Add a root `format` script (e.g., `prettier --write .`).
    - Add a root `lint:fix` script.
5.  **Clean Up:** Remove redundant linting dependencies from `apps/web`.
