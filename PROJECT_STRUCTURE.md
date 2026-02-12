# Structure du Projet PEA Helper V1

## 📁 Arborescence

```
pea-helper/
├── app/
│   ├── globals.css          # Styles Tailwind globaux
│   ├── layout.tsx            # Layout racine Next.js
│   └── page.tsx              # Page principale avec formulaire
│
├── components/
│   └── ui/
│       ├── card.tsx          # Composant Card
│       ├── input.tsx         # Composant Input
│       └── button.tsx        # Composant Button
│
├── lib/
│   └── engine/
│       ├── types.ts          # Interfaces TypeScript
│       ├── calculator.ts     # Moteur de calcul
│       └── index.ts          # Exports centralisés
│
│   └── __tests__/            # (optionnel)
│       └── calculator.test.ts
│
├── public/                   # Assets statiques Next.js
├── node_modules/             # Dépendances (ignoré par Git)
│
├── .gitignore
├── CALCULS.md                # Documentation des calculs
├── README.md                 # Guide utilisateur
├── package.json
├── tsconfig.json             # Config TypeScript (strict mode)
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## 🎯 Fichiers Clés

### Moteur de Calcul
- **`lib/engine/types.ts`** : Définit les interfaces `PEA`, `GainResult`, etc.
- **`lib/engine/calculator.ts`** : Implémente `calculateGain()` et les helpers
- **`lib/engine/index.ts`** : Point d'entrée pour les imports

### Interface Utilisateur
- **`app/page.tsx`** : Page principale avec formulaire et résultats
- **`components/ui/*`** : Composants réutilisables (Card, Input, Button)

### Documentation
- **`README.md`** : Installation, utilisation, exemples
- **`CALCULS.md`** : Explications détaillées des formules de calcul

## 🛠️ Technologies

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Decimal.js** (précision financière)
- **React 19**

## 📝 Prochaines Étapes (V2)

1. Tests unitaires avec Jest
2. Implémentation des taux historiques
3. Export PDF des calculs
4. Optimisation des retraits
5. Déploiement sur Vercel
