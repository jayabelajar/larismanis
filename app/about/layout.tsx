import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Pelajari fungsi LarisManis sebagai kalkulator harga jual online dan offline untuk seller pemula maupun UMKM.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
