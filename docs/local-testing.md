# Local E2E Testing & Walkthroughs

Because this application's backend requires a legitimate Google Cloud Platform OAuth Access Token to communicate with the `WorkstationsClient`, standard Firebase Auth Emulators are insufficient for testing the full end-to-end journey. 

Furthermore, using automated tools (like Cypress, Playwright, or Agentic Subagents) to log in through the real Google UI is notoriously fragile due to bot detection and CAPTCHAs.

To securely automate testing against real GCP resources, we use a **Service Account Token Injection Bypass**.

## Setup Guide

1. **Create a Test Service Account**
   In your Google Cloud Project, create a new Service Account (e.g. `e2e-tester@coffee-and-codey.iam.gserviceaccount.com`).
   Grant it the `Workstations Viewer` role (or `Workstations Admin` if testing start/stop actions) on the project.

2. **Download the JSON Key**
   Generate a JSON key for the new Service Account and save it securely.
   
   **Option A (Standard)**: Save it at `.keys/test-sa.json`. This directory is gitignored.
   **Option B (Recommended/Greener)**: Save it anywhere on your machine (e.g. `~/.config/gcloud/test-sa.json`) and set the environment variable `TEST_SA_KEY_PATH` before running the token script.

3. **Install Dependencies**
   Ensure your backend dependencies are installed, as the script relies on `google-auth-library`:
   ```bash
   npm install
   ```

## How to Run an E2E Test

Whenever you need to run an automated walkthrough or skip the login screen:

1. **Generate the Token**
   Run the helper script which uses the Service Account key to mint a fresh 1-hour OAuth Token. The script defaults to looking for a key at `.keys/test-sa.json`.
   ```bash
   node scripts/generate-test-token.js
   ```

2. **Inject the Token**
   The script will output a URL format like `http://localhost:5175/?test_token=ya29.c.c0...`.
   Navigate your automated browser directly to this URL. The `App.jsx` application will detect the `test_token` query parameter, **bypass the Firebase Google Authentication popups completely**, instantly hydrate standard Auth State, and load the Workstations dashboard using the Service Account token.
