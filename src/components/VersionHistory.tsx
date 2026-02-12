'use client';

import React from 'react';
import { VERSION } from '@/lib/version';

interface VersionHistoryProps {
  onClose: () => void;
}

export function VersionHistory({ onClose }: VersionHistoryProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Historique des versions</h2>
            <p className="text-sm text-slate-500">Évolution de PEA Helper</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {VERSION.changelog.map((entry, idx) => (
            <div key={entry.version} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-2">
              {/* Dot */}
              <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              
              <div className="flex items-baseline justify-between mb-2">
                <h3 className={`text-lg font-bold ${idx === 0 ? 'text-blue-600' : 'text-slate-700'}`}>
                  {entry.version}
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {entry.date}
                </span>
              </div>
              
              <ul className="space-y-2">
                {entry.changes.map((change, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start">
                    <span className="text-blue-400 mr-2 mt-1">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}
