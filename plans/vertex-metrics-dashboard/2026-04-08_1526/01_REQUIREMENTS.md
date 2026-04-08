# Requirements: Vertex AI Metrics Dashboard

## Objective
Add a comprehensive metrics dashboard to the Workstation Portal (as a new tab/page) to display token and AI model usage metrics against Vertex AI, covering both individual user-specific and project-wide views.

## User Stories
- **As a workstation user**, I want to see my own token and AI model usage so that I can monitor my personal resource consumption and quotas.
- **As a project administrator**, I want to see project-wide aggregated metrics so that I can understand overall usage patterns, costs, and resource allocation across all users.

## Constraints & Business Rules
- **Security:** Ensure that project-wide metrics are only accessible to authorized users (roles need clarification in later phases).
- **Architecture:** Maintain consistency with the existing Turborepo monorepo structure (`apps/web` and `apps/workstations-api`).
- **Data Source:** Utilize the most appropriate and recommended Google Cloud APIs (e.g., Cloud Monitoring, Logging, or Vertex AI native usage APIs) to fetch metrics.

## Technical Scope
- **Frontend (apps/web):**
    - Implement a new navigation link/tab for "Vertex AI Metrics".
    - Create a dashboard containing both graphical charts (e.g., usage over time) and tabular data.
- **Backend (apps/workstations-api):**
    - Develop secure API endpoints to fetch and aggregate Vertex AI usage data from Google Cloud.
    - Implement the necessary GCP SDK clients to retrieve this data.
