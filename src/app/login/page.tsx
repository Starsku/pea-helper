"use client";

import AuthBar from "@/components/AuthBar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch">
        <div className="mb-6 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-lg font-black tracking-tight text-slate-900">P</span>
          </div>
          <div className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">PEA Helper</div>
          <div className="mt-1 text-sm text-slate-600">Simulez, comparez, et gardez votre historique.</div>
        </div>

        <AuthBar />

        <div className="mt-8 text-center text-[11px] leading-5 text-slate-500">
          © {new Date().getFullYear()} PEA Helper · Données sécurisées · Support: contact@pea-helper.fr
        </div>
      </div>
    </main>
  );
}
