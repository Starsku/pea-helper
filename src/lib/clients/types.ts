import type { GainResult } from "@/lib/engine/types";

export type WithdrawalInputSnapshot = {
  dateOuverture: string;
  vlTotale: number;
  montantRetraitActuel: number;
  events: unknown[]; // stored as-is; UI enforces shape
};

export type WithdrawalResultSnapshot = Pick<
  GainResult,
  "assietteGain" | "montantPS" | "netVendeur" | "repartitionTaxes" | "detailsParPeriode" | "capitalInitial" | "retraitsPassesDetails"
>;

export type WithdrawalDoc = {
  clientRefRaw: string;
  clientId: string;

  input: WithdrawalInputSnapshot;
  result: WithdrawalResultSnapshot;

  createdAt: unknown; // serverTimestamp
};
