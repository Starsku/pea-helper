'use client';

import React from 'react';
import { VERSION } from '@/lib/version';

export function VersionColumn() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-900">Versions</h2>
        <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          v{VERSION.current}
        </span>
      </div>

      <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {VERSION.changelog.map((entry, idx) => (
          <div key={entry.version} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-2">
            {/* Dot */}
            <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
            
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${idx === 0 ? 'text-blue-600' : 'text-slate-700'}`}>
                  v{entry.version}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {entry.date}
                </span>
              </div>
            </div>
            
            <ul className="space-y-1.5">
              {entry.changes.map((change, i) => (
                <li key={i} className="text-[11px] leading-relaxed text-slate-500 flex items-start">
                  <span className="text-blue-400 mr-1.5 mt-0.5 shrink-0">•</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* VERSION.changelog.length > 5 && (
        <p className="mt-4 text-center text-[10px] text-slate-400 italic">
          Voir l'historique complet pour plus de détails
        </p>
      ) */}
    </div>
  );
}
