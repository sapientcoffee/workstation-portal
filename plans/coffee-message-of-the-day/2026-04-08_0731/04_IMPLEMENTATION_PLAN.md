# Implementation Plan: Coffee Message of the Day

## 📋 Micro-Step Checklist
- [x] Phase 1: Project & Monorepo Setup
  - [x] Step 1.A: Initialize Vite React boilerplate and Tailwind config.
  - [x] Step 1.B: Update ESLint and Monorepo configurations.
- [x] Phase 2: Data & State Logic
  - [x] Step 2.A: Implement data array and randomization utility tests.
  - [x] Step 2.B: Implement data array and randomization utility.
- [ ] Phase 3: UI Component Skeletons & Implementation
  - [ ] Step 3.A: Implement `CoffeeBackground` component.
  - [ ] Step 3.B: Implement `MessageCard` component.
  - [ ] Step 3.C: Implement `RefreshButton` component.
- [ ] Phase 4: Root Assembly
  - [ ] Step 4.A: Implement `App.jsx` integration and layout.

## 📝 Step-by-Step Implementation Details

### Phase 1: Project & Monorepo Setup
#### Step 1.A (Initialize Vite React Boilerplate):
*   *Target Files:* `apps/coffee-app/package.json`, `apps/coffee-app/vite.config.js`, `apps/coffee-app/index.html`
*   *Instructions:* Scaffold a new React app. Setup `vite.config.js`. Install React, Vite, Tailwind CSS, and standard `apps/web` deps within this package. Configure `package.json` with standard monorepo scripts (`dev`, `build`, `lint`).
*   *Verification:* Ensure `npm run dev --workspace=apps/coffee-app` spins up without errors.

#### Step 1.B (Update ESLint & Monorepo):
*   *Target Files:* `eslint.config.js` (root), `apps/coffee-app/tailwind.config.js`, `apps/coffee-app/src/index.css`
*   *Instructions:* Initialize Tailwind directives in `index.css` and configure `tailwind.config.js` pointing to `'./index.html', './src/**/*.{js,ts,jsx,tsx}'`. Ensure root `eslint.config.js` applies rules to `'apps/coffee-app/**/*.{js,jsx}'`.
*   *Verification:* Run `npm run lint` from the root to verify standard linting applies to `apps/coffee-app`.

### Phase 2: Data & State Logic
#### Step 2.A (The Verification Harness - Data & Logic):
*   *Target File:* `apps/coffee-app/src/data/messages.test.js`
*   *Verification:* Write tests asserting that the `coffeeMessages` array has exactly 15 string items and that a new `getRandomMessage` utility correctly returns strings from the array. Run `npm test --workspace=apps/coffee-app` (expect failure).

#### Step 2.B (The Core Change - Content & Logic):
*   *Target File:* `apps/coffee-app/src/data/messages.js`
*   *Instructions:* Create the array containing the 15 hardcoded coffee puns/messages from the research. Create and export a `getRandomMessage(currentMessage)` utility function.
*   *Verification:* Run `npm test --workspace=apps/coffee-app` (expect success).

### Phase 3: UI Component Skeletons & Implementation
#### Step 3.A (CoffeeBackground Component):
*   *Target File:* `apps/coffee-app/src/components/CoffeeBackground.jsx`
*   *Instructions:* Export a wrapper component rendering a `div` with `bg-stone-100` and `min-h-screen`, `flex`, `items-center`, `justify-center`. Render `{children}`.
*   *Verification:* Run `npm run dev --workspace=apps/coffee-app` and visually confirm layout, or test via vitest component test if configured.

#### Step 3.B (MessageCard Component):
*   *Target File:* `apps/coffee-app/src/components/MessageCard.jsx`
*   *Instructions:* Receive a `message` prop. Render the message inside a stylized box using `bg-amber-100`, `text-orange-950`, `border-amber-700`, `rounded-xl`, `shadow-lg`, and `p-8`. Use `text-2xl` or `text-3xl`.
*   *Verification:* Import temporarily into `App.jsx` with a mock string and check browser rendering.

#### Step 3.C (RefreshButton Component):
*   *Target File:* `apps/coffee-app/src/components/RefreshButton.jsx`
*   *Instructions:* Receive an `onRefresh` prop. Render a clickable element (e.g., `<button>`) with text "Next Cup" or an SVG icon. Apply a hover effect (e.g., `hover:bg-amber-200`). Wire up the `onClick` event.
*   *Verification:* Import temporarily into `App.jsx` and `console.log` on click.

### Phase 4: Root Assembly
#### Step 4.A (Root App Integration):
*   *Target File:* `apps/coffee-app/src/App.jsx`
*   *Instructions:* Import `CoffeeBackground`, `MessageCard`, `RefreshButton`, and `getRandomMessage`. Use `useState` to initialize the active message. Provide the state string to `MessageCard` and a state-updater callback to `RefreshButton`.
*   *Verification:* Start the dev server (`npm run dev`). Verify the app loads a random message, and clicking the refresh button cycles it to a new one.
