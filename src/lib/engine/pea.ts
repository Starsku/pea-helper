import Big from 'big.js';
import type { PEA, GainResult } from './types';

const TAUX_PS_ACTUEL = 17.2;

function calculerAgePEA(dateOuverture: Date | string): number {
  const dateOuv = typeof dateOuverture === 'string' ? new Date(dateOuverture) : dateOuverture;
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - dateOuv.getTime();
  return diffMs / (1000 * 60 * 60 * 24 * 365.25);
}

function isCasSimple(dateOuverture: Date | string, agePEA: number): boolean {
  const dateOuv = typeof dateOuverture === 'string' ? new Date(dateOuverture) : dateOuverture;
  const dateSeuilComplexe = new Date('2018-01-01');
  if (agePEA < 5) return true;
  if (dateOuv >= dateSeuilComplexe) return true;
  return false;
}

export function calculateGain(pea: PEA, montantRetrait: number): GainResult {
  Big.DP = 2;
  Big.RM = Big.roundHalfUp;
  const vl = new Big(pea.valeurLiquidative);
  const versements = new Big(pea.totalVersements);
  const retrait = new Big(montantRetrait);
  const gainTotal = vl.minus(versements);
  const assietteGain = retrait.div(vl).times(gainTotal);
  const agePEA = calculerAgePEA(pea.dateOuverture);
  const casSimple = isCasSimple(pea.dateOuverture, agePEA);
  const tauxPS = TAUX_PS_ACTUEL;
  const montantPS = assietteGain.times(tauxPS).div(100);
  const netVendeur = retrait.minus(montantPS);
  return {
    montantRetrait: retrait.toNumber(),
    gainTotal: gainTotal.toNumber(),
    assietteGain: assietteGain.toNumber(),
    tauxPS,
    montantPS: montantPS.toNumber(),
    netVendeur: netVendeur.toNumber(),
    agePEA: Math.round(agePEA * 10) / 10,
    casSimple,
    capitalInitial: versements.toNumber(),
    capitalRestant: versements.toNumber(),
    cumulVersementsRembourses: 0,
    cumulRetraitsPasses: 0
  };
}

export function formatEuro(montant: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
}

export function formatPourcent(pourcent: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(pourcent / 100);
}
