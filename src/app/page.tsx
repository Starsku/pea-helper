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
        <header className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center gap-2.5 mb-8 px-5 py-2 bg-indigo-50/30 rounded-full border border-indigo-100 shadow-sm backdrop-blur-sm"
          >
            <Zap className="text-indigo-600 fill-indigo-600" size={18} />
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-900/70">Simulateur fiscal</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 drop-shadow-sm"
          >
            PEA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500">Helper</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Simulateur de prélèvements sociaux sur retraits PEA.
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
