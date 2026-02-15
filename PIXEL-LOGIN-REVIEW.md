# Pixel — Login UI review (2026-02-15)

## Scope
- Target: `/login`
- Files touched: `src/app/login/page.tsx`, `src/components/AuthBar.tsx`
- Constraint respected: **no change to `/app` layout**.

## What changed
### Page layout (`/login`)
- Split layout into a **2-column (lg)** grid: left value proposition + right auth card.
- Added concise SaaS copy: benefits (historique + synchronisation) + reassurance (“continuer sans compte”).
- Improved spacing/typography hierarchy (badge → title → paragraph → feature cards).

### Auth card (AuthBar)
- Modernized card styling (subtle radial glow, border, shadow).
- Improved copy:
  - “Continuer avec Google”
  - Toggle: “Se connecter” / “Créer un compte”
  - CTA: “Se connecter” / “Créer mon compte”
- Added better **loading state** (spinner overlay) + disabled inputs/buttons.
- Added **error mapping** for common Firebase auth codes (friendly French messages) + alert styling.
- Switched email/password flow to a real `<form>` (Enter key submits).
- Added a short session-cookie note (small text).

## Screenshots
- (Optional) add screenshots here when available:
  - `./screenshots/login-desktop.png`
  - `./screenshots/login-mobile.png`
