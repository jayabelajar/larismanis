import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Clock3, LineChart, Store } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { formatCurrency } from "@/lib/format";
import { calculateSellingPrice } from "@/lib/calculator";

export const metadata: Metadata = {
  title: "Kalkulator Harga Jual Online dan Offline",
  description:
    "Hitung harga jual marketplace, GoFood, GrabFood, ShopeeFood, reseller, dan toko offline dengan simulasi profit bersih.",
  alternates: {
    canonical: "/",
  },
};

const preview = calculateSellingPrice({
  productName: "Kemeja Linen Premium",
  mode: "online",
  channel: "shopee",
  productCost: 50000,
  packingCost: 3500,
  operationalCost: 5000,
  targetProfit: 15000,
  fixedFee: 1250,
  sellerVoucher: 2000,
  desiredPrice: 95000,
  adminFee: 7.5,
  serviceFee: 1.5,
  paymentFee: 2,
  shippingProgramFee: 4,
  campaignFee: 1.5,
  affiliateFee: 5,
  adsFee: 3,
  taxFee: 0.5,
});

const highlights = [
  {
    title: "Hitung harga jual aman",
    description: "Masukkan modal, target profit, dan semua potongan channel penjualan dalam satu alur.",
    icon: Calculator,
  },
  {
    title: "Mode online dan offline",
    description: "Pilih jalur jualan yang sesuai, dari marketplace sampai toko offline dan reseller.",
    icon: Store,
  },
  {
    title: "Simulasi profit cepat",
    description: "Uji harga jual tertentu untuk melihat apakah margin masih aman atau sudah terlalu tipis.",
    icon: LineChart,
  },
  {
    title: "Riwayat butuh login",
    description: "Kalkulator terbuka untuk publik, tetapi riwayat kalkulasi hanya tersedia setelah login.",
    icon: Clock3,
  },
];

export default function HomePage() {
  return (
    <SiteShell
      title="Tentukan harga jual online atau offline tanpa menebak margin."
      description="LarisManis membantu seller menghitung harga jual minimal, harga aman, dan simulasi profit setelah dipotong admin fee, layanan, komisi merchant, iklan, affiliate, voucher, dan biaya tambahan lain."
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-5 rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <div className="grid gap-3">
            <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Kalkulator harga jual seller
            </span>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Fokus ke profit bersih, bukan cuma markup modal.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Sekarang kalkulator bisa dipakai untuk jualan marketplace, merchant seperti GoFood atau GrabFood, sampai penjualan offline dengan komisi reseller.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Mulai hitung
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/history"
              className="inline-flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Riwayat login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Preview hasil</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Kemeja Linen Premium
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Online · Shopee
            </span>
          </div>
          <dl className="mt-6 grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-500">Harga minimal</dt>
              <dd className="text-lg font-semibold text-slate-950">{formatCurrency(preview.minimumPrice)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-500">Harga aman</dt>
              <dd className="text-lg font-semibold text-slate-950">
                {formatCurrency(preview.recommendedPrice)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-500">Harga psikologis</dt>
              <dd className="text-lg font-semibold text-slate-950">
                {formatCurrency(preview.psychologicalPrice)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-500">Profit simulasi</dt>
              <dd className="text-lg font-semibold text-emerald-700">
                {formatCurrency(preview.desiredPriceProfit)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LarisManis",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Kalkulator harga jual online dan offline untuk seller marketplace, merchant delivery, dan toko offline.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "IDR",
            },
          }),
        }}
      />
    </SiteShell>
  );
}
