# PEA Helper - V1 MVP

Application Next.js 15 pour calculer les prélèvements sociaux sur les retraits de PEA.

## Fonctionnalités (V1)
- Calcul du gain imposable au prorata du retrait.
- Application du taux fixe de **18.6%** (Flat Tax depuis 2026 / Cas simple).
- Gestion des taux historiques pour les PEA ouverts avant 2026.
- Utilisation de `big.js` pour la précision monétaire.

## Stack Technique
- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS v4
- **Calculs** : Big.js

## Installation

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

## Formule utilisée
```
Gain Brut = Montant Retrait × (VL Totale - Total Versements) / VL Totale
Prélèvements Sociaux = Gain Brut × 18.6%
Net versé = Montant Retrait - Prélèvements Sociaux
```

## Structure
- `src/lib/pea-engine.ts` : Moteur de calcul pur.
- `src/components/PEAForm.tsx` : Interface utilisateur.

## Routing (login-first)
- `/login` : page de connexion (UI via `AuthBar`).
- `/app` : application (simulateur + clients/retraits) — **protégée**.
- `/` : redirige vers `/app` si un cookie de session est présent, sinon vers `/login`.

Protection:
- Un `middleware.ts` bloque tout accès (sauf `/login`, `/api/auth/*`, `/_next/*` et quelques assets) si le cookie de session `SESSION_COOKIE_NAME` est absent.

## Firebase (Auth + Firestore)

### Variables d’environnement
Copier `.env.example` en `.env.local` puis renseigner les variables.

- `NEXT_PUBLIC_FIREBASE_*` : config Firebase côté client (publique).
- `FIREBASE_SERVICE_ACCOUNT_JSON` : **server-only**, ne pas committer.

### Session cookie (recommandé)
Routes API ajoutées:
- `POST /api/auth/login` : échange un `idToken` Firebase contre un cookie de session **HttpOnly**.
- `POST /api/auth/logout` : supprime le cookie.
- `GET /api/auth/me` : retourne l’utilisateur courant (basé sur le cookie).

Le SDK Admin utilise soit:
- `FIREBASE_SERVICE_ACCOUNT_JSON` (recommandé en prod),
- soit les **Application Default Credentials** (ADC) en local/infra.

### Règles Firestore
Le fichier `firestore.rules` est prod-safe: accès uniquement au owner (`request.auth.uid`).

Déploiement (exemple):
```bash
firebase deploy --only firestore:rules
```

### Modèle de données Firestore
- `users/{uid}`
- `users/{uid}/clients/{clientId}`
- `users/{uid}/clients/{clientId}/withdrawals/{withdrawalId}`

`clientId` = référence normalisée (trim + uppercase + suppression des espaces).
