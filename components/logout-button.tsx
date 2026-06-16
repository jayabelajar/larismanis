"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border-color bg-background/50 px-4 text-sm font-medium text-text-muted transition hover:bg-rose-50/60 hover:text-rose-600 hover:border-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4 stroke-[1.8]" />
      {pending ? "Keluar..." : "Keluar"}
    </button>
  );
}
