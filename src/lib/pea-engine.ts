import Big from 'big.js';
import { PEA, GainResult, PEAEvent, PeriodDetail } from './engine/types';
import { HISTORICAL_TAX_RATES, TaxRates } from './tax-rates';

/**
 * Taux de prélèvements sociaux actuel (2026+)
 */
export const FLAT_TAX_RATE = 0.186;

/**
 * Moteur de calcul PEA V4 - Replay Chronologique
 */
export function calculatePEAGain(pea: PEA, retraitActuelMontant: number): GainResult {
  const dateOuverture = typeof pea.dateOuverture === 'string' 
    ? new Date(pea.dateOuverture) 
    : pea.dateOuverture;
  
  const now = new Date();
  const ageInYears = (now.getTime() - dateOuverture.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  // Trier les événements par date
  const events = [...pea.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Variables d'état pour le replay
  let cumulVersements = new Big(0);
  let capitalRestant = new Big(0);
  let cumulVersementsRembourses = new Big(0);
  let cumulRetraitsPasses = new Big(0);

  // On suit le "stock" de gains par période fiscale
  // Map<PeriodLabel, BigValue>
  let gainsParPeriodeMap: Map<string, Big> = new Map();

  // Initialisation des gains par période
  HISTORICAL_TAX_RATES.forEach(p => {
    gainsParPeriodeMap.set(`${p.start.toISOString()}`, new Big(0));
  });

  let lastVL = new Big(0);
  let lastEventDate = dateOuverture;

  // REPLAY CHRONOLOGIQUE
  for (const event of events) {
    const eventDate = new Date(event.date);
    
    // 1. Avant de traiter l'événement, on répartit le gain latent depuis le dernier événement
    // (si c'est un retrait ou une VL_PIVOT, on connaît la VL)
    if (event.vl !== undefined) {
      const currentVL = new Big(event.vl);
      const gainTotalDepuisDernier = currentVL.minus(lastVL).minus(event.type === 'VERSEMENT' ? (event.montant || 0) : 0);
      // Note: Si c'est un versement, le gain se calcule AVANT le versement.
      
      const gainReel = event.type === 'VERSEMENT' 
        ? currentVL.minus(event.montant || 0).minus(lastVL)
        : currentVL.minus(lastVL);

      if (gainReel.gt(0)) {
         distributeGain(gainReel, lastEventDate, eventDate, gainsParPeriodeMap);
      }
      lastVL = currentVL;
    }

    // 2. Traiter l'événement
    if (event.type === 'VERSEMENT') {
      const m = new Big(event.montant || 0);
      cumulVersements = cumulVersements.plus(m);
      capitalRestant = capitalRestant.plus(m);
      // Si pas de VL fournie pour le versement, on suppose que la VL augmente du montant
      if (event.vl === undefined) {
        lastVL = lastVL.plus(m);
      }
    } else if (event.type === 'RETRAIT') {
      const m = new Big(event.montant || 0);
      const currentVL = new Big(event.vl || lastVL);
      
      // Calcul du prorata pour ce retrait passé
      // Part de capital remboursé = Retrait * (Capital Restant / VL Totale)
      let partCapital = new Big(0);
      if (currentVL.gt(0)) {
        partCapital = m.times(capitalRestant).div(currentVL);
        if (partCapital.gt(capitalRestant)) partCapital = capitalRestant;
      }
      
      capitalRestant = capitalRestant.minus(partCapital);
      cumulVersementsRembourses = cumulVersementsRembourses.plus(partCapital);
      cumulRetraitsPasses = cumulRetraitsPasses.plus(m);

      // Le gain consommé par ce retrait doit être déduit des stocks de gains par période
      const gainConsomme = m.minus(partCapital);
      if (gainConsomme.gt(0)) {
        consumeGains(gainConsomme, gainsParPeriodeMap);
      }

      lastVL = currentVL.minus(m);
    }
    
    lastEventDate = eventDate;
  }

  // FINALISATION : De la dernière date d'événement à AUJOURD'HUI
  const finalVL = new Big(pea.valeurLiquidative);
  const finalGainLatent = finalVL.minus(lastVL);
  if (finalGainLatent.gt(0)) {
    distributeGain(finalGainLatent, lastEventDate, now, gainsParPeriodeMap);
  }

  // CALCUL DU RETRAIT ACTUEL
  const retraitActuel = new Big(retraitActuelMontant);
  let partCapitalActuel = new Big(0);
  if (finalVL.gt(0)) {
    partCapitalActuel = retraitActuel.times(capitalRestant).div(finalVL);
    if (partCapitalActuel.gt(capitalRestant)) partCapitalActuel = capitalRestant;
  }

  const assietteGainActuel = retraitActuel.minus(partCapitalActuel);
  
  // Calcul des taxes sur l'assiette actuelle en consommant les stocks (sans les modifier car c'est une simulation de retrait)
  const resultTaxes = calculateTaxesFromStocks(assietteGainActuel, gainsParPeriodeMap);

  return {
    montantRetrait: retraitActuelMontant,
    gainTotal: finalVL.minus(capitalRestant).toNumber(),
    assietteGain: assietteGainActuel.toNumber(),
    tauxPS: assietteGainActuel.gt(0) ? resultTaxes.totalTaxes.toNumber() / assietteGainActuel.toNumber() : FLAT_TAX_RATE,
    montantPS: resultTaxes.totalTaxes.toNumber(),
    netVendeur: retraitActuel.minus(resultTaxes.totalTaxes).toNumber(),
    agePEA: ageInYears,
    casSimple: dateOuverture >= new Date('2026-01-01'),
    detailsParPeriode: resultTaxes.details,
    repartitionTaxes: resultTaxes.repartition,
    capitalInitial: cumulVersements.toNumber(),
    capitalRestant: capitalRestant.toNumber(),
    cumulVersementsRembourses: cumulVersementsRembourses.toNumber(),
    cumulRetraitsPasses: cumulRetraitsPasses.toNumber()
  };
}

/**
 * Répartit un gain brut sur les périodes fiscales entre deux dates
 */
function distributeGain(gain: Big, start: Date, end: Date, stocks: Map<string, Big>) {
  const totalDuration = end.getTime() - start.getTime();
  if (totalDuration <= 0) return;

  HISTORICAL_TAX_RATES.forEach(period => {
    const pStart = period.start;
    const pEnd = period.end || new Date();

    const overlapStart = start > pStart ? start : pStart;
    const overlapEnd = end < pEnd ? end : pEnd;

    if (overlapStart < overlapEnd) {
      const overlapDuration = overlapEnd.getTime() - overlapStart.getTime();
      const ratio = new Big(overlapDuration).div(totalDuration);
      const gainAllocated = gain.times(ratio);
      
      const current = stocks.get(pStart.toISOString()) || new Big(0);
      stocks.set(pStart.toISOString(), current.plus(gainAllocated));
    }
  });
}

/**
 * Consomme les gains accumulés (FIFO ou proportionnel ? La règle fiscale est complexe, 
 * souvent proportionnelle à la masse. Ici on va utiliser une consommation proportionnelle 
 * aux stocks existants pour refléter l'érosion globale.)
 */
function consumeGains(gainToConsume: Big, stocks: Map<string, Big>) {
  const totalStocks = Array.from(stocks.values()).reduce((acc, val) => acc.plus(val), new Big(0));
  if (totalStocks.lte(0)) return;

  for (const [key, value] of stocks.entries()) {
    const ratio = value.div(totalStocks);
    const toSubtract = gainToConsume.times(ratio);
    stocks.set(key, value.minus(toSubtract));
  }
}

/**
 * Calcule les taxes en fonction des stocks disponibles (simulation de retrait)
 */
function calculateTaxesFromStocks(assiette: Big, stocks: Map<string, Big>) {
  const totalStocks = Array.from(stocks.values()).reduce((acc, val) => acc.plus(val), new Big(0));
  const details: PeriodDetail[] = [];
  const repartition: TaxRates = { csg: 0, crds: 0, ps: 0, caps: 0, crsa: 0, psol: 0, total: 0 };
  let totalTaxes = new Big(0);

  if (totalStocks.lte(0)) {
    // Si pas de gains historiques, on applique le taux plat
    const tax = assiette.times(FLAT_TAX_RATE).round(2);
    return {
      totalTaxes: tax,
      details: [],
      repartition: { ...repartition, total: tax.toNumber(), ps: tax.toNumber() } // simplif
    };
  }

  HISTORICAL_TAX_RATES.forEach(period => {
    const stock = stocks.get(period.start.toISOString()) || new Big(0);
    if (stock.lte(0)) return;

    // Prorata du stock pour l'assiette de retrait demandée
    const gainPeriodeProratise = stock.times(assiette).div(totalStocks);

    const periodTaxes: TaxRates = {
      csg: gainPeriodeProratise.times(period.rates.csg / 100).round(2).toNumber(),
      crds: gainPeriodeProratise.times(period.rates.crds / 100).round(2).toNumber(),
      ps: gainPeriodeProratise.times(period.rates.ps / 100).round(2).toNumber(),
      caps: gainPeriodeProratise.times(period.rates.caps / 100).round(2).toNumber(),
      crsa: gainPeriodeProratise.times(period.rates.crsa / 100).round(2).toNumber(),
      psol: gainPeriodeProratise.times(period.rates.psol / 100).round(2).toNumber(),
      total: 0
    };

    const sumTaxes = Object.values(periodTaxes).reduce((a, b) => a + b, 0);
    periodTaxes.total = Number(sumTaxes.toFixed(2));
    totalTaxes = totalTaxes.plus(periodTaxes.total);

    repartition.csg += periodTaxes.csg;
    repartition.crds += periodTaxes.crds;
    repartition.ps += periodTaxes.ps;
    repartition.caps += periodTaxes.caps;
    repartition.crsa += periodTaxes.crsa;
    repartition.psol += periodTaxes.psol;

    details.push({
      periodLabel: `${formatDate(period.start)} - ${period.end ? formatDate(period.end) : 'Auj.'}`,
      gain: gainPeriodeProratise.toNumber(),
      rates: period.rates,
      taxes: periodTaxes
    });
  });

  repartition.total = totalTaxes.toNumber();

  return { totalTaxes, details, repartition };
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR');
}
