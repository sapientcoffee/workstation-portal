# Research Report: Coffee Message of the Day

## 1. Technical Grounding (Monorepo Integration)
The repository is a Turborepo-powered monorepo with an `apps/` directory for independent applications. To add the new "Coffee Message of the Day" app:
- **Workspace:** Create `apps/coffee-app`.
- **Registration:** The root `package.json` already includes `"apps/*"`, so the workspace will be automatically detected.
- **Task Pipeline:** `turbo.json` handles `dev`, `build`, and `lint` tasks. The new app's `package.json` must include these scripts to participate.
- **Boilerplate:** `apps/web` provides the standard React + Vite setup, including a `Dockerfile` for Nginx-based containerization.
- **Linting:** Root `eslint.config.js` needs to be updated to include `'apps/coffee-app/**/*.{js,jsx}'` in the React-specific rules.

## 2. Content Inventory
The following 15 coffee puns and motivational messages have been curated for the application:
1. "Espresso yourself!"
2. "Better latte than never."
3. "Words cannot espresso how much you bean to me."
4. "Keep your head high, your gluteus tight, and your coffee strong."
5. "Hocus pocus! I need coffee to focus."
6. "A day without coffee is like... just kidding, I have no idea."
7. "Mug life."
8. "Ground yourself."
9. "May your coffee be strong and your Monday be short."
10. "First I drink the coffee, then I do the things."
11. "Deja Brew: The feeling that you've had this coffee before."
12. "Stay grounded and keep brewing."
13. "Life is what happens between coffee and wine."
14. "You’re brew-tiful."
15. "Thanks a latte for being you!"

## 3. Thematic & Asset Audit
- **Color Palette:** No existing brown/cream color palettes were found in the codebase. The current `apps/web` app uses a dark theme with indigo/emerald. A new palette will need to be defined (e.g., using Tailwind colors like `amber-900`, `stone-100`, `orange-950`).
- **Icons/SVGs:** No coffee-related icons or SVGs exist in the repository. We will need to generate or import a coffee icon (e.g., a steaming mug or a coffee bean).
- **Existing Logic:** A Git hook script `.gemini/hooks/coffee-and-git.sh` exists which prints coffee tips, suggesting a project culture that values coffee-related humor.

## 4. Implementation Recommendations
- **Styling:** Use Tailwind CSS for rapid prototyping of the warm, coffee-inspired theme.
- **State:** A simple `useState` or a randomized selection on component mount will suffice for the "message of the day."
- **Asset Generation:** Use the `nanobanana` toolset to generate high-quality coffee-themed icons or background patterns during the implementation phase.
