/**
 * Taux historiques des prélèvements sociaux applicables au PEA
 * Source : CFONB / Bulletin Officiel des Finances Publiques
 */

export interface TaxRates {
  csg: number;
  crds: number;
  ps: number;    // Prélèvement Social
  caps: number;  // Contribution Additionnelle (CAPS)
  crsa: number;  // Contribution RSA
  psol: number;  // Prélèvement de Solidarité
  total: number;
}

export interface TaxPeriod {
  start: Date;
  end: Date | null; // null signifie "jusqu'à aujourd'hui"
  rates: TaxRates;
}

export const HISTORICAL_TAX_RATES: TaxPeriod[] = [
  {
    // 01/02/1996 - 31/12/1996 : CRDS 0.5%
    start: new Date('1996-02-01'),
    end: new Date('1996-12-31'),
    rates: { csg: 0, crds: 0.5, ps: 0, caps: 0, crsa: 0, psol: 0, total: 0.5 }
  },
  {
    // 01/01/1997 - 31/12/1997 : CSG 3.4% + CRDS 0.5% = 3.9%
    start: new Date('1997-01-01'),
    end: new Date('1997-12-31'),
    rates: { csg: 3.4, crds: 0.5, ps: 0, caps: 0, crsa: 0, psol: 0, total: 3.9 }
  },
  {
    // 01/01/1998 - 30/06/2004 : CSG 7.5% + CRDS 0.5% + PS 2% = 10%
    start: new Date('1998-01-01'),
    end: new Date('2004-06-30'),
    rates: { csg: 7.5, crds: 0.5, ps: 2, caps: 0, crsa: 0, psol: 0, total: 10 }
  },
  {
    // 01/07/2004 - 31/12/2004 : + CAPS 0.3% = 10.3%
    start: new Date('2004-07-01'),
    end: new Date('2004-12-31'),
    rates: { csg: 7.5, crds: 0.5, ps: 2, caps: 0.3, crsa: 0, psol: 0, total: 10.3 }
  },
  {
    // 01/01/2005 - 31/12/2008 : CSG 8.2% + CRDS 0.5% + PS 2% + CAPS 0.3% = 11%
    start: new Date('2005-01-01'),
    end: new Date('2008-12-31'),
    rates: { csg: 8.2, crds: 0.5, ps: 2, caps: 0.3, crsa: 0, psol: 0, total: 11 }
  },
  {
    // 01/01/2009 - 31/12/2010 : + CRSA 1.1% = 12.1%
    start: new Date('2009-01-01'),
    end: new Date('2010-12-31'),
    rates: { csg: 8.2, crds: 0.5, ps: 2, caps: 0.3, crsa: 1.1, psol: 0, total: 12.1 }
  },
  {
    // 01/01/2011 - 30/09/2011 : PS 2.2% = 12.3%
    start: new Date('2011-01-01'),
    end: new Date('2011-09-30'),
    rates: { csg: 8.2, crds: 0.5, ps: 2.2, caps: 0.3, crsa: 1.1, psol: 0, total: 12.3 }
  },
  {
    // 01/10/2011 - 30/06/2012 : PS 3.4% = 13.5%
    start: new Date('2011-10-01'),
    end: new Date('2012-06-30'),
    rates: { csg: 8.2, crds: 0.5, ps: 3.4, caps: 0.3, crsa: 1.1, psol: 0, total: 13.5 }
  },
  {
    // 01/07/2012 - 31/12/2012 : PS 5.4% = 15.5%
    start: new Date('2012-07-01'),
    end: new Date('2012-12-31'),
    rates: { csg: 8.2, crds: 0.5, ps: 5.4, caps: 0.3, crsa: 1.1, psol: 0, total: 15.5 }
  },
  {
    // 01/01/2013 - 31/12/2017 : PS 4.5% + CRSA 0% + PSOL 2% = 15.5%
    // Note: Le taux global reste 15.5% mais la répartition change
    start: new Date('2013-01-01'),
    end: new Date('2017-12-31'),
    rates: { csg: 8.2, crds: 0.5, ps: 4.5, caps: 0.3, crsa: 0, psol: 2, total: 15.5 }
  },
  {
    // 01/01/2018 - 31/12/2025 : CSG 9.2% + CRDS 0.5% + PS 7.5% = 17.2%
    start: new Date('2018-01-01'),
    end: new Date('2025-12-31'),
    rates: { csg: 9.2, crds: 0.5, ps: 7.5, caps: 0, crsa: 0, psol: 0, total: 17.2 }
  },
  {
    // Depuis 01/01/2026 : CSG 10.6% + CRDS 0.5% + PS 7.5% = 18.6%
    start: new Date('2026-01-01'),
    end: new Date('2099-12-31'),
    rates: { csg: 10.6, crds: 0.5, ps: 7.5, caps: 0, crsa: 0, psol: 0, total: 18.6 }
  }
];

/**
 * Dates charnières pour lesquelles l'utilisateur doit fournir la VL
 * pour appliquer les taux historiques.
 */
export const PIVOT_DATES = [
  new Date('1996-01-31'),
  new Date('1996-12-31'),
  new Date('1997-12-31'),
  new Date('2004-06-30'),
  new Date('2004-12-31'),
  new Date('2008-12-31'),
  new Date('2010-12-31'),
  new Date('2012-12-31'),
  new Date('2017-12-31'),
  new Date('2025-12-31')
];
