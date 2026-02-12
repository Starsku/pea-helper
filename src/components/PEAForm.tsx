"use client";

import { useState } from "react";
import Big from "big.js";
import { calculateGain, ResultatCalcul } from "@/lib/pea-engine";

export default function PEAForm() {
  const [formData, setFormData] = useState({
    vlTotale: "12000",
    totalVersements: "10000",
    montantRetrait: "1000",
  });

  const [result, setResult] = useState<ResultatCalcul | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = calculateGain(
        {
          dateOuverture: new Date(), // Non utilisé en V1 simple
          valeurLiquidationTotale: new Big(formData.vlTotale),
          totalVersements: new Big(formData.totalVersements),
        },
        {
          montantRetrait: new Big(formData.montantRetrait),
        }
      );
      setResult(res);
    } catch (err) {
      alert("Erreur dans les nombres saisis");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valeur de Liquidation Totale (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.vlTotale}
              onChange={(e) => setFormData({ ...formData, vlTotale: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total des Versements (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.totalVersements}
              onChange={(e) => setFormData({ ...formData, totalVersements: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Montant du Retrait (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.montantRetrait}
            onChange={(e) => setFormData({ ...formData, montantRetrait: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
        >
          Calculer les Prélèvements
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Résultat du Calcul</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Capital remboursé</span>
              <span className="font-mono font-medium">{result.capitalRembourse.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Gain brut imposable</span>
              <span className="font-mono font-medium text-blue-600">{result.gainBrut.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 text-red-600">
              <span className="">Prélèvements Sociaux (17.2%)</span>
              <span className="font-mono font-bold">-{result.prelevementsSociaux.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-4 text-lg font-bold text-slate-900 bg-white px-4 rounded-md shadow-sm border border-slate-200">
              <span>Net versé sur compte</span>
              <span className="font-mono text-green-600">{result.netVerse.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
