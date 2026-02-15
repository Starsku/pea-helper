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

function getFirebaseErrorMessage(err: any) {
  const code: string | undefined = err?.code;
  switch (code) {
    case "auth/invalid-email":
      return "Adresse email invalide.";
    case "auth/missing-password":
      return "Mot de passe requis.";
    case "auth/wrong-password":
      return "Mot de passe incorrect.";
    case "auth/user-not-found":
      return "Aucun compte associé à cet email.";
    case "auth/email-already-in-use":
      return "Cet email est déjà utilisé.";
    case "auth/weak-password":
      return "Mot de passe trop faible (6 caractères minimum).";
    case "auth/popup-closed-by-user":
      return "Connexion annulée.";
    case "auth/network-request-failed":
      return "Problème réseau. Réessayez.";
    default:
      return err?.message || "Une erreur est survenue. Réessayez.";
  }
}

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
    if (!user) return "Connexion";
    return user.email || "Connecté";
  }, [user]);

  const primaryCtaLabel = useMemo(() => {
    if (busy) return "Veuillez patienter…";
    return mode === "signin" ? "Se connecter" : "Créer mon compte";
  }, [busy, mode]);

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      if (!firebaseAuth) return;
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (e: any) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailPassword() {
    setBusy(true);
    setError(null);
    try {
      if (!firebaseAuth) return;
      const trimmedEmail = email.trim();
      if (mode === "signin") {
        await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
      } else {
        await createUserWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
      }
    } catch (e: any) {
      setError(getFirebaseErrorMessage(e));
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
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-[0_12px_40px_rgb(0,0,0,0.06)] md:p-8">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-44 bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500">{user ? "Connecté" : "Connexion"}</div>
          <div className="mt-1 text-sm font-bold text-slate-900">{label}</div>
        </div>

        {!firebaseAuth ? (
          <div className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-200/60">
            Firebase non configuré
          </div>
        ) : user ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={busy}
            className="rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-60"
          >
            Déconnexion
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="rounded-xl border border-indigo-200/60 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-50 disabled:opacity-60"
            aria-label="Se connecter avec Google"
          >
            {busy ? "Connexion…" : "Continuer avec Google"}
          </button>
        )}
      </div>

      {firebaseAuth && !user && (
        <div className="relative mt-6">
          <div className="flex rounded-2xl border border-slate-200/60 bg-slate-50/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              disabled={busy}
              className={`flex-1 rounded-2xl px-3 py-2 text-xs font-bold transition-all disabled:opacity-60 ${
                mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              disabled={busy}
              className={`flex-1 rounded-2xl px-3 py-2 text-xs font-bold transition-all disabled:opacity-60 ${
                mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void handleEmailPassword();
            }}
          >
            <label className="block">
              <div className="mb-1 text-[11px] font-semibold text-slate-600">Email</div>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domaine.com"
                disabled={busy}
                className="w-full rounded-2xl border border-slate-200/60 bg-white p-3 font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-[11px] font-semibold text-slate-600">Mot de passe</div>
              <input
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signin" ? "Votre mot de passe" : "6 caractères minimum"}
                disabled={busy}
                className="w-full rounded-2xl border border-slate-200/60 bg-white p-3 font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
              />
            </label>

            <button
              type="submit"
              disabled={busy || !email.trim() || !password}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              <span className={busy ? "opacity-0" : "opacity-100"}>{primaryCtaLabel}</span>
              {busy && (
                <span className="absolute inset-0 inline-flex items-center justify-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </span>
              )}
            </button>

            {error && (
              <div
                className="rounded-2xl border border-red-200/60 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="text-[11px] leading-5 text-slate-500">
              En continuant, vous acceptez l’utilisation d’un cookie de session pour sécuriser l’accès à votre
              historique.
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
