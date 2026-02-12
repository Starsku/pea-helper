"use client";

import PEAForm from "@/components/PEAForm";
import { VersionColumn } from "@/components/VersionColumn";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            PEA Helper
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculateur intelligent de prélèvements sociaux avec support des <span className="font-semibold text-slate-800">taux historiques</span> et détail complet des contributions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 xl:col-span-9">
            <PEAForm />
          </div>
          <div className="lg:col-span-4 xl:col-span-3 sticky top-12 pt-4 md:pt-6">
            <VersionColumn />
          </div>
        </div>
        
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© 2026 PEA Helper - Développé par FORGE</p>
          <p className="mt-2">Conforme aux directives fiscales CFONB (CSG, CRDS, PS, CAPS, CRSA, PSOL)</p>
        </footer>
      </div>
    </main>
  );
}
