import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { HistoryClient } from "@/components/history-client";
import { SiteShell } from "@/components/site-shell";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Riwayat Kalkulasi",
  description: "Riwayat kalkulasi tersimpan untuk akun seller yang sedang login.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/history");
  }

  return (
    <SiteShell
      title="Riwayat kalkulasi"
      description="Daftar hasil hitung dari channel online maupun offline yang sudah disimpan untuk akun yang sedang login."
    >
      <HistoryClient userEmail={session.user.email} />
    </SiteShell>
  );
}
