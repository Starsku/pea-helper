"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

function truncateEmail(email: string, max = 22) {
  if (email.length <= max) return email;
  const [local, domain] = email.split("@");
  if (!domain) return email.slice(0, max - 1) + "…";
  const keepLocal = Math.max(4, Math.min(local.length, Math.floor(max * 0.55)));
  const keepDomain = Math.max(6, max - keepLocal - 2);
  const shortLocal = local.length > keepLocal ? local.slice(0, keepLocal - 1) + "…" : local;
  const shortDomain = domain.length > keepDomain ? domain.slice(0, keepDomain - 1) + "…" : domain;
  return `${shortLocal}@${shortDomain}`;
}

function initialForEmail(email?: string | null) {
  const v = (email || "?").trim();
  return v ? v[0]!.toUpperCase() : "?";
}

export default function UserMenu() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) setOpen(false);
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const label = useMemo(() => {
    if (!user?.email) return "Compte";
    return truncateEmail(user.email);
  }, [user]);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (firebaseAuth) await signOut(firebaseAuth);
      router.replace("/login");
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  if (!firebaseAuth || !user) return null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
          {initialForEmail(user.email)}
        </span>
        <span className="hidden max-w-[220px] truncate text-xs font-semibold text-slate-700 sm:inline">
          {label}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 text-slate-500"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
        >
          <div className="px-4 py-3">
            <div className="text-[11px] font-semibold text-slate-500">Connecté</div>
            <div className="mt-1 truncate text-sm font-bold text-slate-900">{user.email}</div>
          </div>
          <div className="h-px bg-slate-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleLogout()}
            disabled={busy}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <span>Déconnexion</span>
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            ) : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}
