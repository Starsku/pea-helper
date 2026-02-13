"use client";

import { useState } from "react";
import { RetraitDetail } from "@/lib/engine/types";
import { formatCurrency } from "@/lib/format";
import { ChevronDown, ChevronRight, History, Info, ArrowDownCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

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
    <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mt-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-orange-400 rounded-full"></div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Archives des retraits</h3>
          <p className="text-sm text-slate-400 font-medium">Historique des ponctions fiscales passées</p>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              <th className="pb-6 pl-4 w-12"></th>
              <th className="pb-6">Date</th>
              <th className="pb-6 text-right">Montant Brut</th>
              <th className="pb-6 text-right">Gain Taxé</th>
              <th className="pb-6 text-right pr-4">Taxes PS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {retraits.map((retrait) => (
              <React.Fragment key={retrait.id}>
                <tr 
                  className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                  onClick={() => toggleRow(retrait.id)}
                >
                  <td className="py-6 pl-4">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${expandedRows.has(retrait.id) ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300 group-hover:text-slate-500'}`}>
                      {expandedRows.has(retrait.id) ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="text-sm font-bold text-slate-700">
                      {new Date(retrait.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <div className="text-sm font-black text-slate-900">
                      {formatCurrency(retrait.montant)}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <div className="text-sm font-mono text-slate-500">
                      {formatCurrency(retrait.assietteGain)}
                    </div>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <div className="text-sm font-black text-red-500">
                      -{formatCurrency(retrait.taxes)}
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows.has(retrait.id) && (
                    <tr>
                      <td colSpan={5} className="p-0 border-none">
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-10 pb-10 pt-2">
                            <div className="bg-slate-50/50 rounded-[24px] border border-slate-100 p-8">
                              <div className="flex items-center gap-3 mb-8">
                                <Info size={14} className="text-indigo-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Répartition temporelle au moment du retrait</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {retrait.detailsParPeriode.map((p, idx) => (
                                  <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[11px] font-bold text-slate-600">{p.periodLabel}</span>
                                      <span className="text-[10px] font-black text-indigo-500 bg-white px-2 py-0.5 rounded-md border border-indigo-50 shadow-sm">{p.rates.total}%</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                      <span className="text-xs text-slate-400 font-medium">Gain proratisé</span>
                                      <span className="text-xs font-mono font-bold text-slate-600">{formatCurrency(p.gain)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                      <span className="text-xs text-slate-400 font-medium">Taxes</span>
                                      <span className="text-xs font-black text-red-400">-{formatCurrency(p.taxes.total)}</span>
                                    </div>
                                    <div className="h-1 bg-white rounded-full overflow-hidden shadow-inner">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.taxes.total / (retrait.taxes || 1)) * 100}%` }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500" 
                                      ></motion.div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <ArrowDownCircle size={14} />
                                  <span className="text-xs font-medium italic">Part capital récupérée : {formatCurrency(retrait.partCapital)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
