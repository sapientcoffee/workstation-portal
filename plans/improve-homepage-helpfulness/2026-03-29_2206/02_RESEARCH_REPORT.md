# Research Report: Homepage Helpfulness & Discovery Guidance

## 1. Technical Grounding
- **Framework:** React 19 (Vite-based).
- **Styling:** Standard CSS with CSS variables for theming (`src/index.css`).
- **Icons:** `lucide-react`.
- **Main Component:** `src/App.jsx` contains both the authentication gate and the main dashboard logic.

## 2. Current Implementation Analysis

### Homepage / Login View (`src/App.jsx`)
- Located in the `if (!user || !accessToken)` block (approx. lines 344-360).
- **Current Content:** A simple icon, title, and a single sentence: "Please sign in with your Google account to access your resources."
- **Opportunity:** This is the primary landing page for unauthenticated users. It lacks information about the app's capabilities (lifecycle management, launching).

### Discovery Flow (`src/App.jsx`)
- **Component:** The `setup-panel` div (approx. lines 381-400).
- **Current Content:** A header "Auto-Discovery" and an input field for "Google Cloud Project ID".
- **Current Logic:** Uses `localStorage` to persist the `projectId`. The `discoverWorkstations` function triggers the API call.
- **Guidance Gap:** There is no explanation of what "Discover Workstations" does or where to find the Project ID.

## 3. Key Findings & Patterns
- **Styling Pattern:** Uses a "glassmorphism" style with `backdrop-filter: blur(12px)` and `rgba` backgrounds.
- **Component Structure:** The app is currently a single large component (`App.jsx`).
- **Persistence:** Project ID is stored in `localStorage` as `gcp_projectId`.

## 4. UI/UX Suggestions
- **Onboarding Section:** Add a "Getting Started" or "App Overview" section to the login page.
- **Contextual Help:** Add a tooltip or small descriptive text below the Project ID input to explain its purpose.
- **Feature Highlights:** Use cards or an icon grid on the login page to show "Create," "Manage," and "Launch" capabilities.
