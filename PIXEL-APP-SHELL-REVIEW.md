# PIXEL-APP-SHELL-REVIEW

Date: 2026-02-15

## Objectif
Aligner l’app-shell (/app) sur des conventions SaaS/Google : header propre + user menu en haut à droite, et suppression des blocs intrusifs "Connecté" dans le contenu.

## Avant
- `/app` affichait un gros bloc **AuthBar** dans le contenu (card "Connecté" + bouton Déconnexion) lorsque l’utilisateur était authentifié.
- L’état de connexion prenait de la place dans la colonne principale.
- Pas de **user menu** standard dans un header.

## Après
- `/app` : ajout d’un **header sticky** discret (fond translucide + border) avec **UserMenu top-right**.
  - Affiche une pastille avatar (initiale) + email tronqué.
  - Dropdown : email complet + action **Déconnexion**.
- Suppression du rendu AuthBar en mode authentifié (AuthBar devient silencieux quand `user` existe).
- `/login` inchangé : reste une single-card cohérente (AuthBar continue de gérer la connexion).

## Captures
Non générées automatiquement dans ce run (à faire via navigateur si besoin).

## Notes techniques
- Le flow auth n’est pas modifié : logout appelle `/api/auth/logout` puis `firebase signOut()`, et redirige vers `/login`.
- Le redirect post-login reste géré par AuthBar (cookie session + `next` param).
