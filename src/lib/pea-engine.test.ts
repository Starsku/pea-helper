import { calculatePEAGain } from './pea-engine';
import { PEA } from './engine/types';

describe('PEA Engine V2 - Taux Historiques', () => {
  
  test('Cas simple : PEA ouvert après 2026 (Flat Tax 18.6%)', () => {
    const pea: PEA = {
      dateOuverture: '2026-02-01',
      valeurLiquidative: 12000,
      totalVersements: 10000,
    };
    
    const result = calculatePEAGain(pea, 1200);
    
    // Gain global = 2000. Retrait = 10% de la VL. Assiette gain = 200.
    // PS = 200 * 18.6% = 37.20
    expect(result.assietteGain).toBe(200);
    expect(result.montantPS).toBe(37.2);
    expect(result.casSimple).toBe(true);
  });

  test('Cas complexe : PEA ouvert en 2010 (Taux historiques)', () => {
    const pea: PEA = {
      dateOuverture: '2010-01-01',
      valeurLiquidative: 20000,
      totalVersements: 10000,
      vlsHistoriques: [
        { date: '2010-01-01', vl: 10000 },
        { date: '2010-12-31', vl: 11000 }, // +1000 en 2010
        { date: '2017-12-31', vl: 18000 }, // +7000 entre 2011 et 2017
      ]
    };

    const result = calculatePEAGain(pea, 20000); // Retrait total
    
    expect(result.casSimple).toBe(false);
    expect(result.detailsParPeriode).toBeDefined();
    
    // Vérification de la présence de contributions spécifiques
    expect(result.repartitionTaxes?.crsa).toBeGreaterThan(0); // Existait en 2010
    expect(result.repartitionTaxes?.psol).toBeGreaterThan(0); // Existait entre 2013-2017
    
    console.log('Total PS Historique:', result.montantPS);
    console.log('Détail:', JSON.stringify(result.repartitionTaxes, null, 2));
  });

});
