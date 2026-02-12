'use client';

import { useState, FormEvent } from 'react';
import { calculateGain, formatEuro, formatPourcent } from '@/lib/engine/pea';
import type { GainResult } from '@/lib/engine/types';

export default function Home() {
  const [dateOuverture, setDateOuverture] = useState('');
  const [valeurLiquidative, setValeurLiquidative] = useState('');
  const [totalVersements, setTotalVersements] = useState('');
  const [montantRetrait, setMontantRetrait] = useState('');
  const [result, setResult] = useState<GainResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!dateOuverture || !valeurLiquidative || !totalVersements || !montantRetrait) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const vl = parseFloat(valeurLiquidative);
    const versements = parseFloat(totalVersements);
    const retrait = parseFloat(montantRetrait);

    if (vl <= 0 || versements <= 0 || retrait <= 0) {
      setError('Les montants doivent être positifs');
      return;
    }

    if (retrait > vl) {
      setError('Le montant du retrait ne peut pas dépasser la valeur liquidative');
      return;
    }

    const dateOuv = new Date(dateOuverture);
    if (dateOuv > new Date()) {
      setError("La date d'ouverture ne peut pas être dans le futur");
      return;
    }

    try {
      const calculResult = calculateGain({
        dateOuverture: dateOuv,
        valeurLiquidative: vl,
        totalVersements: versements,
      }, retrait);
      setResult(calculResult);
    } catch (err) {
      setError('Erreur lors du calcul : ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  const handleReset = () => {
    setDateOuverture('');
    setValeurLiquidative('');
    setTotalVersements('');
    setMontantRetrait('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PEA Helper</h1>
          <p className="text-lg text-gray-600">Calculez les prélèvements sociaux sur vos retraits de PEA</p>
          <p className="text-sm text-gray-500 mt-2">Version 1.0 - Cas simple (Flat Tax 17.2%)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Informations du PEA</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="dateOuverture" className="block text-sm font-medium text-gray-700 mb-1">
                  Date d&apos;ouverture du PEA
                </label>
                <input
                  type="date"
                  id="dateOuverture"
                  value={dateOuverture}
                  onChange={(e) => setDateOuverture(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="valeurLiquidative" className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur liquidative actuelle (€)
                </label>
                <input
                  type="number"
                  id="valeurLiquidative"
                  value={valeurLiquidative}
                  onChange={(e) => setValeurLiquidative(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="Ex: 12000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="totalVersements" className="block text-sm font-medium text-gray-700 mb-1">
                  Total des versements (€)
                </label>
                <input
                  type="number"
                  id="totalVersements"
                  value={totalVersements}
                  onChange={(e) => setTotalVersements(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="Ex: 10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="montantRetrait" className="block text-sm font-medium text-gray-700 mb-1">
                  Montant du retrait (€)
                </label>
                <input
                  type="number"
                  id="montantRetrait"
                  value={montantRetrait}
                  onChange={(e) => setMontantRetrait(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="Ex: 3000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Calculer
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Résultats</h2>

            {!result ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Remplissez le formulaire et cliquez sur &quot;Calculer&quot;</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Âge du PEA</span>
                    <span className="text-sm font-medium">{result.agePEA} ans</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type de taxation</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${result.casSimple ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {result.casSimple ? 'Flat Tax 17.2%' : 'Taux historiques'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gain total du PEA</span>
                    <span className="font-medium text-green-600">{formatEuro(result.gainTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Assiette du gain (prorata)</span>
                    <span className="font-medium">{formatEuro(result.assietteGain)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taux PS</span>
                    <span className="font-medium">{formatPourcent(result.tauxPS)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Prélèvements sociaux</span>
                    <span className="font-semibold text-red-600">{formatEuro(result.montantPS)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Net vendeur</span>
                    <span className="text-2xl font-bold text-blue-700">{formatEuro(result.netVendeur)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Montant que vous recevrez après prélèvements sociaux
                  </p>
                </div>

                {result.casSimple && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-600">
                      <strong>Note :</strong> Votre PEA est soumis au taux forfaitaire de 17,2% de prélèvements sociaux 
                      {result.agePEA < 5 ? ' (PEA de moins de 5 ans)' : ' (PEA ouvert après 2018)'}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Avertissement</h3>
          <p className="text-xs text-yellow-700">
            Cet outil est fourni à titre indicatif uniquement. Pour les PEA ouverts avant 2018 et de plus de 5 ans, 
            les taux de prélèvements sociaux peuvent varier selon l&apos;historique. 
            Consultez un conseiller fiscal pour une évaluation précise de votre situation.
          </p>
        </div>
      </div>
    </div>
  );
}
