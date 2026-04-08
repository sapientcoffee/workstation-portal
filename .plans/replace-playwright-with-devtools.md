# Plan: Transition Frontend Testing to Chrome DevTools MCP

## Background & Motivation
The project currently uses Playwright for End-to-End (E2E) testing. The user wants to replace Playwright with Chrome DevTools testing, leveraging the Gemini CLI and its Chrome DevTools MCP capabilities (`chrome-devtools` skill). This shifts testing from static, coded assertions to agentic, dynamic verification.

## Scope & Impact
*   **Removal of Playwright:** We will completely remove Playwright from the project (`package.json`, configuration files, and `spec.js` files).
*   **Documentation Update:** We will update `docs/local-testing.md` to reflect the new agentic testing paradigm.
*   **Agentic Test Specs:** We will convert the existing Playwright tests (`homepage.spec.js` and `discovery.spec.js`) into natural language Markdown test specifications that an AI agent (or human) can execute using Chrome DevTools.

## Proposed Solution

1.  **Cleanup Dependencies & Configuration:**
    *   Modify `package.json` to remove the `@playwright/test` devDependency and the `test:e2e`, `test:e2e:ui`, and `test:e2e:report` scripts.
    *   Delete `playwright.config.js`.
    *   Delete the `tests/` directory containing `.spec.js` files.

2.  **Create Agentic Test Specifications:**
    *   Create a new file `tests/agentic-e2e.md` (or similar) that acts as the prompt/guide for the AI to run tests. It will include instructions for:
        *   **Landing Page:** Verify the `.hero-section`, `.feature-grid`, and that exactly 3 `.feature-card` elements exist. Check for the text "Lifecycle", "Management", and "Launching".
        *   **Discovery Guidance:** Navigate using `/?test_token=mock-token` and verify the instructional text ("scan your Google Cloud environment", "Where do I find this?", "GCP Console").

3.  **Update Documentation (`docs/local-testing.md`):**
    *   Remove references to Playwright.
    *   Add a section explaining how to trigger tests using the Gemini CLI (e.g., "Ask the Gemini CLI to run the frontend tests according to `tests/agentic-e2e.md`").

## Implementation Steps

1.  Remove `@playwright/test` from `package.json` and delete test scripts.
2.  Run `npm install` to update `package-lock.json`.
3.  Delete `playwright.config.js` and the `tests/*.spec.js` files.
4.  Create `docs/agentic-testing.md` containing the translated test cases.
5.  Update `docs/local-testing.md` to point to the new workflow.

## Verification
*   Verify that `npm install` passes and Playwright is fully removed.
*   Activate the `chrome-devtools` skill and ask the agent to execute the tests in `docs/agentic-testing.md` to prove the new workflow is functional.
