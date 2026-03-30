# Agentic Frontend Testing Specifications

This document defines the End-to-End (E2E) test cases for the Workstation Portal. These tests are designed to be executed by an AI agent (or human) using the **Chrome DevTools MCP** (`chrome-devtools` skill).

## ⚠️ Safety Rules

**CRITICAL:** During testing, automated walkthroughs, and UI verification, you are **STRICTLY FORBIDDEN** from performing any destructive actions.
- **DO NOT** click the "Delete" button for any workstation.
- **DO NOT** confirm any deletion modals.
- **DO NOT** execute the `executeDelete` or `/api/workstations/delete` backend endpoint in a test context.

---

## Prerequisites

1.  The backend server must be running (`node server.js`).
2.  The frontend development server must be running (`npm run dev`).
3.  For authenticated tests, you must have a valid test token generated via `node scripts/generate-test-token.js`.

---

## Test Case 1: Unauthenticated Landing Page

**Goal:** Verify the public landing page structure and content.

1.  **Navigate:** Go to `http://localhost:5173/`.
2.  **Verify Structure:**
    *   Ensure an element with class `.hero-section` is visible.
    *   Ensure an element with class `.feature-grid` is visible.
    *   Ensure there are exactly **3** elements with the class `.feature-card`.
3.  **Verify Content:**
    *   Check for the text: **"Lifecycle"**.
    *   Check for the text: **"Management"**.
    *   Check for the text: **"Launching"**.

---

## Test Case 2: Discovery Guidance (Authenticated Bypass)

**Goal:** Verify the instructional text in the discovery panel when using the service account bypass.

1.  **Generate Token:** (Optional if already provided) Run `node scripts/generate-test-token.js`.
2.  **Navigate:** Go to `http://localhost:5173/?test_token=YOUR_TOKEN` (or use `mock-token` if mocking is enabled).
3.  **Verify Content:**
    *   Check for the text: **"scan your Google Cloud environment"**.
    *   Check for the text: **"Where do I find this?"**.
    *   Check for the text: **"GCP Console"**.

---

## How to Execute

Ask the Gemini CLI:
> "Run the frontend agentic tests defined in `docs/agentic-testing.md`. Use Chrome DevTools to verify each step."
