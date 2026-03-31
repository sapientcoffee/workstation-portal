# Implementation Plan: Monorepo Linting & Formatting Architecture

## 📋 Micro-Step Checklist
- [ ] Phase 1: Dependencies and Scripts Foundation
  - [x] Step 1.A: The Verification Harness - Scripts & Turbo Setup
  - [x] Step 1.B: Clean Redundant Workspace Dependencies
  - [x] Step 1.C: The Core Change - Root Dependencies
- [ ] Phase 2: Configuration & TDD Validation
  - [x] Step 2.A: The Verification Harness - TDD Failure Files
  - [x] Step 2.B: Prettier Configuration
  - [x] Step 2.C: Centralized Root ESLint Configuration
  - [ ] Step 2.D: Green Validation & Cleanup

## 📝 Step-by-Step Implementation Details

### Phase 1: Dependencies and Scripts Foundation

#### Step 1.A (The Verification Harness - Scripts & Turbo Setup):
*   *Target File:* `package.json` (Root), `apps/web/package.json`, `apps/workstations-api/package.json`, `turbo.json`
*   *Instructions:* 
    *   In Root `package.json`: Add `"format": "turbo format"` and `"lint:fix": "turbo lint -- --fix"`.
    *   In `turbo.json`: Add a `"format"` task (with `{ "outputs": [] }` similar to `"lint"`).
    *   In `apps/web/package.json`: Add `"format": "prettier --write ."`.
    *   In `apps/workstations-api/package.json`: Add `"lint": "eslint ."`, and `"format": "prettier --write ."`.
*   *Verification:* Run `npm run format`. This MUST fail (Red) because `prettier` is not yet installed in the backend or globally hoisted. 

#### Step 1.B (Clean Redundant Workspace Dependencies):
*   *Target File:* `apps/web/package.json`
*   *Instructions:* Remove all ESLint-related packages from `devDependencies` (`@eslint/js`, `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`). We will manage these globally.
*   *Verification:* Run `cat apps/web/package.json | grep eslint`. It should return nothing.

#### Step 1.C (The Core Change - Root Dependencies):
*   *Target File:* `package.json` (Root)
*   *Instructions:* Install the required linting and formatting packages at the monorepo root by running: `npm install -D -W prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-jsx-a11y` (Note: `-W` or workspace root install flag depending on npm version, standard `npm install -D` in the root folder works for npm v8+).
*   *Verification:* Run `npm run format` again. It should now execute successfully across workspaces (using Prettier's default internal configs).

### Phase 2: Configuration & TDD Validation

#### Step 2.A (The Verification Harness - TDD Failure Files):
*   *Target File:* `apps/web/src/TDD-Formatting.jsx` and `apps/workstations-api/src/TDD-Linting.js`
*   *Instructions:* 
    *   Create `apps/web/src/TDD-Formatting.jsx` with blatant formatting violations (e.g., double quotes for strings, missing trailing commas) and a React linting violation (e.g., `const [state, setState] = useState();` where `state` is unused, or a missing `alt` tag on an `img` for a11y).
    *   Create `apps/workstations-api/src/TDD-Linting.js` with a Node.js violation (e.g., using an undeclared variable or testing an unused variable `const _unused = 123;` without an underscore prefix rule working yet).
*   *Verification:* `npm run lint` should *not* catch the React specific or a11y specific issues yet, because the plugins aren't configured in the flat config. 

#### Step 2.B (Prettier Configuration):
*   *Target File:* `.prettierrc` and `.prettierignore` (Root)
*   *Instructions:* 
    *   Create `.prettierrc` with standard strict rules (e.g., `{ "singleQuote": true, "trailingComma": "es5", "printWidth": 100 }`).
    *   Create `.prettierignore` blocking `node_modules/`, `dist/`, `.turbo/`, and `build/`.
*   *Verification:* Run `npx prettier --check apps/web/src/TDD-Formatting.jsx`. It MUST FAIL (Red) specifically complaining about the double quotes vs single quotes rule we just configured.

#### Step 2.C (Centralized Root ESLint Configuration):
*   *Target File:* `eslint.config.js` (Root)
*   *Instructions:* Rewrite the file strictly as an array of Flat Config objects:
    1.  **Global Ignores:** Object with `ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**']`.
    2.  **Base:** Object spreading `js.configs.recommended`.
    3.  **Frontend Rules (`apps/web/**/*.{js,jsx}`):** Define `files`, inject browser globals, set React `parserOptions` (`ecmaFeatures: { jsx: true }`), and include `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-refresh` plugins and their recommended rules.
    4.  **Backend Rules (`apps/workstations-api/**/*.js`, `scripts/**/*.js`):** Define `files`, inject Node and Mocha globals, and apply Node-specific rules.
    5.  **Prettier Overrides:** The absolute last object in the array should just be `eslintConfigPrettier` (imported from `eslint-config-prettier`) to override all formatting lint rules.
*   *Verification:* Run `npm run lint`. It MUST catch the unused variables, missing `alt` tags, and other deliberate violations in our TDD test files.

#### Step 2.D (Green Validation & Cleanup):
*   *Target File:* Root Workspace
*   *Instructions:* Run the format command to automatically fix formatting. Then manually delete the TDD files.
    *   Run `npm run format`.
    *   `rm apps/web/src/TDD-Formatting.jsx apps/workstations-api/src/TDD-Linting.js`.
*   *Verification:* Run `npm run lint` and `npm run format`. Both task pipelines must report 100% clean across the entire monorepo.