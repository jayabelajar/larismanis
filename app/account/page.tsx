import { redirect } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Akun",
  description: "Informasi akun pengguna LarisManis.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const provider = user.app_metadata?.provider;
  const providerLabel =
    provider === "google"
      ? "Google"
      : provider === "email"
        ? "Email dan password"
        : "Supabase Auth";
  const name =
    user.user_metadata?.name ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "Pengguna";

  return (
    <SiteShell
      title="Akun"
      description="Status login aktif untuk akun yang sedang dipakai di aplikasi ini."
    >
      <section className="mx-auto grid w-full max-w-2xl gap-6 rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 divide-y-2 divide-darkText">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-darkText/70">Nama</p>
          <p className="text-lg font-extrabold text-darkText">{name}</p>
        </div>
        <div className="flex flex-col gap-1 pt-4 first:pt-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-darkText/70">Email</p>
          <p className="text-base font-extrabold text-darkText">{user.email ?? "-"}</p>
        </div>
        <div className="flex flex-col gap-1 pt-4 first:pt-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-darkText/70">Metode Login</p>
          <p className="text-base font-extrabold text-darkText">{providerLabel}</p>
        </div>
      </section>
    </SiteShell>
  );
}
