# High-Level Design: UI Light Mode

## 1. Architecture
*   **State Management**: The theme state will be managed centrally within `App.jsx` using React's `useState` hook. The state will hold a string value indicating the current active theme (e.g., `'light'` or `'dark'`).
*   **Initialization & Persistence**:
    *   On initial load, the application will check `localStorage` for a saved user preference (e.g., `theme-preference`).
    *   If no preference is found in `localStorage`, it will fall back to the OS system preference using `window.matchMedia('(prefers-color-scheme: dark)').matches`.
    *   Whenever the user toggles the theme, the new state will be immediately saved to `localStorage` to ensure persistence across sessions.
*   **DOM Application**: The active theme will be applied by toggling a CSS class (e.g., `.light-theme`) on the document `<body>` element. This approach allows standard CSS cascading to seamlessly swap out variable values.

## 2. CSS Strategy
*   **Theme-Agnostic Variables**: Current semantic variables tied exclusively to the dark aesthetic (like `--bg-dark`) will be refactored to theme-agnostic names. For instance:
    *   `--bg-dark` becomes `--bg-main`
    *   `--bg-panel` becomes `--bg-surface`
    *   `--text-main` remains `--text-main`
    *   `--text-muted` remains `--text-muted`
*   **Base vs. Overrides**: 
    *   The `:root` selector in `src/index.css` will define the default **dark theme** variables, preserving the existing baseline aesthetic.
    *   A `.light-theme` class selector will be introduced to override these variables with their light mode equivalents.
    *   *Example*:
        ```css
        :root {
          --bg-main: #0f111a;
          --text-main: #f8fafc;
        }
        body.light-theme {
          --bg-main: #f8fafc;
          --text-main: #0f111a;
        }
        ```
*   **Gradients & Glows**: Hardcoded radial gradients on the body and contextual shadows (like `--border-glow`) will be abstracted into CSS variables so they can be appropriately inverted, softened, or removed in light mode.

## 3. UI/UX
*   **Toggle Placement**: A new theme toggle button will be integrated into the application header in `App.jsx`, positioned cleanly on the right-hand side alongside existing global controls (like user/project context).
*   **Visual Design**: The toggle will utilize intuitive iconography—such as a Sun icon representing light mode and a Moon icon representing dark mode. The icon will dynamically swap based on the current state.
*   **Accessibility**: The button will be fully accessible, utilizing appropriate `aria-labels` (e.g., "Switch to light theme" / "Switch to dark theme") and keyboard navigation support.

## 4. Transitions
*   **Smooth Theme Switching**: To prevent jarring visual flashes when switching themes, a global CSS transition will be applied to relevant structural elements.
*   **Implementation**: A global rule will enforce a smooth transition on color-related properties:
    ```css
    body, .panel, header, button, input {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    ```
*   This ensures that when the `.light-theme` class is toggled and the CSS variables update, the entire UI gracefully cross-fades between the dark and light states.