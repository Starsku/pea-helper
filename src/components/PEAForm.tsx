"use client";

import { useState, useEffect } from "react";
import { calculatePEAGain } from "@/lib/pea-engine";
import { GainResult, PEAEvent, EventType } from "@/lib/engine/types";
import { PIVOT_DATES } from "@/lib/tax-rates";
import CalculationTransparency from "./CalculationTransparency";
import PastWithdrawalsTable from "./PastWithdrawalsTable";
import dynamic from "next/dynamic";
import { Plus, Trash2, Calendar, TrendingUp, ArrowDownCircle, ArrowUpCircle, Info } from "lucide-react";
import { formatCurrency } from "@/lib/format";

// Helper simple pour générer des IDs sans dépendance externe
const generateId = () => Math.random().toString(36).substr(2, 9);

// Import dynamique pour éviter les erreurs SSR avec react-pdf
const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-10 bg-slate-200 rounded-lg w-full"></div>
});

export default function PEAForm() {
  const [dateOuverture, setDateOuverture] = useState("");
  const [vlTotale, setVlTotale] = useState("");
  const [montantRetraitActuel, setMontantRetraitActuel] = useState("");
  const [events, setEvents] = useState<PEAEvent[]>([]);
  const [isSortingEnabled, setIsSortingEnabled] = useState(true);
  const [result, setResult] = useState<GainResult | null>(null);

  // Re-enable sorting after a delay of inactivity
  useEffect(() => {
    if (!isSortingEnabled) {
      const timer = setTimeout(() => {
        setIsSortingEnabled(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSortingEnabled, events]);

  // Initialisation auto des VL Pivots quand la date d'ouverture change
  useEffect(() => {
    if (dateOuverture) {
      const openDate = new Date(dateOuverture);
      setEvents(prev => {
        // Garder les événements qui ne sont pas des VL_PIVOT et pas le versement initial auto
        const otherEvents = prev.filter(e => e.type !== 'VL_PIVOT' && e.id !== 'initial-deposit');
        
        // Créer ou mettre à jour le versement initial
        const existingInitial = prev.find(e => e.id === 'initial-deposit');
        const initialDeposit: PEAEvent = {
          id: 'initial-deposit',
          type: 'VERSEMENT',
          date: dateOuverture,
          montant: existingInitial?.montant && existingInitial.montant > 0 ? existingInitial.montant : 0,
        };

        // Générer les nouveaux pivots basés sur la nouvelle date d'ouverture
        const pivots: PEAEvent[] = PIVOT_DATES
          .filter(d => d > openDate)
          .map(d => {
            const existing = prev.find(e => e.type === 'VL_PIVOT' && e.date === d.toISOString().split('T')[0]);
            return {
              id: existing?.id || generateId(),
              type: 'VL_PIVOT',
              date: d.toISOString().split('T')[0],
              vl: existing?.vl || 0
            };
          });
        
        return [initialDeposit, ...otherEvents, ...pivots];
      });
    }
  }, [dateOuverture]);

  const addEvent = (type: EventType) => {
    if (type === 'VL_PIVOT') return; // On ne peut plus ajouter manuellement des VL pivots via ce bouton
    const newEvent: PEAEvent = {
      id: generateId(),
      type,
      date: new Date().toISOString().split('T')[0],
      montant: 0,
      vl: type === 'RETRAIT' ? 0 : undefined,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<PEAEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeEvent = (id: string) => {
    if (id === 'initial-deposit') return; // Interdire la suppression du versement initial
    setEvents(events.filter(e => e.id !== id));
  };

  const handleReset = () => {
    setDateOuverture("");
    setVlTotale("");
    setMontantRetraitActuel("");
    setEvents([]);
    setResult(null);
  };

  const isFormValid = () => {
    if (!dateOuverture || !vlTotale || !montantRetraitActuel) return false;
    if (Number(vlTotale) <= 0 || Number(montantRetraitActuel) <= 0) return false;
    
    // Vérifier les VL Pivots
    const pivots = events.filter(e => e.type === 'VL_PIVOT');
    if (pivots.some(p => !p.vl || p.vl <= 0)) return false;

    // Vérifier les événements (Versements / Retraits)
    const movements = events.filter(e => e.type !== 'VL_PIVOT');
    if (movements.length === 0) return false; // Au moins le versement initial
    
    for (const event of movements) {
      if (!event.date) return false;
      if (event.montant === undefined || event.montant <= 0 || isNaN(event.montant)) return false;
      if (event.type === 'RETRAIT' && (event.vl === undefined || event.vl <= 0 || isNaN(event.vl))) return false;
    }

    return true;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    // Total des versements pour compatibilité et validation simple
    const totalVersements = events
      .filter(e => e.type === 'VERSEMENT')
      .reduce((acc, e) => acc + (e.montant || 0), 0);

    const res = calculatePEAGain({
      dateOuverture,
      valeurLiquidative: Number(vlTotale),
      totalVersements,
      events
    }, Number(montantRetraitActuel));
    
    setResult(res);
  };

  const sortedEvents = isSortingEnabled 
    ? [...events]
        .filter(e => e.type !== 'VL_PIVOT')
        .sort((a, b) => {
          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateCompare !== 0) return dateCompare;
          // Stabilité du tri si dates identiques
          return a.id.localeCompare(b.id);
        })
    : [...events].filter(e => e.type !== 'VL_PIVOT');

  const pivotEvents = [...events]
    .filter(e => e.type === 'VL_PIVOT')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-2">
          <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
          Configuration du PEA
        </h2>
        
        <form 
          onSubmit={handleCalculate} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault();
            }
          }}
          className="space-y-10"
        >
          {/* Infos de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Calendar size={16} /> Date d'Ouverture
              </label>
              <input
                type="date"
                value={dateOuverture}
                onChange={(e) => setDateOuverture(e.target.value)}
                className={`w-full p-3 bg-slate-50 border ${!dateOuverture ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <TrendingUp size={16} /> VL Actuelle (EUR)
                <div className="group relative">
                  <Info size={14} className="text-slate-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] text-center leading-relaxed border border-slate-700 whitespace-normal">
                    <span className="font-bold text-indigo-300 block mb-1">Valeur Liquidative</span>
                    correspond au solde total de votre PEA (espèces + titres) à cette date.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                value={vlTotale}
                onChange={(e) => setVlTotale(e.target.value)}
                placeholder="Ex: 12500.50"
                className={`w-full p-3 bg-slate-50 border ${!vlTotale || Number(vlTotale) <= 0 ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <ArrowDownCircle size={16} className="text-indigo-600" /> Montant Retrait Souhaité (EUR)
              </label>
              <input
                type="number"
                step="0.01"
                value={montantRetraitActuel}
                onChange={(e) => setMontantRetraitActuel(e.target.value)}
                className={`w-full p-3 bg-indigo-50 border ${!montantRetraitActuel || Number(montantRetraitActuel) <= 0 ? 'border-red-300 bg-red-50' : 'border-indigo-100'} rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-indigo-900`}
                required
              />
            </div>
          </div>

          {/* VL Pivots (Automatiques) */}
          {pivotEvents.length > 0 && (
            <div className="space-y-4 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                  Valeurs Liquidatives aux dates pivots (CFONB)
                  <div className="group relative normal-case tracking-normal">
                    <Info size={14} className="text-blue-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] text-center leading-relaxed border border-slate-700 whitespace-normal">
                      <span className="font-bold text-indigo-300 block mb-1">Valeur Liquidative</span>
                      correspond au solde total de votre PEA (espèces + titres) à cette date.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </h3>
                <span className="text-[10px] text-blue-600 font-medium px-2 py-1 bg-blue-100 rounded">REQUIS POUR HISTORIQUE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pivotEvents.map((event) => (
                  <div key={event.id} className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">{new Date(event.date).toLocaleDateString('fr-FR')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={event.vl || ""}
                        onChange={(e) => updateEvent(event.id, { vl: Number(e.target.value) })}
                        placeholder="VL à date..."
                        className={`w-full p-2 bg-white border ${!event.vl || event.vl <= 0 ? 'border-red-300 bg-red-50' : 'border-blue-200'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-6`}
                      />
                      <span className="absolute right-2 top-2 text-slate-400 text-[10px] font-bold">EUR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline d'événements */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Versements et Retraits passés</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addEvent('VERSEMENT')}
                  className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 hover:bg-green-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Versement
                </button>
                <button
                  type="button"
                  onClick={() => addEvent('RETRAIT')}
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Retrait passé
                </button>
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
              {sortedEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm italic">
                  Aucun mouvement de capital enregistré. Ajoutez vos versements initiaux et complémentaires.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sortedEvents.map((event) => (
                    <div key={event.id} className="p-4 flex flex-wrap items-center gap-4 hover:bg-white transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        event.type === 'VERSEMENT' ? 'bg-green-100 text-green-600' : 
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {event.type === 'VERSEMENT' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                      </div>
                      
                      <div className="w-32">
                        <input
                          type="date"
                          value={event.date}
                          onChange={(e) => {
                            setIsSortingEnabled(false);
                            updateEvent(event.id, { date: e.target.value });
                          }}
                          onBlur={() => setIsSortingEnabled(true)}
                          className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 p-0"
                        />
                      </div>

                      <div className="flex-1 font-bold text-slate-700 text-sm">
                        {event.type === 'VERSEMENT' ? 'VERSEMENT' : 'RETRAIT PASSÉ'}
                      </div>

                      <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Montant</span>
                          <input
                            type="number"
                            value={event.montant}
                            onChange={(e) => updateEvent(event.id, { montant: Number(e.target.value) })}
                            className={`w-24 p-1.5 bg-white border ${!event.montant || event.montant <= 0 ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded text-sm font-mono`}
                          />
                          <span className="text-slate-400 text-[10px] font-bold">EUR</span>
                        </div>
                        {event.type === 'RETRAIT' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                              VL à date
                              <div className="group relative">
                                <Info size={12} className="text-slate-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] text-center leading-tight border border-slate-700 normal-case font-normal whitespace-normal">
                                  <span className="font-bold text-indigo-300 block mb-1">Valeur Liquidative</span>
                                  correspond au solde total de votre PEA (espèces + titres) à cette date.
                                  <div className="mt-2 pt-2 border-t border-slate-700 italic text-slate-400">
                                    Saisissez la VL juste AVANT ce retrait pour un calcul précis du prorata capital/gains.
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>
                            </span>
                            <input
                              type="number"
                              value={event.vl}
                              onChange={(e) => updateEvent(event.id, { vl: Number(e.target.value) })}
                              className={`w-24 p-1.5 bg-white border ${!event.vl || event.vl <= 0 ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded text-sm font-mono`}
                            />
                            <span className="text-slate-400 text-[10px] font-bold">EUR</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeEvent(event.id)}
                        disabled={event.id === 'initial-deposit'}
                        className={`p-2 transition-colors ${event.id === 'initial-deposit' ? 'text-slate-100 cursor-not-allowed' : 'text-slate-300 hover:text-red-500'}`}
                        title={event.id === 'initial-deposit' ? "Le versement initial ne peut pas être supprimé" : "Supprimer"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
            >
              Lancer la simulation chronologique
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-4 px-8 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl transition-all border border-slate-200"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Résumé Principal */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                <h3 className="text-xl font-bold mb-6 relative z-10">Bilan du retrait</h3>
                <div className="space-y-5 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Assiette taxable</span>
                    <span className="text-lg font-bold text-slate-800">{formatCurrency(result.assietteGain)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-red-600">Total Taxes (PS)</span>
                    <span className="text-lg font-bold text-red-600">-{formatCurrency(result.montantPS)}</span>
                  </div>
                  <div className="pt-5 border-t border-slate-100">
                    <div className="text-sm text-slate-400 mb-1">Net à percevoir</div>
                    <div className="text-4xl font-black text-green-600">
                      {formatCurrency(result.netVendeur)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Détail Technique */}
              <div className="bg-slate-900 text-slate-300 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Répartition Fiscalité</h3>
                <div className="space-y-4">
                  {Object.entries(result.repartitionTaxes || {}).map(([key, val]) => (
                    val > 0 && key !== 'total' && (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-bold uppercase">{key}</span>
                        <div className="flex items-center gap-3">
                           <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500" 
                                style={{ width: `${(val / (result.repartitionTaxes?.total || 1)) * 100}%` }}
                              ></div>
                           </div>
                           <span className="font-mono text-white text-xs">{formatCurrency(val)}</span>
                        </div>
                      </div>
                    )
                  ))}
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center font-bold text-white">
                    <span>TOTAL</span>
                    <span className="text-xl">{formatCurrency(result.montantPS)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <PDFDownloadButton 
                result={result} 
                input={{
                  dateOuverture,
                  valeurLiquidative: Number(vlTotale),
                  totalVersements: result.capitalInitial,
                  events
                }} 
              />
            </div>

            {/* Tableau des Périodes */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                  Ventilation des gains par période
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-slate-400 font-black border-b border-slate-50">
                        <th className="pb-4">Période Fiscale</th>
                        <th className="pb-4 text-right">Quote-part Gain</th>
                        <th className="pb-4 text-right">Taux</th>
                        <th className="pb-4 text-right">Prélèvement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {result.detailsParPeriode?.map((p, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-medium text-slate-700">{p.periodLabel}</td>
                          <td className="py-4 text-right font-mono text-slate-600 text-sm">{formatCurrency(p.gain)}</td>
                          <td className="py-4 text-right">
                            <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                              {p.rates.total}%
                            </span>
                          </td>
                          <td className="py-4 text-right font-bold text-red-500 text-sm">-{formatCurrency(p.taxes.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <CalculationTransparency result={result} />
              
              {result.retraitsPassesDetails && result.retraitsPassesDetails.length > 0 && (
                <PastWithdrawalsTable retraits={result.retraitsPassesDetails} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
