# Implementation Plan: Improve Homepage Helpfulness

## 📋 Micro-Step Checklist
- [x] Phase 1: CSS Framework Expansion
  - [x] Step 1.A: Create visual test verification harness for landing page
  - [x] Step 1.B: Add structural CSS classes (`.hero-section`, `.feature-grid`, `.feature-card`, `.helper-text`)
- [x] Phase 2: Landing Page Implementation (Unauthenticated State)
  - [x] Step 2.A: Verify unauthenticated state UI structure (Red)
  - [x] Step 2.B: Refactor `App.jsx` unauthenticated block with new layout and features
- [x] Phase 3: Discovery Guidance Enhancement (Authenticated State)
  - [x] Step 3.A: Verify authenticated contextual help rendering (Red)
  - [x] Step 3.B: Add contextual sub-header text under "Auto-Discovery"
  - [x] Step 3.C: Add "Where do I find this?" instructional text under the Project ID input
- [x] Phase 4: Styling Consistency Review
  - [x] Step 4.A: Perform manual & visual QA checks

## 📝 Step-by-Step Implementation Details

### Phase 1: CSS Framework Expansion

#### Step 1.A (The Verification Harness):
*   *Target File:* `tests/homepage.spec.js`
*   *Instructions:* Create a Playwright test file. Write assertions checking for the presence of the class `.hero-section`, `.feature-grid`, and at least 3 `.feature-card` elements when the application loads in an unauthenticated state. (These tests should fail initially).
*   *Verification:* Run `npx playwright test tests/homepage.spec.js`

#### Step 1.B (The Core Change):
*   *Target File:* `src/index.css`
*   *Instructions:* Add the following classes maintaining the glassmorphism design:
    *   `.hero-section`: `text-align: center; padding: 4rem 1rem;`
    *   `.feature-grid`: `display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-top: 3rem; width: 100%; max-width: 1000px; margin-inline: auto;`
    *   `.feature-card`: Utilize `backdrop-filter: blur(12px)` and `background: var(--surface-color)`. Add `padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: left;` with a subtle hover transition.
    *   `.helper-text`: `color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem; display: block;`
*   *Verification:* Ensure tests from Step 1.A compile (they will still fail until Phase 2).

### Phase 2: Landing Page Implementation (Unauthenticated State)

#### Step 2.A (The Verification Harness):
*   *Target File:* `tests/homepage.spec.js`
*   *Instructions:* Add tests checking for specific content strings within the feature cards, such as "Lifecycle", "Management", and "Launching". 
*   *Verification:* Run `npx playwright test tests/homepage.spec.js` (Red)

#### Step 2.B (The Core Change):
*   *Target File:* `src/App.jsx`
*   *Instructions:* Locate the `if (!user || !accessToken)` rendering block.
    1. Import missing icons from `lucide-react` (e.g., `PlayCircle`, `Settings`, `Power`).
    2. Restructure the returned JSX to include a `<div className="hero-section">` containing the main title, subtitle, and login button.
    3. Beneath the hero, add a `<div className="feature-grid">`.
    4. Inside the grid, add three `<div className="feature-card">` blocks. Each must represent a core capability: "Lifecycle", "Management", and "Launching" with an appropriate icon and description.
*   *Verification:* Run `npx playwright test tests/homepage.spec.js` (Green)

### Phase 3: Discovery Guidance Enhancement (Authenticated State)

#### Step 3.A (The Verification Harness):
*   *Target File:* `tests/discovery.spec.js`
*   *Instructions:* Create a test file mocking the logged-in state. Assert that text explaining the purpose of Auto-Discovery is visible, and the text "Where do I find this?" is present adjacent to the Project ID input.
*   *Verification:* Run `npx playwright test tests/discovery.spec.js` (Red)

#### Step 3.B (The Core Change - Sub-header):
*   *Target File:* `src/App.jsx`
*   *Instructions:* Locate the "Auto-Discovery" `<div className="title">`. Immediately beneath this `div`, add descriptive text explaining that providing a Project ID allows the portal to scan the Google Cloud environment for existing clusters and workstations. Use conversational language.

#### Step 3.C (The Core Change - Contextual Help):
*   *Target File:* `src/App.jsx`
*   *Instructions:* Locate the `<input>` for "Google Cloud Project ID". Immediately beneath it, add a `<span className="helper-text">` or `<div className="helper-text">` that politely explains why the Project ID is needed and includes a link or instructional text like "Where do I find this? (Check the GCP Console)".
*   *Verification:* Run `npx playwright test tests/discovery.spec.js` (Green)

### Phase 4: Final Styling & Review

#### Step 4.A (Verification):
*   *Target File:* N/A (Manual/End-to-End)
*   *Instructions:* Run the full end-to-end test suite and perform a manual visual check. Ensure the new UI elements seamlessly blend with the established "glassmorphism" aesthetic and responsive constraints. Both Vite and Express local development servers are already running in the background for live visual confirmation.
*   *Verification:* `npm run test:e2e`