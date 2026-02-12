import Big from 'big.js';
import { PEA, GainResult, HistoricalVL, PeriodDetail } from './engine/types';
import { HISTORICAL_TAX_RATES, TaxRates } from './tax-rates';

/**
 * Taux de prélèvements sociaux actuel
 */
export const FLAT_TAX_RATE = 0.186;

/**
 * Moteur de calcul PEA V2
 */
export function calculatePEAGain(pea: PEA, retraitMontant: number): GainResult {
  const dateOuverture = typeof pea.dateOuverture === 'string' 
    ? new Date(pea.dateOuverture) 
    : pea.dateOuverture;
  
  const now = new Date();
  const ageInYears = (now.getTime() - dateOuverture.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  const vlTotal = new Big(pea.valeurLiquidative);
  const totalVersements = new Big(pea.totalVersements);
  const retrait = new Big(retraitMontant);

  // 1. Calcul de l'assiette du gain (prorata)
  // Assiette = Retrait * (VL - Versements) / VL
  const profitGlobal = vlTotal.minus(totalVersements);
  
  let assietteGain = new Big(0);
  if (vlTotal.gt(0) && profitGlobal.gt(0)) {
    assietteGain = retrait.times(profitGlobal).div(vlTotal);
  }

  // 2. Détermination du mode de calcul (Simple vs Historique)
  // Si ouvert après 01/01/2018 -> On regarde si on applique le taux actuel ou historique
  // Depuis 2026, on a un nouveau taux fixe. 
  // Le mode "simple" s'applique si le PEA est ouvert après le 01/01/2026.
  const isHistorical = dateOuverture < new Date('2026-01-01');

  if (!isHistorical || !pea.vlsHistoriques || pea.vlsHistoriques.length === 0) {
    const montantPS = assietteGain.times(FLAT_TAX_RATE).round(2, Big.roundHalfUp);
    
    return {
      montantRetrait: retraitMontant,
      gainTotal: profitGlobal.toNumber(),
      assietteGain: assietteGain.toNumber(),
      tauxPS: FLAT_TAX_RATE,
      montantPS: montantPS.toNumber(),
      netVendeur: retrait.minus(montantPS).toNumber(),
      agePEA: ageInYears,
      casSimple: true,
      repartitionTaxes: {
        csg: assietteGain.times(0.106).round(2).toNumber(),
        crds: assietteGain.times(0.005).round(2).toNumber(),
        ps: assietteGain.times(0.075).round(2).toNumber(),
        caps: 0,
        crsa: 0,
        psol: 0,
        total: 18.6
      }
    };
  }

  // 3. Calcul complexe avec taux historiques
  return calculateHistoricalGains(pea, retraitMontant, assietteGain, profitGlobal, ageInYears);
}

function calculateHistoricalGains(
  pea: PEA, 
  retraitMontant: number, 
  assietteGainTotal: Big, 
  profitGlobal: Big,
  agePEA: number
): GainResult {
  const vls = [...(pea.vlsHistoriques || [])].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dateOuverture = new Date(pea.dateOuverture);
  
  // Ajouter la VL actuelle à la fin des VL historiques pour fermer la dernière période
  vls.push({
    date: new Date().toISOString(),
    vl: pea.valeurLiquidative
  });

  // On calcule le gain acquis sur chaque période définie par les taux historiques
  const detailsParPeriode: PeriodDetail[] = [];
  const totalTaxes: TaxRates = { csg: 0, crds: 0, ps: 0, caps: 0, crsa: 0, psol: 0, total: 0 };
  
  let lastVL = 0;
  // Trouver la VL de départ (à la date d'ouverture)
  // On considère que la valeur au départ est 0 si non fournie (ou on utilise le cumul des versements de l'époque)
  // Pour simplifier selon l'énoncé, on va se baser sur les gains par tranches de VL fournies.
  
  // Note: Dans un PEA réel, le gain d'une période est (VL Fin - VL Début).
  // Mais ici on doit proratiser ce gain par rapport au retrait actuel.
  // Ratio de retrait = AssietteGainTotal / ProfitGlobal
  const ratioRetrait = profitGlobal.gt(0) ? assietteGainTotal.div(profitGlobal) : new Big(0);

  // On itère sur les périodes de taxes
  HISTORICAL_TAX_RATES.forEach(period => {
    // Si la période finit avant l'ouverture du PEA, on l'ignore
    if (period.end && period.end < dateOuverture) return;

    // Déterminer le début et la fin effective pour ce PEA dans cette période fiscale
    const effectiveStart = period.start < dateOuverture ? dateOuverture : period.start;
    const effectiveEnd = period.end === null ? new Date() : period.end;

    // Trouver les VL correspondant à ces dates dans les saisies utilisateur
    // On cherche la VL la plus proche de effectiveStart et effectiveEnd
    const vlStart = findClosestVL(vls, effectiveStart);
    const vlEnd = findClosestVL(vls, effectiveEnd);

    const gainPeriodeBrut = new Big(vlEnd - vlStart);
    if (gainPeriodeBrut.lte(0)) return;

    // Proratisation du gain de la période pour le retrait actuel
    const gainPeriodeProratise = gainPeriodeBrut.times(ratioRetrait);

    const periodTaxes: TaxRates = {
      csg: gainPeriodeProratise.times(period.rates.csg / 100).round(2, Big.roundHalfUp).toNumber(),
      crds: gainPeriodeProratise.times(period.rates.crds / 100).round(2, Big.roundHalfUp).toNumber(),
      ps: gainPeriodeProratise.times(period.rates.ps / 100).round(2, Big.roundHalfUp).toNumber(),
      caps: gainPeriodeProratise.times(period.rates.caps / 100).round(2, Big.roundHalfUp).toNumber(),
      crsa: gainPeriodeProratise.times(period.rates.crsa / 100).round(2, Big.roundHalfUp).toNumber(),
      psol: gainPeriodeProratise.times(period.rates.psol / 100).round(2, Big.roundHalfUp).toNumber(),
      total: 0
    };

    const sumTaxes = Object.values(periodTaxes).reduce((a, b) => a + b, 0);
    periodTaxes.total = Number(sumTaxes.toFixed(2));

    detailsParPeriode.push({
      periodLabel: `${formatDate(effectiveStart)} - ${formatDate(effectiveEnd)}`,
      gain: gainPeriodeProratise.toNumber(),
      rates: period.rates,
      taxes: periodTaxes
    });

    // Accumulation
    totalTaxes.csg += periodTaxes.csg;
    totalTaxes.crds += periodTaxes.crds;
    totalTaxes.ps += periodTaxes.ps;
    totalTaxes.caps += periodTaxes.caps;
    totalTaxes.crsa += periodTaxes.crsa;
    totalTaxes.psol += periodTaxes.psol;
  });

  const totalPS = Object.values(totalTaxes).reduce((a, b) => a + b, 0);
  totalTaxes.total = Number(totalPS.toFixed(2));

  return {
    montantRetrait: retraitMontant,
    gainTotal: profitGlobal.toNumber(),
    assietteGain: assietteGainTotal.toNumber(),
    tauxPS: totalTaxes.total / assietteGainTotal.toNumber(), // Taux moyen pondéré
    montantPS: totalTaxes.total,
    netVendeur: new Big(retraitMontant).minus(totalTaxes.total).toNumber(),
    agePEA,
    casSimple: false,
    detailsParPeriode,
    repartitionTaxes: totalTaxes
  };
}

function findClosestVL(vls: HistoricalVL[], targetDate: Date): number {
  // On cherche la VL dont la date est la plus proche de targetDate
  // Pour simplifier : on prend la première VL enregistrée dont la date >= targetDate
  // Si aucune, on prend la dernière disponible.
  const targetTs = targetDate.getTime();
  let closest = vls[0];
  let minDiff = Math.abs(new Date(vls[0].date).getTime() - targetTs);

  for (const item of vls) {
    const diff = Math.abs(new Date(item.date).getTime() - targetTs);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }
  return closest.vl;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR');
}
