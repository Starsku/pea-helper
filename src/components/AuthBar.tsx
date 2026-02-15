"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

type Props = {
  onUserChange?: (user: User | null) => void;
};

export default function AuthBar({ onUserChange }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, async (u) => {
      setUser(u);
      onUserChange?.(u);

      // If we have a user, attempt to mint session cookie
      if (u) {
        try {
          const idToken = await u.getIdToken();
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
        } catch {
          // ignore: app still works without server session
        }
      }
    });
  }, [onUserChange]);

  const label = useMemo(() => {
    if (!user) return "Se connecter";
    return user.email || "Connecté";
  }, [user]);

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      if (!firebaseAuth) return;
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (e: any) {
      setError(e?.message || "Erreur Google");
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailPassword() {
    setBusy(true);
    setError(null);
    try {
      if (!firebaseAuth) return;
      if (mode === "signin") {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      } else {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
      }
    } catch (e: any) {
      setError(e?.message || "Erreur de connexion");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    setError(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (!firebaseAuth) return;
      await signOut(firebaseAuth);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compte</div>
          <div className="text-sm font-bold text-slate-900 mt-1">{label}</div>
        </div>

        {!firebaseAuth ? (
          <div className="text-[11px] text-slate-400 font-bold">Firebase non configuré</div>
        ) : user ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={busy}
            className="px-4 py-2.5 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-50 transition-all"
          >
            Déconnexion
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="px-4 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100 hover:bg-indigo-50 transition-all"
          >
            Google
          </button>
        )}
      </div>

      {firebaseAuth && !user && (
        <div className="mt-5 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                mode === "signin"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                mode === "signup"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
              }`}
            >
              Créer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domaine.com"
              className="w-full p-3 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mot de passe"
              className="w-full p-3 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700"
            />
          </div>

          <button
            type="button"
            onClick={handleEmailPassword}
            disabled={busy || !email || !password}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-sm font-bold rounded-[18px] transition-all"
          >
            {mode === "signin" ? "Connexion" : "Créer le compte"}
          </button>

          {error && <div className="text-xs text-red-500 font-bold">{error}</div>}

          <div className="text-[11px] text-slate-400">
            Sans connexion, les calculs restent disponibles mais l'historique client n'est pas enregistré.
          </div>
        </div>
      )}
    </div>
  );
}
