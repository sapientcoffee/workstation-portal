# Research Report: UI Light Mode

## 1. Technical Grounding
- **Framework**: React 18+ with Vite.
- **Styling**: Standard CSS with CSS variables (CSS Custom Properties).
- **Icons**: No specific icon library was identified in the initial grep, likely using SVG or standard characters.
- **State**: Local React state in `App.jsx`.
- **Persistence**: `localStorage`.

## 2. Current Implementation Analysis
### Global Styles (`src/index.css`)
- Defines a set of color variables in `:root`:
  ```css
  :root {
    --bg-dark: #0f111a;
    --bg-panel: rgba(22, 25, 37, 0.7);
    --border-glow: rgba(99, 102, 241, 0.3);
    --primary: #6366f1;
    --primary-hover: #4f46e5;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    ...
  }
  ```
- The `body` and other elements directly consume these `var(--bg-dark)` and `var(--text-main)` variables.

### Application Root (`src/App.jsx`)
- `App.jsx` contains the `header` element and manages global state like `user` and `projectId`.
- It currently lacks a theme provider or theme-related state.

## 3. Implementation Path
- **Theme Variables**: Refactor `src/index.css` to use a `.light-mode` class (or similar) to override the default `:root` variables.
- **Theme State**: Add a `theme` state to `App.jsx` (initial value from `localStorage` or `window.matchMedia`).
- **Theme Toggle**: Implement a toggle button in the `header` of `App.jsx`.
- **Persistence**: Update `localStorage` whenever the theme changes.
- **Refactoring**: Ensure all hardcoded "dark" semantic names (like `--bg-dark`) are refactored to more neutral names (like `--bg-page`) to avoid confusion in light mode.

## 4. Risks & Considerations
- **Semantic Naming**: The variable `--bg-dark` is used as the page background. In light mode, this name will be misleading. It should be renamed to `--bg-main` or `--color-background`.
- **Gradients**: The `body` has hardcoded radial gradients that may need adjustment for light mode visibility.
