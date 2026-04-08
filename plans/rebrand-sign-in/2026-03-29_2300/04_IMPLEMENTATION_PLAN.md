# Implementation Plan: Rebrand Sign-In Process

## 📋 Micro-Step Checklist
- [ ] Phase 1: Update UI Strings and Labels
  - [ ] Step 1.A: Update e2e tests to reflect new generic strings
  - [ ] Step 1.B: Update the landing page hero description and sign-in button

## 📝 Step-by-Step Implementation Details

### Phase 1: Update UI Strings and Labels

#### Step 1.A (The Verification Harness):
*   *Target File:* `tests/homepage.spec.js` (or any existing tests checking for 'Sign in with Google' or 'Google Cloud Workstations')
*   *Verification:* First, review existing tests to ensure they assert on the new terminology. If tests assert on `Sign in with Google`, update them to assert on `Sign in` (or `aria-label="Sign in"`). If they assert on `Google Cloud Workstations` in the hero, update them to `Cloud Workstations`.
*   *Command:* `npx playwright test tests/homepage.spec.js` (Verify it fails RED first).

#### Step 1.B (The Core Change):
*   *Target File:* `src/App.jsx`
*   *Instructions:* 
    1.  Locate the hero section `<p>` tag (around line 196) and change `The unified hub for managing your Google Cloud Workstations.` to `The unified hub for managing your Cloud Workstations.`.
    2.  Locate the `<button>` that triggers `handleLogin` (around line 211).
    3.  Add the `aria-label="Sign in"` attribute to the `<button>`.
    4.  Update the text inside the button from `Sign in with Google` to `Sign in`.
    5.  Ensure the `<LogIn />` icon remains intact.
*   *Verification:* Run the test suite or manually inspect the UI. The command to verify tests pass: `npx playwright test tests/homepage.spec.js` (Verify it passes GREEN).