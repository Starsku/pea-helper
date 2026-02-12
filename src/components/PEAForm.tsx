"use client";

import { useState, useEffect } from "react";
import { calculatePEAGain } from "@/lib/pea-engine";
import { GainResult, HistoricalVL } from "@/lib/engine/types";
import { PIVOT_DATES } from "@/lib/tax-rates";
import CalculationDetails from "./CalculationDetails";
import dynamic from "next/dynamic";

// Import dynamique pour éviter les erreurs SSR avec react-pdf
const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-10 bg-slate-200 rounded-lg w-full"></div>
});

export default function PEAForm() {
  const [dateOuverture, setDateOuverture] = useState("2010-01-01");
  const [vlTotale, setVlTotale] = useState("20000");
  const [totalVersements, setTotalVersements] = useState("10000");
  const [montantRetrait, setMontantRetrait] = useState("1000");
  
  const [vlsHistoriques, setVlsHistoriques] = useState<HistoricalVL[]>([]);
  const [result, setResult] = useState<GainResult | null>(null);

  // Déterminer si on est en mode historique
  const isHistoricalMode = new Date(dateOuverture) < new Date('2018-01-01');

  // Initialiser les VL historiques si nécessaire
  useEffect(() => {
    if (isHistoricalMode) {
      const openDate = new Date(dateOuverture);
      const relevantPivots = PIVOT_DATES
        .filter(d => d > openDate)
        .map(d => ({
          date: d.toISOString().split('T')[0],
          vl: Number(totalVersements) // Valeur par défaut
        }));
      
      // Ajouter la date d'ouverture comme première VL
      const initialVL = [{ date: dateOuverture, vl: Number(totalVersements) }, ...relevantPivots];
      setVlsHistoriques(initialVL);
    } else {
      setVlsHistoriques([]);
    }
  }, [isHistoricalMode, dateOuverture]);

  const handleVLChange = (index: number, value: string) => {
    const newVls = [...vlsHistoriques];
    newVls[index].vl = Number(value);
    setVlsHistoriques(newVls);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculatePEAGain({
      dateOuverture,
      valeurLiquidative: Number(vlTotale),
      totalVersements: Number(totalVersements),
      vlsHistoriques
    }, Number(montantRetrait));
    setResult(res);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Paramètres du PEA</h2>
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date d'Ouverture</label>
              <input
                type="date"
                value={dateOuverture}
                onChange={(e) => setDateOuverture(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">VL Actuelle (€)</label>
              <input
                type="number"
                value={vlTotale}
                onChange={(e) => setVlTotale(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Versements (€)</label>
              <input
                type="number"
                value={totalVersements}
                onChange={(e) => setTotalVersements(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Montant du Retrait (€)</label>
              <input
                type="number"
                value={montantRetrait}
                onChange={(e) => setMontantRetrait(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
          </div>

          {isHistoricalMode && (
            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-sm font-bold text-amber-800 mb-4 uppercase tracking-wider">
                Saisie des VL Historiques (Dates Charnières)
              </h3>
              <p className="text-xs text-amber-700 mb-4">
                Pour appliquer les taux historiques, veuillez saisir la Valeur Liquidative du PEA aux dates suivantes :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vlsHistoriques.map((vl, idx) => (
                  <div key={vl.date}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      VL au {new Date(vl.date).toLocaleDateString('fr-FR')}
                    </label>
                    <input
                      type="number"
                      value={vl.vl}
                      onChange={(e) => handleVLChange(idx, e.target.value)}
                      className="w-full p-2 text-sm border border-amber-300 rounded-md focus:ring-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-md"
          >
            Calculer les contributions fiscales
          </button>
        </form>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Résumé Principal */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Résumé</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assiette gain</span>
                    <span className="font-semibold">{result.assietteGain.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span className="font-medium">Total Taxes</span>
                    <span className="font-bold">-{result.montantPS.toFixed(2)} €</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-xl font-bold text-green-600">
                    <span>Net perçu</span>
                    <span>{result.netVendeur.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Détail par Contribution */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">Détail des Taxes</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(result.repartitionTaxes || {}).map(([key, val]) => (
                    val > 0 && key !== 'total' && (
                      <div key={key} className="flex justify-between">
                        <span className="uppercase text-slate-600">{key}</span>
                        <span className="font-mono">{val.toFixed(2)} €</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Bouton PDF */}
              <PDFDownloadButton 
                result={result} 
                input={{
                  dateOuverture,
                  valeurLiquidative: Number(vlTotale),
                  totalVersements: Number(totalVersements),
                  vlsHistoriques
                }} 
              />
            </div>

            {/* Tableau des Périodes */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <h3 className="text-lg font-bold mb-4">Ventilation par période fiscale</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 font-semibold text-slate-700">Période</th>
                      <th className="py-3 font-semibold text-slate-700 text-right">Gain</th>
                      <th className="py-3 font-semibold text-slate-700 text-right">Taux</th>
                      <th className="py-3 font-semibold text-slate-700 text-right">Taxe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {result.detailsParPeriode?.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 text-slate-600">{p.periodLabel}</td>
                        <td className="py-3 text-right font-mono">{p.gain.toFixed(2)} €</td>
                        <td className="py-3 text-right text-slate-500">{p.rates.total}%</td>
                        <td className="py-3 text-right font-semibold text-red-500">-{p.taxes.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                    {!result.detailsParPeriode && (
                      <tr>
                        <td className="py-3 text-slate-600">Période Unique (Post-2026)</td>
                        <td className="py-3 text-right font-mono">{result.assietteGain.toFixed(2)} €</td>
                        <td className="py-3 text-right text-slate-500">18.6% (depuis 2026)</td>
                        <td className="py-3 text-right font-semibold text-red-500">-{result.montantPS.toFixed(2)} €</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <CalculationDetails 
          result={result} 
          input={{
            dateOuverture,
            valeurLiquidative: Number(vlTotale),
            totalVersements: Number(totalVersements),
            vlsHistoriques
          }} 
        />
      )}
    </div>
  );
}
