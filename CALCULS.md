# Documentation des calculs PEA Helper

## 📐 Formules de calcul

### 1. Gain global
```
Gain Global = Valeur Liquidative - Total Versements
```

**Exemple :**
- VL = 15 000 €
- Versements = 10 000 €
- **Gain Global = 5 000 €**

### 2. Gain proportionnel au retrait
```
Gain sur Retrait = (Montant Retrait ÷ Valeur Liquidative) × Gain Global
```

**Exemple :**
- Retrait = 5 000 €
- VL = 15 000 €
- Gain Global = 5 000 €
- **Gain sur Retrait = (5 000 ÷ 15 000) × 5 000 = 1 666,67 €**

### 3. Assiette des prélèvements sociaux
```
Assiette PS = MAX(0, Gain sur Retrait)
```

Si le PEA est en perte, l'assiette est 0 (pas de taxation sur les pertes).

### 4. Prélèvements sociaux (V1)
```
PS = Assiette PS × Taux PS ÷ 100
```

**V1 : Taux flat 17.2%** (cas simplifié)

**Exemple :**
- Assiette = 1 666,67 €
- Taux = 17.2%
- **PS = 1 666,67 × 0,172 = 286,67 €**

### 5. Net vendeur
```
Net Vendeur = Montant Retrait - Prélèvements Sociaux
```

**Exemple :**
- Retrait = 5 000 €
- PS = 286,67 €
- **Net Vendeur = 4 713,33 €**

## 🇫🇷 Fiscalité PEA en France

### Règles générales

#### PEA de moins de 5 ans
- **Prélèvements sociaux** : 17,2% sur les gains
- **Impôt sur le revenu** : 12,8% (Flat Tax) OU Barème progressif (au choix)
- **Clôture automatique** en cas de retrait

#### PEA de plus de 5 ans
- **Prélèvements sociaux** : 17,2% sur les gains (taux actuel)
- **Impôt sur le revenu** : **EXONÉRATION** ✅
- **Retraits possibles** sans clôture

### Taux historiques de prélèvements sociaux

Les taux ont évolué au fil du temps :

| Période | Taux PS |
|---------|---------|
| Depuis 2018 | **17,2%** |
| 2015 - 2017 | 15,5% |
| 2012 - 2014 | 15,5% |
| 2011 | 13,5% |
| 2009 - 2010 | 12,3% |
| Avant 2009 | 11,0% |

**⚠️ Note V1 :** L'application utilise uniquement le taux flat de **17.2%** pour simplifier.

Les taux historiques seront implémentés en V2 pour les PEA anciens.

### Cas particuliers (non gérés en V1)

#### Retraits partiels sur PEA > 5 ans avant 2018
Pour un PEA ouvert avant 2018 et ayant plus de 5 ans, le calcul des PS doit se faire **année par année** sur les gains réalisés chaque année, avec le taux en vigueur cette année-là.

**Exemple complexe (V2) :**
- PEA ouvert en 2010
- Gains réalisés :
  - 2010-2014 : 2 000 € (taux variable selon années)
  - 2015-2017 : 3 000 € (taux 15,5%)
  - 2018-2024 : 5 000 € (taux 17,2%)

Le calcul doit appliquer le bon taux à chaque tranche de gains.

## 🧮 Précision des calculs

### Utilisation de Decimal.js

JavaScript utilise des nombres à virgule flottante (IEEE 754) qui peuvent entraîner des erreurs de précision :

```javascript
// ❌ Problème avec les flottants JavaScript
0.1 + 0.2 === 0.30000000000000004 // true !
```

Pour éviter ces erreurs en finance, nous utilisons **Decimal.js** :

```typescript
// ✅ Précision exacte avec Decimal.js
new Decimal('0.1').plus('0.2').equals('0.3') // true
```

### Arrondis

Tous les montants en euros sont arrondis à **2 décimales** (centimes).

Méthode d'arrondi : **Arrondi au plus proche** (banquier)

## 📊 Exemples détaillés

### Exemple 1 : PEA récent en gain

**Données :**
- Date ouverture : 01/01/2022 (< 5 ans)
- VL : 12 000 €
- Versements : 10 000 €
- Retrait : 3 000 €

**Calculs :**
1. Gain global = 12 000 - 10 000 = **2 000 €**
2. Gain sur retrait = (3 000 ÷ 12 000) × 2 000 = **500 €**
3. Assiette PS = **500 €**
4. PS = 500 × 17,2% = **86 €**
5. Net vendeur = 3 000 - 86 = **2 914 €**

### Exemple 2 : PEA ancien en gain

**Données :**
- Date ouverture : 01/01/2015 (> 5 ans)
- VL : 25 000 €
- Versements : 20 000 €
- Retrait : 10 000 €

**Calculs :**
1. Gain global = 25 000 - 20 000 = **5 000 €**
2. Gain sur retrait = (10 000 ÷ 25 000) × 5 000 = **2 000 €**
3. Assiette PS = **2 000 €**
4. PS = 2 000 × 17,2% = **344 €** (V1 : taux flat)
5. Net vendeur = 10 000 - 344 = **9 656 €**

**Note :** En V2, le calcul sera plus complexe avec les taux historiques.

### Exemple 3 : PEA en perte

**Données :**
- Date ouverture : 01/01/2023
- VL : 7 500 €
- Versements : 10 000 €
- Retrait : 2 000 €

**Calculs :**
1. Gain global = 7 500 - 10 000 = **-2 500 €** (perte)
2. Gain sur retrait = (2 000 ÷ 7 500) × (-2 500) = **-666,67 €**
3. Assiette PS = MAX(0, -666,67) = **0 €**
4. PS = **0 €** (pas de taxation sur les pertes)
5. Net vendeur = 2 000 - 0 = **2 000 €**

## 🔗 Ressources officielles

- [Service Public - PEA](https://www.service-public.fr/particuliers/vosdroits/F2385)
- [Impots.gouv.fr - Fiscalité de l'épargne](https://www.impots.gouv.fr/)
- [AMF - Guide du PEA](https://www.amf-france.org/)

---

**Dernière mise à jour :** Février 2026 (V1)
