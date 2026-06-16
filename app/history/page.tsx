import { HistoryClient } from "@/components/history-client";
import { SiteShell } from "@/components/site-shell";

export default function HistoryPage() {
  return (
    <SiteShell
      title="Riwayat kalkulasi"
      description="Daftar hasil hitung dari channel online maupun offline yang sudah disimpan dari halaman kalkulator. Untuk setup MVP ini, data masih disimpan lokal di browser."
    >
      <HistoryClient />
    </SiteShell>
  );
}
