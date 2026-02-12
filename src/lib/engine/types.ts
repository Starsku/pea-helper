import { TaxRates } from "../tax-rates";

export type EventType = 'VERSEMENT' | 'RETRAIT' | 'VL_PIVOT';

export interface PEAEvent {
  id: string;
  type: EventType;
  date: string; // ISO string
  montant?: number; // Pour Versement et Retrait
  vl?: number; // Pour Retrait (VL à la date du retrait) et VL_PIVOT
}

export interface HistoricalVL {
  date: string; // ISO string
  vl: number;
}

export interface PEA {
  dateOuverture: Date | string;
  valeurLiquidative: number; // VL Actuelle
  totalVersements: number; // Somme des versements (utile pour compatibilité descendante ou vérif)
  events: PEAEvent[];
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
  
  // Nouveaux champs pour v4.0.0
  capitalInitial: number;
  capitalRestant: number;
  cumulVersementsRembourses: number;
  cumulRetraitsPasses: number;
}
