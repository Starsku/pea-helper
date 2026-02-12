"use client";

import { HISTORICAL_TAX_RATES } from "@/lib/tax-rates";

export default function TaxHistoryTable() {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 overflow-hidden mt-12">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
        Historique des Taux de Prélèvements Sociaux
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400 font-black border-b border-slate-50">
              <th className="pb-4">Période</th>
              <th className="pb-4 text-center">CSG</th>
              <th className="pb-4 text-center">CRDS</th>
              <th className="pb-4 text-center">PS</th>
              <th className="pb-4 text-center">CAPS</th>
              <th className="pb-4 text-center">CRSA</th>
              <th className="pb-4 text-center">PSOL</th>
              <th className="pb-4 text-right">Taux Global</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {HISTORICAL_TAX_RATES.map((period, i) => (
              <tr key={i} className="group hover:bg-slate-50/50 transition-colors text-sm">
                <td className="py-3 font-medium text-slate-700">
                  {period.start.toLocaleDateString('fr-FR')} - {period.end && period.end.getFullYear() < 2099 ? period.end.toLocaleDateString('fr-FR') : "Auj."}
                </td>
                <td className="py-3 text-center text-slate-500">{period.rates.csg}%</td>
                <td className="py-3 text-center text-slate-500">{period.rates.crds}%</td>
                <td className="py-3 text-center text-slate-500">{period.rates.ps}%</td>
                <td className="py-3 text-center text-slate-500">{period.rates.caps}%</td>
                <td className="py-3 text-center text-slate-500">{period.rates.crsa}%</td>
                <td className="py-3 text-center text-slate-500">{period.rates.psol}%</td>
                <td className="py-3 text-right font-bold text-slate-900">{period.rates.total}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] text-slate-400 italic">
        Source : CFONB / Bulletin Officiel des Finances Publiques. Les taux s'appliquent sur la part de gain générée durant chaque période.
      </p>
    </div>
  );
}
