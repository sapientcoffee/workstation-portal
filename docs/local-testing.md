# Local E2E Testing & Walkthroughs

Because this application's backend requires a legitimate Google Cloud Platform OAuth Access Token to communicate with the `WorkstationsClient`, standard Firebase Auth Emulators are insufficient for testing the full end-to-end journey. 

Furthermore, using automated tools (like Cypress or Playwright) to log in through the real Google UI is notoriously fragile due to bot detection and CAPTCHAs. We now use **Agentic Testing** powered by the Gemini CLI and **Chrome DevTools MCP** to perform automated walkthroughs and verify frontend behavior.

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

## Backend API Testing (Isolated)

For testing microservice changes in isolation without requiring real GCP credentials or the frontend, we use **Vitest** and **Supertest**.

### How to Run API Tests
```bash
npm run test:api
```

### Key Features
- **Fast Execution**: Tests run in under 1 second.
- **Isolation**: GCP SDKs (`@google-cloud/workstations`, `google-auth-library`) are mocked to return predictable data.
- **No-Side-Effects**: The server is tested using `app.js` without binding to a real network port, avoiding "Address already in use" errors during parallel development.

---

## How to Run an Agentic E2E Test

Whenever you need to run an automated walkthrough or skip the login screen:

1. **Generate the Token**
   Run the helper script which uses the Service Account key to mint a fresh 1-hour OAuth Token. The script defaults to looking for a key at `.keys/test-sa.json`.
   ```bash
   node scripts/generate-test-token.js
   ```

2. **Execute the Agentic Test Suite**
   Open the Gemini CLI and provide the following instruction:
   > "Run the frontend agentic tests defined in `docs/agentic-testing.md`. Use Chrome DevTools to verify each step."

## Troubleshooting & Speed-Up Tips

### ⚡ The "Mock-Auth" Fast Track
To quickly test the **Authenticated UI Layout** without a real Service Account or Google login:
- **URL:** `http://localhost:5173/?test_token=mock-token`
- **Result:** The frontend will bypass login and show the discovery dashboard. 
- *Note:* Backend API calls will fail with a `401 Unauthorized` as the token is not a real GCP credential.

### 👤 Identity-Linked Testing (Real Account)
The most seamless way to test with your **actual Google identity** (without UI login hurdles) is to use a local `gcloud` token.

1. **Generate a Token:**
   Run this in your local terminal to get a fresh 1-hour access token:
   ```bash
   gcloud auth print-access-token
   ```
2. **Launch with Identity:**
   Navigate to the app using the token in the URL:
   ```
   http://localhost:5173/?test_token=YOUR_GCLOUD_TOKEN
   ```
3. **Verify:** The portal will now show your real email in the header and have the full GCP permissions of your `gcloud` account for operations like discovery, start, and stop.

### 🌐 Network & Proxy Issues
- **502 Bad Gateway / Connection Refused:**
  - Ensure the backend is listening on `0.0.0.0` or `127.0.0.1`.
  - Check `vite.config.js` to confirm the proxy targets `http://localhost:3001`.
  - Avoid setting `VITE_API_URL` locally; let the Vite proxy handle `/api/*` requests.
- **Zombie Processes:** If ports are blocked, clear hanging processes:
  ```bash
  pkill -f server.js
  lsof -i :5173 -t | xargs kill -9
  ```

### 📝 Capturing Logs
When running agentic tests, redirect backend output to identify API failures vs. connection errors:
```bash
node server.js > backend.log 2>&1 &
```

---

## 🚫 Critical Deletion Warning
During any testing or automated walkthrough, you are **STRICTLY FORBIDDEN** from performing any destructive actions. This includes:
- Clicking the "Delete" button.
- Confirming any deletion modals.
- Calling the `/api/workstations/delete` backend endpoint.
Testing is meant for visibility and lifecycle management (Start/Stop) only.
