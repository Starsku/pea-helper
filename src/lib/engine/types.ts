import { TaxRates } from "../tax-rates";

export interface HistoricalVL {
  date: string; // ISO string
  vl: number;
}

export interface PEA {
  dateOuverture: Date | string;
  valeurLiquidative: number;
  totalVersements: number;
  vlsHistoriques?: HistoricalVL[];
}

export interface PeriodDetail {
  periodLabel: string;
  gain: number;
  rates: TaxRates;
  taxes: TaxRates;
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
  detailsParPeriode?: PeriodDetail[];
  repartitionTaxes?: TaxRates;
}
