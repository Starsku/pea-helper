import React, { useState } from "react";
import { GainResult, PEA, PeriodDetail } from "@/lib/engine/types";
import { ChevronDown, ChevronRight, Info, AlertCircle, History } from "lucide-react";

interface CalculationTransparencyProps {
  result: GainResult;
}

function TaxDetailRow({ label, base, rate, amount }: { label: string; base: number; rate: number; amount: number }) {
  if (amount === 0 && rate === 0) return null;
  
  return (
    <div className="flex justify-between items-center py-1.5 text-xs border-b border-slate-100 last:border-0">
      <div className="text-slate-500 font-medium">{label}</div>
      <div className="flex gap-4">
        <div className="text-slate-400">{base.toLocaleString('fr-FR')} € × {rate}%</div>
        <div className="font-mono font-semibold text-slate-700">{amount.toFixed(2)} €</div>
      </div>
    </div>
  );
}

function CollapsiblePeriodRow({ period }: { period: PeriodDetail }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group px-4"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-700">{period.periodLabel}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Assiette : {period.gain.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-red-500">-{period.taxes.total.toFixed(2)} €</div>
          <div className="text-[10px] text-slate-400 font-bold">{period.rates.total}%</div>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-12 pb-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
          <TaxDetailRow label="CSG" base={period.gain} rate={period.rates.csg} amount={period.taxes.csg} />
          <TaxDetailRow label="CRDS" base={period.gain} rate={period.rates.crds} amount={period.taxes.crds} />
          <TaxDetailRow label="Prélèvement Social" base={period.gain} rate={period.rates.ps} amount={period.taxes.ps} />
          <TaxDetailRow label="CAPS" base={period.gain} rate={period.rates.caps} amount={period.taxes.caps} />
          <TaxDetailRow label="Contribution RSA" base={period.gain} rate={period.rates.crsa} amount={period.taxes.crsa} />
          <TaxDetailRow label="Solidarité (PSOL)" base={period.gain} rate={period.rates.psol} amount={period.taxes.psol} />
        </div>
      )}
    </div>
  );
}

export default function CalculationTransparency({ result }: CalculationTransparencyProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* 1. Analyse de l'érosion du capital (Nouveauté v4) */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <History className="text-indigo-600" size={24} />
          Analyse de l'érosion du capital
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Le PEA fonctionne selon une logique de <strong>remboursement au prorata</strong>. 
              Chaque retrait passé a consommé une partie de vos versements initiaux, réduisant ainsi le "Capital Restant" qui peut être récupéré sans taxe aujourd'hui.
            </p>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-indigo-800 leading-relaxed">
                  <strong>Règle fiscale :</strong> L'assiette taxable d'un retrait est égale au montant du retrait diminué de la part des versements initiaux comprise dans ce retrait.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Cumul versements historiques</span>
              <span className="text-sm font-bold text-slate-800">{result.capitalInitial.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Capital déjà remboursé (retraits passés)</span>
              <span className="text-sm font-bold text-orange-600">-{result.cumulVersementsRembourses.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <span className="text-sm font-bold">Capital Restant Net (non taxable)</span>
              <span className="text-lg font-black">{result.capitalRestant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Détail de l'assiette actuelle */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h4 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider text-center">Justification de l'assiette du retrait actuel</h4>
        
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 min-w-[140px]">
              <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Montant Retrait</div>
              <div className="text-xl font-bold text-slate-800">{result.montantRetrait.toLocaleString('fr-FR')} €</div>
            </div>
            <div className="text-2xl text-slate-300">−</div>
            <div className="p-4 bg-green-50 rounded-2xl border border-green-200 min-w-[140px]">
              <div className="text-[10px] font-black text-green-600 uppercase mb-1">Part Capital (Prorata)</div>
              <div className="text-xl font-bold text-green-700">{(result.montantRetrait - result.assietteGain).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            </div>
            <div className="text-2xl text-slate-300">=</div>
            <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl min-w-[180px] scale-110 border-4 border-indigo-100">
              <div className="text-xs font-black uppercase mb-1 opacity-80">Assiette Taxable</div>
              <div className="text-2xl font-black">{result.assietteGain.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 italic max-w-lg text-center leading-relaxed">
            La part de capital est calculée selon le ratio : <code>Retrait × (Capital Restant / VL Totale)</code>. 
            Ici, la VL Totale est de {(result.gainTotal + result.capitalRestant).toLocaleString('fr-FR')} €.
          </p>
        </div>
      </section>

      {/* 3. Historique des taxes (si applicable) */}
      {result.detailsParPeriode && result.detailsParPeriode.length > 0 && (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
              Détail des calculs par strate fiscale
            </h4>
            <div className="hidden sm:flex items-center text-[10px] bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 font-bold uppercase tracking-widest">
              Mode Multi-Retraits V4
            </div>
          </div>
          
          <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
            <div className="divide-y divide-slate-100">
              {result.detailsParPeriode.map((p, i) => (
                <CollapsiblePeriodRow key={i} period={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
