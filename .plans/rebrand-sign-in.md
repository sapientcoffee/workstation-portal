# Plan: Rebrand Sign-In Process

## Objective
Update all user-facing text and icons in the authentication flow to be generic ("Sign in") and remove all specific references to Google or Google Accounts.

## Scope
- **Target File:** `src/App.jsx`
- **Target File:** `tests/homepage.spec.js`

## Implementation Steps

1. **Update Hero Description:**
   - In `src/App.jsx`, change the text `The unified hub for managing your Google Cloud Workstations.` to `The unified hub for managing your Cloud Workstations.`.

2. **Update Sign-In Button:**
   - In `src/App.jsx`, locate the `<button>` that triggers `handleLogin`.
   - Change the text inside the button from `Sign in with Google` to `Sign in`.
   - Add the attribute `aria-label="Sign in"` to this button for accessibility.
   - Ensure the generic `<LogIn />` icon is retained.

3. **Update Test Assertions:**
   - In `tests/homepage.spec.js` (or any related tests), review assertions.
   - If tests assert on `Sign in with Google`, update them to assert on `Sign in`.
   - If tests assert on `Google Cloud Workstations` in the hero, update them to `Cloud Workstations`.

## Verification
- Run `npx playwright test tests/homepage.spec.js` to ensure all tests pass with the new strings.
- Manually review the unauthenticated UI to confirm no visual references to "Google" or "Google account" exist in the sign-in flow.