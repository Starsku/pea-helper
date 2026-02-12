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
