import { SiteShell } from "@/components/site-shell";

const points = [
  "LarisManis dibuat untuk seller yang butuh cara cepat menghitung harga jual aman di channel online maupun offline.",
  "Ruang lingkup MVP sekarang mencakup landing page, kalkulator, preset channel, simulasi profit, dan riwayat kalkulasi.",
  "Setup ini sengaja menaruh logika hitung di modul terpisah agar mudah dipindah ke Server Actions atau Supabase pada tahap berikutnya.",
];

const colors = ["bg-brutalPurple", "bg-brutalYellow", "bg-brutalGreen"];

export default function AboutPage() {
  return (
    <SiteShell
      title="Tentang LarisManis"
      description="Versi awal aplikasi ini berfokus pada akurasi perhitungan dan alur kerja seller yang sederhana, terutama untuk pengguna pemula yang ingin cepat tahu apakah produknya masih untung."
    >
      <div className="grid gap-6 max-w-4xl">
        {points.map((point, index) => (
          <article
            key={point}
            className={`rounded-3xl border-2 border-darkText ${colors[index % colors.length]} p-6 shadow-brutal sm:p-8 transform transition hover:-translate-y-1`}
          >
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-darkText">
              {point}
            </p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
