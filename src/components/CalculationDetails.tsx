import React from "react";
import { GainResult, PEA } from "@/lib/engine/types";

interface CalculationDetailsProps {
  result: GainResult;
  input: PEA;
}

export default function CalculationDetails({ result, input }: CalculationDetailsProps) {
  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
          <span className="mr-2">🔍</span> Comment ce résultat a été calculé ?
        </h3>
        
        <div className="space-y-6">
          {/* Étape 1 */}
          <section className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
            <h4 className="text-sm font-bold text-indigo-700 uppercase mb-2">Étape 1 : Calcul du Gain Net Global</h4>
            <p className="text-slate-600 text-sm mb-2">
              On détermine d'abord la plus-value globale latente sur l'ensemble du plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2 bg-slate-50 rounded font-mono text-sm">
              <div className="text-center">
                <div className="text-slate-500 text-xs">VL Totale</div>
                <div className="font-bold">{input.valeurLiquidative.toLocaleString('fr-FR')} €</div>
              </div>
              <div className="text-2xl text-slate-300">−</div>
              <div className="text-center">
                <div className="text-slate-500 text-xs">Total Versements</div>
                <div className="font-bold">{input.totalVersements.toLocaleString('fr-FR')} €</div>
              </div>
              <div className="text-2xl text-slate-300">=</div>
              <div className="text-center px-4 py-1 bg-green-100 rounded text-green-800">
                <div className="text-green-600 text-xs">Gain Latent</div>
                <div className="font-bold">{(input.valeurLiquidative - input.totalVersements).toLocaleString('fr-FR')} €</div>
              </div>
            </div>
          </section>

          {/* Étape 2 */}
          <section className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
            <h4 className="text-sm font-bold text-indigo-700 uppercase mb-2">Étape 2 : Détermination de l'Assiette Taxable</h4>
            <p className="text-slate-600 text-sm mb-2">
              Le retrait est composé d'une part de capital (non taxée) et d'une part de gain (taxée).
              La part de gain est proportionnelle au gain total du plan.
            </p>
            <div className="p-3 bg-slate-50 rounded font-mono text-sm space-y-2">
              <div className="flex justify-between">
                <span>Part de Gain dans le plan :</span>
                <span className="font-bold text-indigo-600">{((result.gainTotal / input.valeurLiquidative) * 100).toFixed(2)} %</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-2">
                <div className="text-slate-600">
                  {result.montantRetrait.toLocaleString('fr-FR')} € (Retrait) × {((result.gainTotal / input.valeurLiquidative) * 100).toFixed(2)} %
                </div>
                <div className="text-lg font-bold text-indigo-800">
                  = {result.assietteGain.toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>
          </section>

          {/* Étape 3 (Si historique) */}
          {result.detailsParPeriode && result.detailsParPeriode.length > 0 && (
            <section className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
              <h4 className="text-sm font-bold text-indigo-700 uppercase mb-2">Étape 3 : Ventilation par période (Taux Historiques)</h4>
              <p className="text-slate-600 text-sm mb-3">
                Votre PEA ayant plus de 5 ans et ayant été ouvert avant 2018, il bénéficie de la règle des taux historiques. 
                Le gain est réparti au prorata des VL saisies pour chaque période fiscale.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-100">
                      <th className="py-2 text-indigo-900">Période</th>
                      <th className="py-2 text-right text-indigo-900">Gain de la période</th>
                      <th className="py-2 text-right text-indigo-900">Taux appliqué</th>
                      <th className="py-2 text-right text-indigo-900">Prélèvements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {result.detailsParPeriode.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2 text-slate-600">{p.periodLabel}</td>
                        <td className="py-2 text-right font-mono">{p.gain.toLocaleString('fr-FR')} €</td>
                        <td className="py-2 text-right text-slate-500">{p.rates.total}%</td>
                        <td className="py-2 text-right font-semibold text-red-500">-{p.taxes.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Étape 4 & 5 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
              <h4 className="text-sm font-bold text-indigo-700 uppercase mb-2">Étape 4 : Total des Contributions</h4>
              <div className="text-2xl font-bold text-red-600">
                {result.montantPS.toLocaleString('fr-FR')} €
              </div>
              <p className="text-xs text-slate-500 mt-1 italic">
                Somme des prélèvements calculés sur chaque période.
              </p>
            </div>
            <div className="bg-green-600 p-4 rounded-lg shadow-md text-white">
              <h4 className="text-sm font-bold uppercase mb-2 opacity-90">Étape 5 : Net à percevoir</h4>
              <div className="text-2xl font-bold">
                {result.netVendeur.toLocaleString('fr-FR')} €
              </div>
              <p className="text-xs mt-1 opacity-80 italic">
                Retrait Brut ({result.montantRetrait.toLocaleString('fr-FR')} €) − Taxes
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
