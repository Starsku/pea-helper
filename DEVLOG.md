# DEVLOG

## 2026-02-15 — Auth Firebase + Firestore clients/retraits

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
