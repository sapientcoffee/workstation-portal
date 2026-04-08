# High-Level Design Document: Improve Homepage Helpfulness

## 1. Architectural Approach & Alignment
**Where we are going:** We are enhancing the user onboarding experience by transforming the unauthenticated login view into a feature-rich landing page, and augmenting the authenticated state's discovery panel with contextual guidance. 
**Alignment & Patterns:** We will continue to leverage the existing React 19 structure within `src/App.jsx` and the custom CSS variable system in `src/index.css`. To maintain the current architectural footprint, we will not extract new files but will instead organize the rendering logic within `App.jsx`. We will strictly adhere to the established "glassmorphism" design system.

## 2. Login View Enhancement (Unauthenticated State)
The current minimalist login screen will be upgraded to serve as an informative landing page that highlights the application's core value proposition.

*   **Hero Section:** A welcoming header that introduces the Workstation Portal.
*   **Feature Grid:** A responsive grid displaying three primary capabilities using `lucide-react` icons:
    1.  **Lifecycle:** Highlighting the ability to create and tear down workstations.
    2.  **Management:** Showcasing start, stop, and configuration management.
    3.  **Launching:** Emphasizing one-click connection to the development environment.
*   **Trade-offs:** We are keeping this logic inside the `if (!user || !accessToken)` block in `App.jsx` rather than creating a separate `<Login />` component to align with the current single-file architecture, prioritizing simplicity over aggressive modularization at this stage.

## 3. Discovery Guidance (Authenticated State)
To resolve the contextual gap during workstation discovery, we will update the `setup-panel` section in the main dashboard view.

*   **Descriptive Sub-header:** Added below the "Auto-Discovery" title to explain that providing a Project ID allows the portal to scan the Google Cloud environment for existing clusters and workstations.
*   **Instructional Helper Text:** Placed immediately beneath the Project ID input field. This text will politely explain *why* the Project ID is necessary and provide a hint on where the user can find it (e.g., within the GCP Console).

## 4. Styling Consistency & Patterns
All new UI elements will strictly conform to the existing application theme. 

*   **Glassmorphism:** New feature cards will utilize `backdrop-filter: blur(12px)` and `background: var(--surface-color)` to match the existing panels.
*   **New CSS Classes (Target: `src/index.css`):**
    *   `.hero-section`: Container alignment and spacing for the unauthenticated landing view.
    *   `.feature-grid`: `display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));` for responsive layout.
    *   `.feature-card`: Padding, border-radius, border styling, and subtle hover transitions.
    *   `.helper-text`: Typography adjustments (`color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem;`) for non-intrusive guidance.

## 5. Content Clarity & Tone
The system's copy will be updated to reflect a friendly, onboarding-focused tone. Instead of sterile prompts, the application will use conversational, helpful language that treats the user as a partner in setting up their optimal developer environment.