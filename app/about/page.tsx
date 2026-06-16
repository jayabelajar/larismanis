import { SiteShell } from "@/components/site-shell";

const points = [
  "LarisManis dibuat untuk seller yang butuh cara cepat menghitung harga jual aman di channel online maupun offline.",
  "Ruang lingkup MVP sekarang mencakup landing page, kalkulator, preset channel, simulasi profit, dan riwayat kalkulasi.",
  "Setup ini sengaja menaruh logika hitung di modul terpisah agar mudah dipindah ke Server Actions atau Supabase pada tahap berikutnya.",
];

export default function AboutPage() {
  return (
    <SiteShell
      title="Tentang LarisManis"
      description="Versi awal aplikasi ini berfokus pada akurasi perhitungan dan alur kerja seller yang sederhana, terutama untuk pengguna pemula yang ingin cepat tahu apakah produknya masih untung."
    >
      <section className="grid gap-4">
        {points.map((point) => (
          <article key={point} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-7 text-slate-600 sm:text-base">{point}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
