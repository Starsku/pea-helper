"use client";

import { useState, useEffect } from "react";
import { calculatePEAGain } from "@/lib/pea-engine";
import { GainResult, PEAEvent, EventType } from "@/lib/engine/types";
import { PIVOT_DATES } from "@/lib/tax-rates";
import CalculationTransparency from "./CalculationTransparency";
import PastWithdrawalsTable from "./PastWithdrawalsTable";
import dynamic from "next/dynamic";
import { Plus, Trash2, Calendar, TrendingUp, ArrowDownCircle, ArrowUpCircle, Info, RefreshCw, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

// Helper simple pour générer des IDs sans dépendance externe
const generateId = () => Math.random().toString(36).substr(2, 9);

// Import dynamique pour éviter les erreurs SSR avec react-pdf
const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-12 bg-slate-100 rounded-xl w-full"></div>
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
    if (type === 'VL_PIVOT') return;
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
    if (id === 'initial-deposit') return;
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
    
    const pivots = events.filter(e => e.type === 'VL_PIVOT');
    if (pivots.some(p => !p.vl || p.vl <= 0)) return false;

    const movements = events.filter(e => e.type !== 'VL_PIVOT');
    if (movements.length === 0) return false;
    
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
          return a.id.localeCompare(b.id);
        })
    : [...events].filter(e => e.type !== 'VL_PIVOT');

  const pivotEvents = [...events]
    .filter(e => e.type === 'VL_PIVOT')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Configuration</h2>
            <p className="text-sm text-slate-400 font-medium">Paramètres de votre plan d'épargne</p>
          </div>
        </div>
        
        <form 
          onSubmit={handleCalculate} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault();
            }
          }}
          className="space-y-12"
        >
          {/* Infos de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-slate-300" /> Date d'Ouverture
              </label>
              <input
                type="date"
                value={dateOuverture}
                onChange={(e) => setDateOuverture(e.target.value)}
                className={`w-full p-4 bg-slate-50/50 border ${!dateOuverture ? 'border-red-200' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700`}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-slate-300" /> VL Actuelle <span className="text-[10px] text-slate-300 font-normal">(EUR)</span>
                <div className="group relative">
                  <Info size={14} className="text-slate-200 cursor-help hover:text-indigo-400 transition-colors" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 text-white text-xs rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[100] text-center leading-relaxed border border-slate-800 translate-y-2 group-hover:translate-y-0">
                    <span className="font-bold text-indigo-400 block mb-1">Valeur Liquidative</span>
                    Le solde total de votre PEA (espèces + titres) à ce jour.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                value={vlTotale}
                onChange={(e) => setVlTotale(e.target.value)}
                placeholder="0.00"
                className={`w-full p-4 bg-slate-50/50 border ${!vlTotale || Number(vlTotale) <= 0 ? 'border-red-200' : 'border-slate-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700`}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <ArrowDownCircle size={14} /> Retrait Souhaité <span className="text-[10px] text-indigo-300 font-normal">(EUR)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={montantRetraitActuel}
                onChange={(e) => setMontantRetraitActuel(e.target.value)}
                placeholder="0.00"
                className={`w-full p-4 bg-indigo-50/30 border ${!montantRetraitActuel || Number(montantRetraitActuel) <= 0 ? 'border-red-200' : 'border-indigo-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-indigo-600 placeholder:text-indigo-200`}
                required
              />
            </div>
          </div>

          {/* VL Pivots (Automatiques) */}
          <AnimatePresence>
            {pivotEvents.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 p-8 bg-slate-50/30 border border-slate-100 rounded-[24px]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Historique des VL aux dates pivots
                    <div className="group relative normal-case tracking-normal">
                      <Info size={14} className="text-slate-300 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 text-white text-xs rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[100] text-center leading-relaxed border border-slate-800 translate-y-2 group-hover:translate-y-0">
                        <span className="font-bold text-indigo-400 block mb-1 text-left">Prorata Temporis</span>
                        Pour appliquer les bons taux historiques, la banque doit connaître la VL du PEA à chaque changement de taux (2011, 2012, 2013, 2017).
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </h3>
                  <span className="text-[10px] text-indigo-500 font-bold px-2.5 py-1 bg-indigo-50 rounded-lg">CALCUL CFONB</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pivotEvents.map((event) => (
                    <div key={event.id} className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 ml-1">{new Date(event.date).toLocaleDateString('fr-FR')}</label>
                      <div className="relative group">
                        <input
                          type="number"
                          step="0.01"
                          value={event.vl || ""}
                          onChange={(e) => updateEvent(event.id, { vl: Number(e.target.value) })}
                          placeholder="0.00"
                          className={`w-full p-3.5 bg-white border ${!event.vl || event.vl <= 0 ? 'border-red-200' : 'border-slate-200'} rounded-xl text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all pr-12`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] font-bold">EUR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline d'événements */}
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Mouvements de capital</h3>
                <p className="text-sm text-slate-400 font-medium">Flux historiques enregistrés</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => addEvent('VERSEMENT')}
                  className="px-4 py-2.5 bg-white text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={14} /> Versement
                </button>
                <button
                  type="button"
                  onClick={() => addEvent('RETRAIT')}
                  className="px-4 py-2.5 bg-white text-orange-600 rounded-xl text-xs font-bold border border-orange-100 hover:bg-orange-50 hover:border-orange-200 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={14} /> Retrait passé
                </button>
              </div>
            </div>

            <div className="border border-slate-100 rounded-[24px] overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50/50 px-6 py-4 flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <div className="w-12">Type</div>
                <div className="w-32 ml-4">Date</div>
                <div className="flex-1 ml-4">Désignation</div>
                <div className="w-64 text-right">Montants (EUR)</div>
                <div className="w-12 text-right"></div>
              </div>
              
              <div className="divide-y divide-slate-100">
                <AnimatePresence initial={false}>
                  {sortedEvents.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-12 text-center"
                    >
                      <p className="text-slate-400 text-sm font-medium italic">Aucun mouvement enregistré.</p>
                    </motion.div>
                  ) : (
                    sortedEvents.map((event) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="px-6 py-5 flex items-center hover:bg-slate-50/30 transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          event.type === 'VERSEMENT' ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {event.type === 'VERSEMENT' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                        </div>
                        
                        <div className="w-32 ml-4">
                          <input
                            type="date"
                            value={event.date}
                            onChange={(e) => {
                              setIsSortingEnabled(false);
                              updateEvent(event.id, { date: e.target.value });
                            }}
                            onBlur={() => setIsSortingEnabled(true)}
                            className="w-full bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 p-0 cursor-pointer hover:text-indigo-600 transition-colors"
                          />
                        </div>

                        <div className="flex-1 ml-4 font-bold text-slate-900 text-sm">
                          {event.id === 'initial-deposit' ? 'Versement initial' : (event.type === 'VERSEMENT' ? 'Complément' : 'Retrait partiel')}
                        </div>

                        <div className="flex gap-6 items-center w-64 justify-end">
                          <div className="relative">
                            <input
                              type="number"
                              value={event.montant}
                              onChange={(e) => updateEvent(event.id, { montant: Number(e.target.value) })}
                              className={`w-28 p-2 bg-slate-50/50 border ${!event.montant || event.montant <= 0 ? 'border-red-200' : 'border-slate-100'} rounded-lg text-sm font-bold text-slate-700 text-right focus:bg-white transition-all`}
                            />
                          </div>
                          {event.type === 'RETRAIT' && (
                            <div className="relative group/vl">
                              <input
                                type="number"
                                value={event.vl}
                                onChange={(e) => updateEvent(event.id, { vl: Number(e.target.value) })}
                                placeholder="VL"
                                className={`w-24 p-2 bg-slate-50/50 border ${!event.vl || event.vl <= 0 ? 'border-red-200' : 'border-slate-100'} rounded-lg text-sm font-bold text-slate-700 text-right focus:bg-white transition-all`}
                              />
                              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/vl:opacity-100 transition-opacity pointer-events-none">
                                <span className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">VL avant retrait</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="w-12 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeEvent(event.id)}
                            disabled={event.id === 'initial-deposit'}
                            className={`p-2 transition-all rounded-lg ${event.id === 'initial-deposit' ? 'text-slate-100' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="group relative flex-[2] overflow-hidden py-5 px-8 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-lg font-bold rounded-[20px] transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3">
                Calculer le retrait
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-5 px-8 bg-white hover:bg-slate-50 text-slate-500 font-bold rounded-[20px] transition-all border border-slate-100 flex items-center justify-center gap-2 group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Reset
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Résumé Principal */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <h3 className="text-xl font-bold mb-8 text-slate-900 relative z-10 flex items-center gap-3">
                    Bilan du retrait
                  </h3>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Assiette taxable</span>
                      <span className="text-xl font-bold text-slate-800">{formatCurrency(result.assietteGain)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-red-400 uppercase tracking-widest">Total Taxes</span>
                      <span className="text-xl font-bold text-red-500">-{formatCurrency(result.montantPS)}</span>
                    </div>
                    
                    <div className="pt-8 border-t border-slate-50">
                      <div className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Net à percevoir</div>
                      <div className="text-5xl font-black text-emerald-500 tracking-tight">
                        {formatCurrency(result.netVendeur)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détail Technique */}
                <div className="bg-slate-900 text-slate-400 p-10 rounded-[40px] shadow-2xl shadow-indigo-900/10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8">Répartition Sociale</h3>
                  <div className="space-y-5">
                    {Object.entries(result.repartitionTaxes || {}).map(([key, val]) => (
                      val > 0 && key !== 'total' && (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">{key}</span>
                            <span className="font-mono text-white text-sm font-bold">{formatCurrency(val)}</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(val / (result.repartitionTaxes?.total || 1)) * 100}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-indigo-500" 
                            ></motion.div>
                          </div>
                        </div>
                      )
                    ))}
                    <div className="pt-6 mt-6 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">TOTAL PS</span>
                      <span className="text-2xl font-black text-white">{formatCurrency(result.montantPS)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
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
              </div>

              {/* Tableau des Périodes */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-amber-400 rounded-full"></div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Quotes-parts temporelles</h3>
                      <p className="text-sm text-slate-400 font-medium">Ventilation des gains par palier fiscal</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                          <th className="pb-6 pl-2">Période Fiscale</th>
                          <th className="pb-6 text-right">Gain</th>
                          <th className="pb-6 text-center">Taux</th>
                          <th className="pb-6 text-right pr-2">Prélèvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {result.detailsParPeriode?.map((p, i) => (
                          <tr key={i} className="group transition-all hover:bg-slate-50/50">
                            <td className="py-5 pl-2">
                              <div className="text-sm font-bold text-slate-700">{p.periodLabel}</div>
                            </td>
                            <td className="py-5 text-right">
                              <div className="text-sm font-mono text-slate-500">{formatCurrency(p.gain)}</div>
                            </td>
                            <td className="py-5 text-center">
                              <span className="inline-block px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                {p.rates.total}%
                              </span>
                            </td>
                            <td className="py-5 text-right pr-2">
                              <div className="text-sm font-black text-red-500">-{formatCurrency(p.taxes.total)}</div>
                            </td>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
