import Link from "next/link";
import { Calculator, Clock3, Info, LayoutDashboard, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { AuthNav } from "@/components/auth-nav";

const navigation = [
  { href: "/", label: "Beranda", icon: LayoutDashboard },
  { href: "/calculator", label: "Kalkulator", icon: Calculator },
  { href: "/history", label: "Riwayat", icon: Clock3 },
  { href: "/presets", label: "Preset Fee", icon: SlidersHorizontal },
  { href: "/about", label: "Tentang", icon: Info },
];

export function SiteShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
              LarisManis
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              Kalkulator harga jual untuk seller marketplace.
            </p>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <AuthNav />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            MVP Seller Tools
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
