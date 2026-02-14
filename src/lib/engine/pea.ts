import Big from 'big.js';
import {
  calculateGain as calculateGainBig,
  PS_RATE,
  type ResultatCalcul,
} from '@/lib/pea-engine';
import type { PEA, GainResult } from '@/lib/engine/types';

export { PS_RATE };

function toNumber(x: unknown): number {
  const n = typeof x === 'string' ? Number(x) : (x as number);
  if (!Number.isFinite(n)) throw new Error('Nombre invalide');
  return n;
}

export function calculateGain(
  pea: PEA,
  montantRetrait: number
): GainResult {
  const vl = toNumber(pea.valeurLiquidative);
  const versements = toNumber(pea.totalVersements);
  const retrait = toNumber(montantRetrait);

  const dateOuverture =
    pea.dateOuverture instanceof Date
      ? pea.dateOuverture
      : new Date(pea.dateOuverture);

  const agePEA = Math.max(
    0,
    Math.floor(
      (Date.now() - dateOuverture.getTime()) / (365.25 * 24 * 3600 * 1000)
    )
  );

  const res: ResultatCalcul = calculateGainBig(
    {
      dateOuverture,
      valeurLiquidationTotale: new Big(vl),
      totalVersements: new Big(versements),
    },
    {
      montantRetrait: new Big(retrait),
    }
  );

  // Mapping V1 (cas simple uniquement)
  const gainTotal = new Big(vl).minus(new Big(versements)).toNumber();

  return {
    montantRetrait: retrait,
    gainTotal,
    assietteGain: res.gainBrut.toNumber(),
    tauxPS: PS_RATE.toNumber(),
    montantPS: res.prelevementsSociaux.toNumber(),
    netVendeur: res.netVerse.toNumber(),
    agePEA,
    casSimple: true,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPourcent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value);
}
