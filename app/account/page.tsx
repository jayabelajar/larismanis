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
      <section className="mx-auto grid w-full max-w-2xl gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm text-slate-500">Nama</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 text-base font-medium text-slate-900">{user.email ?? "-"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Metode login</p>
          <p className="mt-2 text-base font-medium text-slate-900">{providerLabel}</p>
        </div>
      </section>
    </SiteShell>
  );
}
