import React, { useState } from "react";
import { GainResult, PEA, PeriodDetail } from "@/lib/engine/types";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { TaxRates } from "@/lib/tax-rates";

interface CalculationDetailsProps {
  result: GainResult;
  input: PEA;
}

function TaxDetailRow({ label, base, rate, amount }: { label: string; base: number; rate: number; amount: number }) {
  if (amount === 0 && rate === 0) return null;
  
  return (
    <div className="flex justify-between items-center py-1 text-xs border-b border-slate-100 last:border-0">
      <div className="text-slate-500 font-medium">{label}</div>
      <div className="flex gap-4">
        <div className="text-slate-400">{base.toLocaleString('fr-FR')} € × {rate}%</div>
        <div className="font-mono font-semibold text-slate-700">{amount.toFixed(2)} €</div>
      </div>
    </div>
  );
}

function CollapsiblePeriodRow({ period, index }: { period: PeriodDetail; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-700">{period.periodLabel}</div>
            <div className="text-[10px] text-slate-400 font-mono">Assiette : {period.gain.toLocaleString('fr-FR')} €</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-red-500">-{period.taxes.total.toFixed(2)} €</div>
          <div className="text-[10px] text-slate-400">{period.rates.total}% global</div>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-8 pb-3 space-y-1 animate-in slide-in-from-top-1 duration-200">
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
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold text-indigo-700 uppercase">Étape 1 : Calcul du Gain Net Global</h4>
            </div>
            <p className="text-slate-600 text-xs mb-3">
              On détermine d'abord la plus-value globale latente sur l'ensemble du plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-3 bg-slate-50 rounded-lg font-mono text-sm border border-slate-100">
              <div className="text-center">
                <div className="text-slate-400 text-[10px] uppercase font-sans mb-1">VL Totale</div>
                <div className="font-bold text-slate-700">{input.valeurLiquidative.toLocaleString('fr-FR')} €</div>
              </div>
              <div className="text-2xl text-slate-300">−</div>
              <div className="text-center">
                <div className="text-slate-400 text-[10px] uppercase font-sans mb-1">Total Versements</div>
                <div className="font-bold text-slate-700">{input.totalVersements.toLocaleString('fr-FR')} €</div>
              </div>
              <div className="text-2xl text-slate-300">=</div>
              <div className="text-center px-4 py-1 bg-green-100 rounded text-green-800">
                <div className="text-green-600 text-[10px] uppercase font-sans mb-1">Gain Latent</div>
                <div className="font-bold">{(input.valeurLiquidative - input.totalVersements).toLocaleString('fr-FR')} €</div>
              </div>
            </div>
          </section>

          {/* Étape 2 */}
          <section className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
            <h4 className="text-sm font-bold text-indigo-700 uppercase mb-2">Étape 2 : Détermination de l'Assiette Taxable</h4>
            <p className="text-slate-600 text-xs mb-3">
              Le retrait est composé d'une part de capital (non taxée) et d'une part de gain (taxée).
              La part de gain est proportionnelle au gain total du plan.
            </p>
            <div className="p-4 bg-slate-50 rounded-lg font-mono text-sm space-y-3 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-sans uppercase">Part de Gain dans le plan :</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {((result.gainTotal / input.valeurLiquidative) * 100).toFixed(2)} %
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 mt-2">
                <div className="text-[11px] text-slate-400 mb-2 font-sans italic">
                  Calcul : {result.montantRetrait.toLocaleString('fr-FR')} € (Retrait) × {((result.gainTotal / input.valeurLiquidative) * 100).toFixed(2)} %
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-500 font-sans uppercase">Assiette Taxable :</span>
                   <div className="text-lg font-bold text-indigo-800">
                    = {result.assietteGain.toLocaleString('fr-FR')} €
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Étape 3 (Si historique) */}
          {result.detailsParPeriode && result.detailsParPeriode.length > 0 && (
            <section className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-indigo-700 uppercase">Étape 3 : Ventilation par période</h4>
                <div className="flex items-center text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                  <Info size={12} className="mr-1" /> Taux Historiques
                </div>
              </div>
              <p className="text-slate-600 text-xs mb-4 leading-relaxed">
                Le gain est réparti au prorata des VL saisies. Cliquez sur une période pour voir le détail des prélèvements (CSG, CRDS, PS, etc.).
              </p>
              
              <div className="border border-slate-100 rounded-lg overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <span>Période & Assiette</span>
                  <span>Prélèvements</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {result.detailsParPeriode.map((p, i) => (
                    <CollapsiblePeriodRow key={i} period={p} index={i} />
                  ))}
                </div>
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
              <p className="text-[10px] text-slate-500 mt-2 leading-tight">
                Somme des prélèvements calculés sur chaque période fiscale.
              </p>
            </div>
            <div className="bg-indigo-600 p-4 rounded-lg shadow-lg text-white">
              <h4 className="text-sm font-bold uppercase mb-2 opacity-90">Étape 5 : Net à percevoir</h4>
              <div className="text-2xl font-bold">
                {result.netVendeur.toLocaleString('fr-FR')} €
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-indigo-400/30">
                <span className="text-[10px] opacity-70 italic font-mono">
                  {result.montantRetrait.toLocaleString('fr-FR')} - {result.montantPS.toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
