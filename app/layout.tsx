import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://larismanis.id"),
  title: {
    default: "LarisManis",
    template: "%s | LarisManis",
  },
  description:
    "Kalkulator harga jual online dan offline untuk seller marketplace, GoFood, GrabFood, ShopeeFood, reseller, dan toko offline.",
  applicationName: "LarisManis",
  keywords: [
    "kalkulator harga jual",
    "kalkulator marketplace",
    "kalkulator gofood",
    "kalkulator grabfood",
    "harga jual shopee",
    "simulasi profit jualan",
    "kalkulator reseller",
    "kalkulator toko offline",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LarisManis",
    description:
      "Hitung harga jual aman untuk marketplace, merchant food delivery, dan penjualan offline.",
    url: "https://larismanis.id",
    siteName: "LarisManis",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LarisManis",
    description:
      "Kalkulator harga jual online dan offline untuk seller yang ingin hitung profit dengan cepat.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
