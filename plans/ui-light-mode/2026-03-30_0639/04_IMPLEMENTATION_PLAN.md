# Implementation Plan: UI Light Mode

## 📋 Micro-Step Checklist
- [ ] Phase 1: CSS Refactoring & Light Mode Overrides
  - [ ] Step 1.A: Write E2E Theme Verification Harness
  - [ ] Step 1.B: Refactor CSS Variables & Add Light Theme Overrides
- [ ] Phase 2: Theme State Management & UI Integration
  - [ ] Step 2.A: Implement `useTheme` Hook
  - [ ] Step 2.B: Integrate Toggle in Header (`App.jsx`)

## 📝 Step-by-Step Implementation Details

### Phase 1: CSS Refactoring & Light Mode Overrides

#### Step 1.A (The Verification Harness):
*   *Target File:* `tests/theme.spec.js`
*   *Verification:* Explicit assertions and tests to write FIRST (Red).
    *   Write an explicit E2E Playwright test `test.describe('Theme Switching')`.
    *   Verify the page loads with default dark mode styling (ensure the `body` background color matches `#0f111a` or `.light-theme` is absent).
    *   Locate the theme toggle button via accessibility selector (e.g., `page.getByRole('button', { name: /switch to/i })`).
    *   Click the toggle and assert that the `body` tag receives the `.light-theme` class.
    *   Verify `localStorage` gets updated with the `theme-preference` equal to `'light'`.
    *   Verify using `npx playwright test tests/theme.spec.js`.

#### Step 1.B (The Core Change - CSS):
*   *Target File:* `src/index.css`
*   *Instructions:*
    1.  Rename `--bg-dark` to `--bg-main` in the `:root` block and all occurrences throughout the file.
    2.  Rename `--bg-panel` to `--bg-surface` in the `:root` block and all occurrences.
    3.  Add the `body.light-theme` selector block immediately after `:root` to override dark mode defaults with:
        *   `--bg-main: #f8fafc;`
        *   `--bg-surface: #ffffff;`
        *   `--text-main: #0f111a;`
        *   `--text-muted: #475569;`
        *   `--border-glow: rgba(99, 102, 241, 0.1);`
    4.  Add a transition rule to target `body, .panel, header, button, input` specifying: `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;`.
*   *Verification:* Run `npm run lint` and verify CSS formatting.

### Phase 2: Theme State Management & UI Integration

#### Step 2.A (The Core Change - Hook):
*   *Target File:* `src/hooks/useTheme.js`
*   *Instructions:*
    1.  Implement the React hook exporting `useTheme`.
    2.  Initialize state by reading `theme-preference` from `localStorage`. Fall back to `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'` if no preference is saved.
    3.  Implement a `useEffect` dependent on `theme`:
        *   Persist the current `theme` to `localStorage.setItem('theme-preference', theme)`.
        *   If `theme === 'light'`, invoke `document.body.classList.add('light-theme')`.
        *   If `theme === 'dark'`, invoke `document.body.classList.remove('light-theme')`.
    4.  Return the tuple `[theme, toggleTheme]` where `toggleTheme` is a function that switches the state between `'light'` and `'dark'`.
*   *Verification:* Explicit testing is deferred to the E2E harness in 2.B.

#### Step 2.B (The Core Change - UI):
*   *Target File:* `src/App.jsx`
*   *Instructions:*
    1.  Import `useTheme` from `./hooks/useTheme.js`.
    2.  Import the `Sun` and `Moon` icons from the existing `lucide-react` dependency.
    3.  Call the hook inside the main `App` component to retrieve `theme` and `toggleTheme`.
    4.  Render a `<button>` inside the `<header>` element (e.g., positioned alongside `.user-profile`).
    5.  Bind `onClick={toggleTheme}` to the button.
    6.  Dynamically render the `Sun` icon when `theme === 'dark'` and the `Moon` icon when `theme === 'light'`.
    7.  Apply an accessibility label dynamically: `aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}`.
*   *Verification:* Execute `npm run test:e2e tests/theme.spec.js` to ensure the integration successfully turns the test harness green.