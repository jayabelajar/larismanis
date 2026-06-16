"use client";

import Link from "next/link";
import { LogOut, UserCircle2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Link
        href="/account"
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <UserCircle2 className="h-4 w-4" />
        <span>{session.user.name ?? session.user.email}</span>
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>
    </div>
  );
}
