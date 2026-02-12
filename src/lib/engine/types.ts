export interface PEA {
  dateOuverture: Date | string;
  valeurLiquidative: number;
  totalVersements: number;
}

export interface GainResult {
  montantRetrait: number;
  gainTotal: number;
  assietteGain: number;
  tauxPS: number;
  montantPS: number;
  netVendeur: number;
  agePEA: number;
  casSimple: boolean;
}
