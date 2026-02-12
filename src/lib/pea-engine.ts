import Big from 'big.js';

/**
 * Types de base pour le PEA
 */
export interface PEA {
  dateOuverture: Date;
  valeurLiquidationTotale: Big;
  totalVersements: Big;
}

/**
 * Paramètres d'un retrait
 */
export interface Retrait {
  montantRetrait: Big;
}

/**
 * Résultat du calcul des prélèvements sociaux
 */
export interface ResultatCalcul {
  montantRetrait: Big;
  capitalRembourse: Big;
  gainBrut: Big;
  prelevementsSociaux: Big; // 17.2% pour le cas simple
  netVerse: Big;
}

/**
 * Taux de prélèvements sociaux actuel (Flat Tax)
 */
export const PS_RATE = new Big('0.172');

/**
 * Calcule le gain imposable sur un retrait PEA (Méthode simple / Flat Tax)
 * Formule : Gain = Montant Retrait × (VL Totale - Total Versements) / VL Totale
 * 
 * @param pea État actuel du PEA
 * @param retrait Détails du retrait
 * @returns Résultat détaillé du calcul
 */
export function calculateGain(pea: PEA, retrait: Retrait): ResultatCalcul {
  const { valeurLiquidationTotale, totalVersements } = pea;
  const { montantRetrait } = retrait;

  // Si la VL est nulle ou négative (cas théorique), on ne peut pas calculer
  if (valeurLiquidationTotale.lte(0)) {
    return {
      montantRetrait,
      capitalRembourse: montantRetrait,
      gainBrut: new Big(0),
      prelevementsSociaux: new Big(0),
      netVerse: montantRetrait,
    };
  }

  // Calcul du gain brut proratisé
  // Formule : G = R * (VL - V) / VL
  const gainBrut = montantRetrait
    .times(valeurLiquidationTotale.minus(totalVersements))
    .div(valeurLiquidationTotale);

  // Le gain brut ne peut pas être négatif pour le calcul des PS (moins-value)
  const gainBrutFinal = gainBrut.lt(0) ? new Big(0) : gainBrut;

  // Calcul des prélèvements sociaux (17.2%)
  const prelevementsSociaux = gainBrutFinal.times(PS_RATE).round(2, Big.roundHalfUp);

  // Capital remboursé = Montant Retrait - Gain Brut
  const capitalRembourse = montantRetrait.minus(gainBrutFinal);

  // Net versé = Montant Retrait - PS
  const netVerse = montantRetrait.minus(prelevementsSociaux);

  return {
    montantRetrait,
    capitalRembourse,
    gainBrut: gainBrutFinal,
    prelevementsSociaux,
    netVerse,
  };
}
