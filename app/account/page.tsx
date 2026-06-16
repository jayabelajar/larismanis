import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SiteShell } from "@/components/site-shell";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Akun",
  description: "Informasi akun pengguna LarisManis.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SiteShell
      title="Akun"
      description="Status login aktif untuk akun yang sedang dipakai di aplikasi ini."
    >
      <section className="mx-auto grid w-full max-w-2xl gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm text-slate-500">Nama</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">
            {session.user.name ?? "Pengguna"}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 text-base font-medium text-slate-900">
            {session.user.email ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Metode login</p>
          <p className="mt-2 text-base font-medium text-slate-900">
            Email/password atau Google, tergantung provider yang dipakai saat login.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
