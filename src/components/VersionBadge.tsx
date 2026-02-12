'use client';

import React, { useState } from 'react';
import { VERSION } from '@/lib/version';
import { VersionHistory } from './VersionHistory';

export function VersionBadge() {
  const [showHistory, setShowHistory] = useState(false);
  const latestChanges = VERSION.changelog[0].changes.slice(0, 3);

  return (
    <div className="flex flex-col items-end space-y-2 mb-6">
      <div 
        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setShowHistory(true)}
      >
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Version {VERSION.current} — {VERSION.date}
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-lg p-3 max-w-xs text-right shadow-sm">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Dernières nouveautés</p>
        <ul className="text-xs text-slate-600 space-y-1">
          {latestChanges.map((change, i) => (
            <li key={i} className="leading-tight">• {change}</li>
          ))}
        </ul>
        <button 
          onClick={() => setShowHistory(true)}
          className="mt-2 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Voir tout l'historique →
        </button>
      </div>

      {showHistory && <VersionHistory onClose={() => setShowHistory(false)} />}
    </div>
  );
}
