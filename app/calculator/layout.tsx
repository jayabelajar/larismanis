import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Harga Jual",
  description:
    "Simulasi harga jual, margin, profit bersih, dan potongan fee untuk marketplace, GoFood, GrabFood, ShopeeFood, reseller, dan toko offline.",
  alternates: {
    canonical: "/calculator",
  },
};

export default function CalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
