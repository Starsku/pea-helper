"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

function GoogleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={props.className}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.743 32.654 29.273 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 19.007 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.35 4.337-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.252 0-9.709-3.323-11.277-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.75 2.091-2.295 3.868-4.394 5.17h.003l6.19 5.238C36.67 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
      />
    </svg>
  );
}

function MailIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={props.className}>
      <path
        d="M4.5 7.5l7.1 4.97c.25.18.59.18.84 0L19.5 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 19.5h11c1.1 0 2-.9 2-2v-11c0-1.1-.9-2-2-2h-11c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={props.className}>
      <path
        d="M7.5 10.5V8.5a4.5 4.5 0 119 0v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 20h10a2 2 0 002-2v-5.5a2 2 0 00-2-2H7a2 2 0 00-2 2V18a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthBar({ onUserChange }: Props) {
  const router = useRouter();

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

      // If we have a user, mint session cookie then redirect.
      // We intentionally only redirect after the server confirms the cookie was set.
      if (u) {
        try {
          const idToken = await u.getIdToken();
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          if (!res.ok) {
            const payload = await res.json().catch(() => null);
            const msg = payload?.error ? String(payload.error) : "Connexion serveur refusée.";
            setError(msg);
            return;
          }

          // Now that the session cookie exists, navigate away from /login.
          const next = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
          const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";
          router.replace(safeNext);
        } catch {
          setError("Impossible de créer la session. Vérifiez votre connexion et réessayez.");
        }
      }
    });
  }, [onUserChange, router]);

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
      router.replace("/login");
    } finally {
      setBusy(false);
    }
  }

  if (firebaseAuth && user) {
    return (
      <div className="rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500">Connecté</div>
          <div className="mt-1 text-sm font-bold text-slate-900">{label}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center rounded-[18px] bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black disabled:opacity-60"
        >
          {busy ? "Veuillez patienter…" : "Déconnexion"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-44 bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent)]" />

      <div className="relative">
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500">Connexion</div>
          <div className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">Accéder à votre historique</div>
          <div className="mt-1 text-sm text-slate-600">Connectez-vous en 1 minute.</div>
        </div>

        {!firebaseAuth ? (
          <div className="mt-5 rounded-2xl bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-200/60">
            Firebase non configuré
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Se connecter avec Google"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>{busy ? "Connexion…" : "Continuer avec Google"}</span>
            </button>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <div className="relative flex justify-center">
                <span className="rounded-full bg-white px-3 text-xs font-semibold text-slate-500">Ou via Email</span>
              </div>
            </div>

            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void handleEmailPassword();
              }}
            >
              <label className="block">
                <div className="mb-1 text-[11px] font-semibold text-slate-600">Email</div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MailIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domaine.com"
                    disabled={busy}
                    className="w-full rounded-2xl border border-slate-200/60 bg-white py-3 pl-11 pr-3 font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
                  />
                </div>
              </label>

              <label className="block">
                <div className="mb-1 text-[11px] font-semibold text-slate-600">Mot de passe</div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LockIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signin" ? "Votre mot de passe" : "6 caractères minimum"}
                    disabled={busy}
                    className="w-full rounded-2xl border border-slate-200/60 bg-white py-3 pl-11 pr-3 font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
                  />
                </div>
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

              <div className="flex items-center justify-between gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode((m) => (m === "signin" ? "signup" : "signin"));
                    setError(null);
                  }}
                  disabled={busy}
                  className="text-xs font-semibold text-slate-700 underline-offset-4 hover:underline disabled:opacity-60"
                >
                  {mode === "signin" ? "Pas encore de compte ? S’inscrire" : "Déjà un compte ? Se connecter"}
                </button>
              </div>

              <div className="text-[11px] leading-5 text-slate-500">
                En continuant, vous acceptez l’utilisation d’un cookie de session pour sécuriser l’accès à votre
                historique.
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
