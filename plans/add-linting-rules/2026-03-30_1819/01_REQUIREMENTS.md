# Requirements: Add Linting Rules

## Objective
Implement a consistent and professional linting and formatting setup across the entire monorepo using ESLint and Prettier. The goal is to enforce "standard recommended" practices to improve code quality, maintainability, and readability without being overly restrictive.

## User Stories
- **As a Developer**, I want the codebase to have consistent formatting, so that it's easier to read and maintain.
- **As a Developer**, I want common coding mistakes to be automatically flagged by a linter, so that I can catch potential bugs early.
- **As a Reviewer**, I want the code to follow a standard style, so that code reviews can focus on logic rather than formatting.

## Constraints & Business Rules
- Use **ESLint** for linting.
- Use **Prettier** for code formatting.
- Apply **Standard Recommended Rules** (e.g., `eslint:recommended`, `plugin:react/recommended` for frontend, `plugin:@typescript-eslint/recommended` for TS).
- The setup must work across the entire monorepo (Turborepo).
- Enforcement should be manual or integrated into CI/CD (no pre-commit hooks at this stage).

## Technical Scope
- **Root:** Configure a top-level ESLint/Prettier setup (if applicable) or ensure the monorepo structure is respected.
- **Frontend (`apps/web`):** React-specific linting (hooks, a11y, etc.) and Vite compatibility.
- **Backend (`apps/workstations-api`):** Node.js/Express-specific linting.
- **Shared:** Ensure common configurations are shared where possible to maintain consistency.
- **Scripts:** Add `npm run lint` and `npm run format` scripts to the root `package.json` to trigger checks across all workspaces.
