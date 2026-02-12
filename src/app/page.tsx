"use client";

import PEAForm from "@/components/PEAForm";
import { VersionBadge } from "@/components/VersionBadge";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end">
          <VersionBadge />
        </div>
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            PEA Helper
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculateur intelligent de prélèvements sociaux avec support des <span className="font-semibold text-slate-800">taux historiques</span> et détail complet des contributions.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase">
              Moteur V2 Opérationnel
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase">
              Flat Tax & Taux Historiques
            </span>
          </div>
        </header>

        <PEAForm />
        
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© 2026 PEA Helper - Développé par FORGE</p>
          <p className="mt-2">Conforme aux directives fiscales CFONB (CSG, CRDS, PS, CAPS, CRSA, PSOL)</p>
        </footer>
      </div>
    </main>
  );
}
