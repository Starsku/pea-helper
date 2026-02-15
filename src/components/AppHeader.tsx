"use client";

import { ReactNode } from "react";
import UserMenu from "@/components/UserMenu";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
};

export default function AppHeader({ title, subtitle }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100/80 bg-[#fcfcfd]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <div className="min-w-0">
          <div className="text-sm font-extrabold tracking-tight text-slate-900">PEA Helper</div>
          {subtitle ? (
            <div className="mt-0.5 truncate text-xs font-medium text-slate-500">{subtitle}</div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <UserMenu />
        </div>
      </div>

      {title ? (
        <div className="mx-auto max-w-7xl px-4 pb-5 md:px-8">
          <div className="pt-2">
            <div className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">{title}</div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
