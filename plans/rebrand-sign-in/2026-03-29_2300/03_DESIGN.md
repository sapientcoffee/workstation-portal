# Architecture Design: Rebrand Sign-In Process

## 1. Where We Are Going (Design Overview)
The goal of this design is to decouple the user-facing authentication interface from its underlying provider. While the system will continue to authenticate via Google (using Firebase Auth), the UI will present a unified, generic "Sign in" experience. This abstracts the authentication implementation details away from the user, creating a more cohesive and independent product brand.

## 2. Alignment & Patterns
- **UI Abstraction:** We are applying a basic facade pattern to the UI layer where the view components are agnostic to the authentication provider. 
- **Accessibility-First:** As part of modifying the interactive elements, we will ensure that the authentication controls are fully accessible by adding explicit ARIA labels.
- **Minimal Disruption:** The changes are strictly cosmetic and structural within the view layer. No underlying domain logic, Firebase configurations, or state management hooks will be altered.

## 3. Implementation Specifics

### 3.1 Exact String Replacements (`src/App.jsx`)
The core modification will occur in the `App.jsx` render block for unauthenticated users:
- **Primary Authentication Button Text:**
  - *Current:* `Sign in with Google`
  - *New:* `Sign in`
- **Primary Authentication Button Accessibility:**
  - *Addition:* The `<button>` element must include `aria-label="Sign in"` to fulfill the accessibility requirement.

### 3.2 Visual Approach & Iconography
- **Sign-in Icon:** The application currently imports and uses the `LogIn` icon from the `lucide-react` library for the authentication button.
  - *Decision:* We will **retain** the `LogIn` icon. Because it is an open-source, generic symbol (rather than a proprietary Google "G" logo), it perfectly satisfies the requirement to avoid third-party branding without requiring new graphical assets.

### 3.3 Consistency Across Landing Page and Error States
- **Error Messages:** The application's current error boundary handles authentication failures by appending the raw error message (`setError('Login failed: ' + err.message);`). Since this does not explicitly reference Google Accounts, the error state is already safely decoupled and generic.
- **Profile State:** Once authenticated, the header displays `Signed in as {user.email}`. This matches the exact terminology requested in the business rules ("Signed in") and requires no modification.

### 3.4 Descriptive Text on the Landing Page
The landing page hero section contains hardcoded references to Google that, while technically describing the product, interfere with the generic branding mandate for the unauthenticated state.
- **Hero Description:**
  - *Current:* `The unified hub for managing your Google Cloud Workstations.`
  - *Design Change:* Update to `The unified hub for managing your Cloud Workstations.` to remove the "Google" reference and maintain a completely provider-agnostic appearance on the landing page prior to authentication.