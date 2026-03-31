# Design: Monorepo Linting & Formatting Architecture

## 1. Where We Are Going
We are establishing a **Centralized, Path-Aware Linting and Formatting** architecture. This will be achieved by upgrading the existing root ESLint setup to fully leverage the modern **Flat Config** format (`eslint.config.js`) and introducing **Prettier** as the authoritative code formatter. Instead of scattering configuration files across individual workspaces, we will maintain a single source of truth at the monorepo root that intelligently applies specialized rulesets based on file paths.

## 2. Alignment with Existing Patterns
The current repository is a Turborepo-powered monorepo utilizing JavaScript (ES Modules) exclusively. 
- **Turborepo Integration:** We will align with Turborepo's task runner by ensuring each workspace defines a `lint` and `format` script that `turbo run lint` and `turbo run format` can orchestrate from the root.
- **Existing Flat Config:** We are extending the current nascent root `eslint.config.js` rather than reverting to legacy formats (`.eslintrc`). Flat Config naturally supports monorepos through the `files` and `ignores` array properties.

## 3. Patterns & Trade-offs

### 3.1. Centralized Flat Config vs. Workspace-Specific Configs
*   **Pattern:** We are choosing a **Single Root Config** (`eslint.config.js`) over localized configs (e.g., having a separate `apps/web/eslint.config.js`).
*   **Trade-off:** While workspace-specific configs isolate domain rules strictly to the package, a single root config significantly reduces boilerplate and dependency duplication in this JS-only monorepo. Flat Config's cascading array model makes it trivial to apply React rules exclusively to `apps/web/**/*.jsx` and Node.js environment rules exclusively to `apps/workstations-api/**/*.js`.

### 3.2. ESLint + Prettier Integration Strategy
*   **Pattern:** **Side-by-Side Execution with Conflict Resolution**. We will use `eslint-config-prettier` to disable ESLint rules that conflict with Prettier's formatting. 
*   **Trade-off:** We are intentionally *not* using `eslint-plugin-prettier` (which runs Prettier as an ESLint rule). Running them separately (`prettier --write .` and `eslint .`) is computationally faster, avoids noisy ESLint errors for mere formatting issues in the editor, and aligns with modern ecosystem best practices.

### 3.3. Dependency Management
*   **Pattern:** **Hoisted DevDependencies**. All linting and formatting tools (`eslint`, `prettier`, and plugins like `eslint-plugin-react`) will be installed and managed at the root `package.json`.
*   **Trade-off:** Individual workspaces lose explicit control over their linting dependency versions. However, this guarantees 100% consistency across the monorepo and drastically simplifies dependency maintenance.

## 4. Structural Boundaries & Rulesets
The root `eslint.config.js` will export an array of configuration objects forming a logical cascade:
1.  **Global Ignores:** Apply monorepo-wide ignores (e.g., `dist/`, `node_modules/`, `.turbo/`).
2.  **Base JS Rules:** Apply `eslint:recommended` and basic globals to all `**/*.{js,jsx}` files.
3.  **Frontend Rules (Targeted):** Apply React-specific plugins (`react`, `react-hooks`, `jsx-a11y`) strictly to `apps/web/**/*.{js,jsx}`.
4.  **Backend Rules (Targeted):** Apply Node.js-specific globals and recommended plugin rules strictly to `apps/workstations-api/**/*.js` and `scripts/**/*.js`.
5.  **Prettier Overrides:** Append `eslint-config-prettier` at the very end of the Flat Config array to disable any formatting-related lint rules globally, handing full control of formatting to Prettier.