import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export async function AuthNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-xl border border-border-color bg-background/50 px-4.5 text-sm font-medium text-text-muted transition hover:bg-accent-light hover:text-accent hover:border-accent/10"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="inline-flex h-10 items-center rounded-xl bg-accent px-4.5 text-sm font-semibold text-background shadow-sm transition hover:bg-accent-hover"
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
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border-color bg-background/50 px-4 text-sm font-medium text-text-muted transition hover:bg-accent-light hover:text-accent hover:border-accent/10"
      >
        <UserCircle2 className="h-4 w-4 stroke-[1.8]" />
        <span>{user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email}</span>
      </Link>
      <LogoutButton />
    </div>
  );
}
