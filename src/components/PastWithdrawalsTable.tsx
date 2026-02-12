"use client";

import { useState } from "react";
import { RetraitDetail } from "@/lib/engine/types";
import { formatCurrency } from "@/lib/format";
import { ChevronDown, ChevronRight, History, Info } from "lucide-react";

interface PastWithdrawalsTableProps {
  retraits: RetraitDetail[];
}

export default function PastWithdrawalsTable({ retraits }: PastWithdrawalsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  if (!retraits || retraits.length === 0) return null;

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 overflow-hidden mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <History className="text-orange-500" size={24} />
        Détail des retraits passés
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400 font-black border-b border-slate-50">
              <th className="pb-4 pl-4 w-10"></th>
              <th className="pb-4">Date du retrait</th>
              <th className="pb-4 text-right">Montant Brut</th>
              <th className="pb-4 text-right">Assiette de gain</th>
              <th className="pb-4 text-right">Taxes payées</th>
              <th className="pb-4 text-right">Part Capital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {retraits.map((retrait) => (
              <React.Fragment key={retrait.id}>
                <tr 
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer text-sm"
                  onClick={() => toggleRow(retrait.id)}
                >
                  <td className="py-4 pl-4">
                    {expandedRows.has(retrait.id) ? (
                      <ChevronDown size={18} className="text-indigo-500" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400" />
                    )}
                  </td>
                  <td className="py-4 font-medium text-slate-700">
                    {new Date(retrait.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 text-right font-bold text-slate-900">
                    {formatCurrency(retrait.montant)}
                  </td>
                  <td className="py-4 text-right font-mono text-slate-600">
                    {formatCurrency(retrait.assietteGain)}
                  </td>
                  <td className="py-4 text-right font-bold text-red-500">
                    -{formatCurrency(retrait.taxes)}
                  </td>
                  <td className="py-4 text-right text-slate-500">
                    {formatCurrency(retrait.partCapital)}
                  </td>
                </tr>
                {expandedRows.has(retrait.id) && (
                  <tr>
                    <td colSpan={6} className="bg-slate-50/50 p-6">
                      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <Info size={14} className="text-indigo-400" />
                          Décomposition fiscale du retrait
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {retrait.detailsParPeriode.map((p, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="text-[11px] font-bold text-slate-500 flex justify-between">
                                <span>{p.periodLabel}</span>
                                <span className="bg-indigo-50 text-indigo-600 px-1.5 rounded">{p.rates.total}%</span>
                              </div>
                              <div className="flex justify-between text-sm items-baseline">
                                <span className="text-slate-400">Gain proratisé</span>
                                <span className="font-mono">{formatCurrency(p.gain)}</span>
                              </div>
                              <div className="flex justify-between text-sm items-baseline">
                                <span className="text-slate-400">Prélèvement</span>
                                <span className="font-bold text-red-500">-{formatCurrency(p.taxes.total)}</span>
                              </div>
                              <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                                <div 
                                  className="h-full bg-indigo-400" 
                                  style={{ width: `${(p.taxes.total / (retrait.taxes || 1)) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
