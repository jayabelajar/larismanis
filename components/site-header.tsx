"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Calculator,
  Clock3,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  SlidersHorizontal,
  UserCircle2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { href: "/", label: "Beranda", icon: LayoutDashboard },
  { href: "/calculator", label: "Kalkulator", icon: Calculator },
  { href: "/history", label: "Riwayat", icon: Clock3 },
  { href: "/presets", label: "Preset Fee", icon: SlidersHorizontal },
  { href: "/about", label: "Tentang", icon: Info },
];

export function SiteHeader({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle logout
  async function handleLogout() {
    setIsPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  }

  const userDisplayName = user
    ? (user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email)
    : "";

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-darkText bg-bgLight">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-brutalYellow border-2 border-darkText p-1.5 rounded-lg shadow-brutal-sm">
              <Calculator className="h-5 w-5 text-darkText" />
            </div>
            <span className="font-bold tracking-tight text-xl text-darkText">LarisManis</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 font-bold text-darkText">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1 hover:text-brutalRed transition-colors ${
                    isActive ? "underline decoration-2 decoration-brutalRed underline-offset-4 text-brutalRed" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth / CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className={`btn-brutal inline-flex h-9 items-center gap-1.5 rounded-xl border-2 border-darkText bg-white px-3.5 text-xs font-bold text-darkText shadow-brutal-sm hover:bg-brutalGreen transition-all ${
                    pathname === "/account" ? "bg-brutalGreen" : ""
                  }`}
                >
                  <UserCircle2 className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{userDisplayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isPending}
                  className="btn-brutal inline-flex h-9 items-center gap-1.5 rounded-xl border-2 border-darkText bg-brutalRed px-3.5 text-xs font-bold text-white shadow-brutal-sm hover:shadow-brutal cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isPending ? "Keluar..." : "Keluar"}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="font-bold text-darkText hover:text-brutalRed transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-brutal inline-flex h-10 items-center justify-center rounded-xl border-2 border-darkText bg-brutalBlue px-5 py-2 font-bold text-darkText shadow-brutal transition-all hover:shadow-brutal-hover text-sm"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center rounded-lg border-2 border-darkText bg-white p-2 shadow-brutal-sm hover:bg-bgLight transition-colors"
            >
              {isOpen ? <X className="h-5 w-5 text-darkText" /> : <Menu className="h-5 w-5 text-darkText" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-b-2 border-darkText bg-brutalPurple transition-all">
          <div className="flex flex-col space-y-4 p-6 font-bold text-darkText">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 hover:underline decoration-2 ${
                    isActive ? "text-brutalRed underline underline-offset-4" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="border-t border-darkText/20 my-2 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 hover:underline decoration-2"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    <span>Akun: {userDisplayName}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isPending}
                    className="btn-brutal inline-flex h-10 w-full items-center justify-center rounded-xl border-2 border-darkText bg-brutalRed px-4 py-2 text-white font-bold shadow-brutal text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isPending ? "Keluar..." : "Keluar dari Akun"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center h-10 w-full rounded-xl border-2 border-darkText bg-white text-darkText font-bold shadow-brutal-sm text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-brutal flex h-10 w-full items-center justify-center rounded-xl border-2 border-darkText bg-brutalYellow px-4 py-2 shadow-brutal text-sm"
                  >
                    Daftar Akun Baru
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
