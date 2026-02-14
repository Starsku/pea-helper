"use client";

import PEAForm from "@/components/PEAForm";
import { VersionColumn } from "@/components/VersionColumn";
import TaxHistoryTable from "@/components/TaxHistoryTable";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center gap-2.5 mb-6 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm"
          >
            <Zap className="text-indigo-600 fill-indigo-600" size={20} />
            <span className="text-sm font-semibold text-slate-600">Simulateur Fiscal Intelligent</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
          >
            PEA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Helper</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Maîtrisez vos prélèvements sociaux. Calculateur professionnel avec support des <span className="text-slate-900 font-medium">taux historiques</span> et détail complet des contributions.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            <PEAForm />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4 xl:col-span-3 sticky top-12"
          >
            <VersionColumn />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TaxHistoryTable />
        </motion.div>
        
        <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 PEA Helper — Développé par FORGE</p>
          <p className="mt-3 text-slate-300 text-xs uppercase tracking-widest"></p>
        </footer>
      </div>
    </main>
  );
}
