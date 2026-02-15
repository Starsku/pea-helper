"use client";

import PEAForm from "@/components/PEAForm";
import { VersionColumn } from "@/components/VersionColumn";
import TaxHistoryTable from "@/components/TaxHistoryTable";
import AppHeader from "@/components/AppHeader";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AppHome() {
  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <AppHeader
        subtitle={
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600" />
            <span>Simulateur fiscal</span>
          </span>
        }
      />

      <main className="py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900"
            >
              PEA{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500">
                Helper
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed"
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
            <div className="space-y-8">
              <PEAForm />
            </div>
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

        <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 PEA Helper — Développé par FORGE</p>
          <p className="mt-3 text-slate-300 text-xs uppercase tracking-widest"></p>
        </footer>
      </div>
    </main>
    </div>
  );
}
