# Pixel UI/UX Review — `feat/auth-firestore`

Date: 2026-02-15

Statut global: **OK** (pas de régression majeure de layout constatée).  
Ajouts UI présents et globalement discrets.

## Contexte de test
- Page testée: `http://localhost:3050/`
- États observés: **Firebase non configuré** (donc AuthBar en mode info + “Se connecter”).
- Viewports:
  - Desktop large (layout 2 colonnes avec Versions à droite)
  - Mobile (≈390px)

## AuthBar (login/logout)
**OK**
- Composant visuellement cohérent avec les cards existantes (mêmes arrondis/ombre/border).
- Alignements propres (label "Compte" + statut à gauche, action à droite).
- En absence de config Firebase, le message **"Firebase non configuré"** est discret et ne casse pas la grille.

Points à surveiller (mineurs):
- Le label d’état **"Se connecter"** peut prêter à confusion quand Firebase n’est pas configuré (mais ce n’est pas une régression de layout).

## Champ Client + autosuggest
**OK (layout)**
- Le champ "Client (référence)" s’intègre correctement dans le bloc Configuration.
- Aucun débordement/chevauchement visible en desktop ou mobile sur les captures.

À vérifier quand autosuggest actif (non observable ici sans données/auth):
- Hauteur/overflow du menu de suggestions (z-index au-dessus des cards, pas coupé par `overflow:hidden`).
- Spacing vertical: que le dropdown n’écrase pas les champs suivants en mobile.

## Bouton “Reprendre le dernier retrait”
**OK (présence + discrétion)**
- Visible sous le champ Client.
- En état désactivé, reste lisible mais discret.

Point mineur (mobile):
- La ligne d’aide sous le champ client (avec "Reprendre le dernier retrait" + texte) paraît un peu **dense** / petite. À vérifier en conditions réelles (quand le bouton devient actif) que l’alignement reste propre.

## Responsive / grille / spacing
**OK**
- Desktop: la colonne Versions reste à droite, sticky, sans chevaucher le contenu principal.
- Mobile: la colonne Versions passe sous le formulaire (comportement attendu). Rien ne “saute”.

Remarque: sur mobile, la card Versions est longue et pousse beaucoup de blanc en bas (normal si le changelog est long; pas lié à auth).

## FR / microcopy
**OK** (pas de fautes évidentes sur les éléments observés)
- "Se connecter", "Firebase non configuré", "Reprendre le dernier retrait" OK.

## Captures (référence)
- Desktop full page: `C:\Users\Admin\.openclaw\media\browser\b8a00293-af80-4166-89de-d76c42b66fc4.jpg`
  - Steps: ouvrir `http://localhost:3050/` (viewport desktop)
- Mobile full page: `C:\Users\Admin\.openclaw\media\browser\0ba51e91-13bc-4aa9-ab54-c68072bf6dce.jpg`
  - Steps: devtools/resize viewport ~390x844, recharger la page

## Conclusion
- **Pas de régression visuelle détectée** sur les états testés.
- Les nouveaux éléments (AuthBar, champ Client, bouton reprise) restent **propres et discrets**.
- Re-test conseillé une fois Firebase configuré + autosuggest alimenté (pour valider dropdown/états chargement/erreur).
