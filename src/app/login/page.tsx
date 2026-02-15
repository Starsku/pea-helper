"use client";

import AuthBar from "@/components/AuthBar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] px-4 py-14 md:px-8 md:py-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left: value prop (keeps the premium header style, but avoids touching /app layout) */}
        <section className="mx-auto w-full max-w-xl lg:mx-0 lg:pt-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-600 shadow-sm">
            Espace client
          </div>

          <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Connectez-vous pour retrouver votre historique
          </h1>
          <p className="mt-3 max-w-prose text-pretty text-sm leading-6 text-slate-600 md:text-base">
            Accédez à vos calculs enregistrés, retrouvez vos retraits passés et synchronisez vos simulations entre
            appareils.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_10px_30px_rgb(0,0,0,0.04)]">
              <div className="text-sm font-bold text-slate-900">Historique</div>
              <div className="mt-1 text-xs text-slate-600">Vos calculs et versions sauvegardés</div>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_10px_30px_rgb(0,0,0,0.04)]">
              <div className="text-sm font-bold text-slate-900">Synchronisation</div>
              <div className="mt-1 text-xs text-slate-600">Retrouvez tout sur mobile & desktop</div>
            </div>
          </div>

          <p className="mt-6 text-[11px] leading-5 text-slate-500">
            Vous pouvez continuer sans compte : l’outil reste accessible, seul l’historique n’est pas enregistré.
          </p>
        </section>

        {/* Right: login card */}
        <section className="mx-auto w-full max-w-xl lg:mx-0">
          <AuthBar />
        </section>
      </div>
    </main>
  );
}
