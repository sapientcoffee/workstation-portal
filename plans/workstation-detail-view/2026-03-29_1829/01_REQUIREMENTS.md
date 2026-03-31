# Requirements - Workstation Detailed View

## Objective
Enhance the workstation portal to provide a detailed view when a workstation is selected from the list. This view should display configuration details and basic telemetry data.

## User Stories
- As a user, I want to click on a workstation in the list to see more information.
- As a user, I want to see the configuration of my workstation (e.g., machine type, disk size).
- As a user, I want to see real-time or near-real-time telemetry (CPU/Memory usage) for my workstation.

## Features
- **Selected Workstation State:** Track which workstation is currently being viewed in detail.
- **Detailed View Component:** A new UI component (e.g., a modal or a separate section) to show details.
- **Configuration Details:** Display information such as machine type, disk size, idle timeout, and regional configuration.
- **Telemetry Data:** Display basic metrics like CPU usage and memory usage for the selected workstation.

## Constraints
- Must use existing tech stack: React (v19) and Express.
- Must handle authentication correctly via the existing OAuth mechanism.
- Should follow the visual style of the current portal (Lucide icons, CSS variables).

## Out of Scope (for now)
- Editing workstation configuration (read-only view for now).
- Historical telemetry charts (just current/recent snapshot).
