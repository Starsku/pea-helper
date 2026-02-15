# DEVLOG

## 2026-02-15 — Post-login redirect fiable
- `src/components/AuthBar.tsx` : après `onAuthStateChanged`, on attend la réponse OK de `/api/auth/login` (cookie session) puis redirection vers `/app` (ou `?next=`). En cas d’échec, affichage d’une erreur claire (au lieu d’un état "connecté" bloqué sur `/login`).

## 2026-02-15 — Rework page /login en “single card” (style Reviewwiz)
- Nouveau layout centré (mobile-first), branding en haut + tagline + footer discret.
- AuthBar redesign: bouton Google large, séparateur “Ou via Email”, champs email/mdp avec icônes, CTA primaire pleine largeur.
- Lien “Pas encore de compte ? S’inscrire” bascule le mode signup (sans créer une nouvelle route).
- Fonctionnalités Firebase/Auth existantes conservées, /app inchangé.


## 2026-02-15 — Login UI polish (Pixel)

### Objectif
- Mettre `/login` au standard **clean SaaS** sans toucher au layout de `/app`.
- Garder les flows (Google + email/password) en améliorant copy, spacing, typographie, states, responsive.

### Fichiers modifiés
- **Modif** `src/app/login/page.tsx`
  - Mise en page responsive en grille (col gauche: value prop, col droite: carte d’auth).
  - Copy SaaS + mini features (Historique / Synchronisation) + rassurance “continuer sans compte”.
- **Modif** `src/components/AuthBar.tsx`
  - Refine UI card (border/shadow/glow subtil) + meilleure hiérarchie visuelle.
  - Boutons et libellés plus clairs ("Continuer avec Google", toggles, CTA).
  - Ajout états **loading** (spinner) + disable inputs/actions.
  - Erreurs Firebase mappées en messages FR lisibles + rendu en alert.
  - Passage à un `<form>` (submit via Enter).

### Comportement
- Aucun changement fonctionnel des flows (Google / email+mdp / logout).
- Meilleure UX: feedback immédiat en chargement, erreurs plus compréhensibles, meilleure accessibilité (role=alert, autocomplete).

## 2026-02-15 — Auth Firebase + Firestore clients/retraits

## 2026-02-15 — Routing login-first + app protégée

### Objectif
- Arrivée par défaut sur `/login`.
- L'application (calcul / clients / retraits) est déplacée sous `/app` et **protégée** par middleware.

### Ajouts / modifications
- **Ajout** `src/app/login/page.tsx` (page dédiée login, réutilise `AuthBar`).
- **Ajout** `src/app/app/page.tsx` (UI existante de calcul déplacée ici, inchangée visuellement).
- **Modif** `src/app/page.tsx` (redirect `/` -> `/app` si cookie de session, sinon `/login`).
- **Ajout** `middleware.ts` (garde d'accès: autorise `/login`, `/api/auth/*`, `/_next/*`, et assets; redirige sinon vers `/login`).

### Comportement
- Sans cookie de session: toute route (sauf exceptions) redirige vers `/login`.
- Avec cookie de session: accès normal à `/app` et reste de l'app.

### Ajouts
- Auth Firebase (Google + Email/Password) côté client avec création de session cookie HttpOnly côté serveur.
- Modèle Firestore `users/{uid}/clients/{clientId}/withdrawals/{withdrawalId}`.
- Champ "Client" (référence) dans le formulaire avec auto-suggest (prefix) et bouton "Reprendre le dernier retrait".
- Enregistrement best-effort d’un document withdrawal à chaque calcul (si connecté).

### Fichiers modifiés / ajoutés
- **Ajout** `.env.example`
- **Ajout** `firestore.rules`
- **Ajout** `src/lib/firebase/client.ts`
- **Ajout** `src/lib/firebase/server.ts`
- **Ajout** `src/lib/auth/session.ts`
- **Ajout** `src/app/api/auth/login/route.ts`
- **Ajout** `src/app/api/auth/logout/route.ts`
- **Ajout** `src/app/api/auth/me/route.ts`
- **Ajout** `src/lib/clients/normalize.ts`
- **Ajout** `src/lib/clients/types.ts`
- **Ajout** `src/lib/clients/firestore.ts`
- **Ajout** `src/components/AuthBar.tsx`
- **Modif** `src/app/page.tsx`
- **Modif** `src/components/PEAForm.tsx`
- **Modif** `tsconfig.json` (exclusion des `*.test.ts` du typecheck build)

### Notes
- Pour éviter de casser `next build` sans variables d’env, l’initialisation Firebase client est conditionnelle (affiche "Firebase non configuré" si absent).
- Les calculs restent utilisables hors connexion; seule la persistance Firestore est désactivée.
