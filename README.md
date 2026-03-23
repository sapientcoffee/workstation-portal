# Google Cloud Workstations Developer Portal

A sleek, modern developer portal that interacts with the Google Cloud Workstations API. It provides an intuitive interface for discovering, managing, and launching your accessible Cloud Workstations across all locations, clusters, and configurations.

## Overview

The portal consists of:
- **Frontend**: A React application powered by Vite, providing a glassmorphism-inspired UI for workstation management.
- **Backend**: An Express.js Node backend that acts as a proxy to the Google Cloud Workstations API.

## Features

- **Auto-Discovery**: Automatically find all Workstations available to a specific Google Cloud Project ID.
- **Lifecycle Management**: Start and Stop workstations directly from the UI.
- **Direct Launch**: One-click access to launch into your running Cloud Workstation environments.
- **Live State Updates**: Real-time visualization of workstation states (`RUNNING`, `STOPPED`, `STARTING`, etc.).

## Application in Action

### Session Recording
![Workstation Portal Demo](/home/admin_robedwards_altostrat_com/.gemini/antigravity/brain/6a1a1c72-7cfd-4eea-9ce7-7c3a0d33c2a4/workstation_portal_demo_1774280293629.webp)

### Key Screens
**Auto-Discovery View**
![Auto-Discovery Dashboard](/home/admin_robedwards_altostrat_com/.gemini/antigravity/brain/6a1a1c72-7cfd-4eea-9ce7-7c3a0d33c2a4/portal_dashboard_1774280324008.png)

**Active Workstation View**
![Running Workstation](/home/admin_robedwards_altostrat_com/.gemini/antigravity/brain/6a1a1c72-7cfd-4eea-9ce7-7c3a0d33c2a4/portal_interaction_running_1774280398516.png)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Active Google Cloud credentials configured (e.g., `gcloud auth application-default login`)
- Permissions to Access Google Cloud Workstations (`roles/workstations.user`)

### Setup and Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   The backend runs on port 3001 and uses the Node.js `@google-cloud/workstations` SDK.
   ```bash
   node server.js
   ```

3. **Start the Frontend Development Server**
   In a separate terminal, start the Vite server.
   ```bash
   npm run dev
   ```

4. **Access the Portal**
   Open your browser to `http://localhost:5173`.
