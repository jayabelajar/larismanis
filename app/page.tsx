import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { FAQAccordion } from "@/components/faq-accordion";
import {
  Calculator,
  ShoppingBag,
  Store,
  Music4,
  Heart,
  PieChart,
  Zap,
  Percent,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkulator Harga Jual Online dan Offline",
  description:
    "Hitung harga jual marketplace, GoFood, GrabFood, ShopeeFood, reseller, dan toko offline dengan simulasi profit bersih.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <SiteShell hideHeader={true}>
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="inline-flex items-center rounded-full border-2 border-darkText bg-brutalYellow px-4 py-1.5 font-bold mb-8 shadow-brutal-sm transform -rotate-2 text-xs md:text-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brutalRed mr-2 animate-pulse"></span>
          Siap untuk Aturan Pajak 2026!
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight text-darkText">
          Jualan Anti Boncos. <br className="hidden sm:block" />
          <span className="inline-block bg-brutalBlue text-darkText px-4 py-1 border-2 border-darkText shadow-brutal transform rotate-1 mt-2">
            Profit Maksimal!
          </span>
        </h1>
        <p className="max-w-[42rem] text-darkText/80 font-semibold sm:text-xl sm:leading-8 mb-10 text-sm md:text-base">
          Kalkulator harga jual dengan formula rahasia <strong>Gross-Up</strong>. Hitung presisi potongan admin, layanan, gratis ongkir, hingga biaya iklan di semua marketplace.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center px-4">
          <Link
            href="/calculator"
            className="btn-brutal inline-flex h-14 items-center justify-center rounded-xl border-2 border-darkText bg-brutalRed px-8 font-bold text-white shadow-brutal text-base md:text-lg"
          >
            Mulai Menghitung Gratis
          </Link>
          <a
            href="#fitur"
            className="btn-brutal inline-flex h-14 items-center justify-center rounded-xl border-2 border-darkText bg-white px-8 font-bold text-darkText shadow-brutal text-base md:text-lg"
          >
            Lihat Fiturnya
          </a>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-2 border-darkText bg-white py-6 px-4 rounded-2xl shadow-brutal mb-16 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
          <p className="font-bold text-darkText uppercase tracking-widest text-xs bg-brutalYellow px-3 py-1.5 border-2 border-darkText rounded-md shadow-brutal-sm">
            Support Platform
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 font-extrabold text-lg md:text-xl text-darkText">
              <div className="p-2 bg-orange-100 border-2 border-darkText rounded-full">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
              </div>{" "}
              Shopee
            </div>
            <div className="flex items-center gap-2 font-extrabold text-lg md:text-xl text-darkText">
              <div className="p-2 bg-green-100 border-2 border-darkText rounded-full">
                <Store className="h-5 w-5 text-green-500" />
              </div>{" "}
              Tokopedia
            </div>
            <div className="flex items-center gap-2 font-extrabold text-lg md:text-xl text-darkText">
              <div className="p-2 bg-pink-100 border-2 border-darkText rounded-full">
                <Music4 className="h-5 w-5 text-pink-500" />
              </div>{" "}
              TikTok
            </div>
            <div className="flex items-center gap-2 font-extrabold text-lg md:text-xl text-darkText">
              <div className="p-2 bg-blue-100 border-2 border-darkText rounded-full">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>{" "}
              Lazada
            </div>
          </div>
        </div>
      </section>

      {/* Features (Bento Grid) */}
      <section id="fitur" className="py-12 mb-16 scroll-mt-20">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-extrabold text-3xl md:text-5xl border-b-4 border-darkText inline-block pb-2 text-darkText">
            Senjata Rahasia Seller
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
          {/* Card 1 */}
          <div className="md:col-span-2 rounded-2xl border-2 border-darkText bg-brutalPurple shadow-brutal p-6 md:p-8 flex flex-col justify-between transform transition hover:-translate-y-1">
            <div>
              <div className="inline-block bg-white border-2 border-darkText p-3 rounded-xl mb-4 shadow-brutal-sm">
                <Percent className="h-8 w-8 text-darkText" />
              </div>
              <h3 className="font-extrabold text-2xl mb-3 text-darkText">Formula Gross-Up Super Akurat</h3>
              <p className="font-semibold text-darkText/80 text-sm md:text-base leading-relaxed">
                Kebanyakan kalkulator hanya menambah persen ke modal. Kami menghitung terbalik dari harga akhir agar margin net kamu utuh 100% dari harga jual sesungguhnya.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border-2 border-darkText bg-brutalYellow shadow-brutal p-6 md:p-8 flex flex-col justify-between transform transition hover:-translate-y-1">
            <div>
              <div className="inline-block bg-white border-2 border-darkText p-3 rounded-xl mb-4 shadow-brutal-sm">
                <PieChart className="h-8 w-8 text-darkText" />
              </div>
              <h3 className="font-extrabold text-xl mb-3 text-darkText">Semua Komponen</h3>
              <p className="font-semibold text-darkText/80 text-sm leading-relaxed">
                Biaya admin, layanan, gratis ongkir, komisi affiliate, sampai potongan PPN terhitung rapi. Gak ada lagi biaya siluman!
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border-2 border-darkText bg-brutalGreen shadow-brutal p-6 md:p-8 flex flex-col justify-between transform transition hover:-translate-y-1">
            <div>
              <div className="inline-block bg-white border-2 border-darkText p-3 rounded-xl mb-4 shadow-brutal-sm">
                <Zap className="h-8 w-8 text-darkText" />
              </div>
              <h3 className="font-extrabold text-xl mb-3 text-darkText">Super Cepat</h3>
              <p className="font-semibold text-darkText/80 text-sm leading-relaxed">
                Selamat tinggal rumus Excel rumit yang bikin pusing kepala. Tampilan UI ceria, hasil instan keluar sekali ketik.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 rounded-2xl border-2 border-darkText bg-darkText text-white shadow-brutal p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transform transition hover:-translate-y-1">
            <div>
              <h3 className="font-extrabold text-3xl mb-2 text-brutalYellow">100% Gratis Selamanya</h3>
              <p className="font-semibold text-gray-300 text-sm md:text-base">
                Dibuat khusus untuk mendukung Gen-Z dan memajukan ekosistem UMKM lokal.
              </p>
            </div>
            <Link
              href="/calculator"
              className="btn-brutal inline-flex whitespace-nowrap h-12 items-center justify-center rounded-xl border-2 border-white bg-brutalRed px-6 font-bold text-white shadow-[4px_4px_0px_0px_white]"
            >
              Coba Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="bg-brutalBlue border-2 border-darkText rounded-3xl p-6 md:p-12 mb-16 shadow-brutal scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white border-2 border-darkText px-4 py-1.5 rounded-full font-bold mb-6 shadow-brutal-sm transform rotate-2 text-xs md:text-sm text-darkText">
                Gampang Banget!
              </div>
              <h2 className="font-extrabold text-4xl sm:text-5xl mb-8 text-darkText leading-tight">
                Cuma Butuh <br />3 Langkah.
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-white p-4 rounded-xl border-2 border-darkText shadow-brutal-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-darkText bg-brutalYellow font-extrabold text-xl text-darkText">
                    1
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 text-darkText">Input Modal</h4>
                    <p className="font-semibold text-darkText/70 text-sm">Masukkan modal barang & target cuan.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white p-4 rounded-xl border-2 border-darkText shadow-brutal-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-darkText bg-brutalPurple font-extrabold text-xl text-darkText">
                    2
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 text-darkText">Set Persentase</h4>
                    <p className="font-semibold text-darkText/70 text-sm">Masukkan fee admin marketplace.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white p-4 rounded-xl border-2 border-darkText shadow-brutal-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-darkText bg-brutalRed text-white font-extrabold text-xl">
                    3
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1 text-darkText">Upload Harga!</h4>
                    <p className="font-semibold text-darkText/70 text-sm">Copy harga jual akhir yang aman.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic Element Mock */}
            <div className="relative bg-white border-4 border-darkText rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] transform rotate-1">
              <div className="flex gap-2 mb-4">
                <div className="w-4 h-4 rounded-full bg-brutalRed border-2 border-darkText"></div>
                <div className="w-4 h-4 rounded-full bg-brutalYellow border-2 border-darkText"></div>
                <div className="w-4 h-4 rounded-full bg-brutalGreen border-2 border-darkText"></div>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-full bg-bgLight border-2 border-darkText rounded-xl flex items-center px-4 font-bold text-darkText text-sm">
                  Kemeja Linen Premium
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-full bg-bgLight border-2 border-darkText rounded-xl flex items-center px-4 font-bold text-darkText text-xs">
                    Modal: Rp 50.000
                  </div>
                  <div className="h-12 w-full bg-bgLight border-2 border-darkText rounded-xl flex items-center px-4 font-bold text-darkText text-xs">
                    Cuan: Rp 15.000
                  </div>
                </div>
                <div className="pt-6 border-t-2 border-dashed border-darkText mt-6 text-center">
                  <span className="inline-block bg-brutalPurple text-darkText font-bold px-3 py-1 border-2 border-darkText rounded-lg shadow-brutal-sm mb-2 text-xs">
                    Harga Disarankan
                  </span>
                  <div className="text-4xl font-extrabold text-darkText">Rp 125.000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto py-12 mb-8 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-extrabold text-3xl md:text-4xl mb-4 text-darkText">Masih Bingung?</h2>
        </div>
        <FAQAccordion />
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
