# Implementation Plan: Rename to DevBrew Portal

## Objective
Rename the "Workstation Portal" to "DevBrew Portal" across the user interface and project documentation, incorporating a coffee-themed vibe by updating the branding and primary iconography.

## Scope
- **UI Titles**: Update the main headings and header text in the React frontend.
- **HTML Document Title**: Update the `<title>` tag in `index.html`.
- **Iconography**: Replace the generic `Terminal` icon with a coffee-themed `Coffee` icon from `lucide-react` in the hero section and navigation header.
- **Documentation**: Update the `README.md` to reflect the new "DevBrew Portal" name.

## Implementation Steps

### Step 1: Update HTML Title
- **File**: `apps/web/index.html`
- **Action**: Change `<title>Workstations Developer Portal</title>` to `<title>DevBrew Portal</title>`.

### Step 2: Update React Frontend UI and Iconography
- **File**: `apps/web/src/App.jsx`
- **Actions**:
  1.  **Imports**: Replace the `Terminal` import with `Coffee` from `lucide-react`.
  2.  **Hero Section**: Change `<h1>Workstation Portal</h1>` to `<h1>DevBrew Portal</h1>`. Replace `<Terminal size={80} ... />` with `<Coffee size={80} ... />`.
  3.  **Header Section**: Change the header text `Workstations Developer Portal` to `DevBrew Portal`. Replace `<Terminal size={32} />` with `<Coffee size={32} />`.

### Step 3: Update Project Documentation
- **File**: `README.md`
- **Actions**: Replace instances of `Workstations Developer Portal` with `DevBrew Portal` (e.g., in the main `#` heading and introduction paragraph).

## Verification
- Run the React development server (`npm run dev`) and visually confirm that the unauthenticated hero section and the authenticated header both display "DevBrew Portal" and the new coffee icon.
- Check the browser tab title to ensure it reads "DevBrew Portal".
- Review `README.md` to ensure the title and introduction reflect the new branding.