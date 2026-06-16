"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chrome, UserPlus } from "lucide-react";
import { registerSchema } from "@/lib/auth-schema";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function handleRegister(formData: FormData) {
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data pendaftaran tidak valid.");
      return;
    }

    setPending(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            name: parsed.data.name,
          },
        },
      });

      if (signUpError) {
        setError(
          signUpError.message.includes("already registered")
            ? "Email sudah terdaftar. Silakan login."
            : "Gagal membuat akun.",
        );
        return;
      }

      if (data.session) {
        router.replace("/account");
        router.refresh();
        return;
      }

      setSuccess("Akun berhasil dibuat. Kalau verifikasi email aktif, cek inbox kamu lalu lanjut login.");
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleRegister() {
    setGooglePending(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/account`,
          skipBrowserRedirect: true,
        },
      });

      if (signInError) {
        setError("Daftar dengan Google belum aktif. Cek konfigurasi Google provider di Supabase.");
        setGooglePending(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Gagal mengarahkan ke Google.");
    } catch {
      setError("Gagal memulai autentikasi Google.");
    }

    setGooglePending(false);
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 border-b-2 border-darkText pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-darkText">Daftar akun</h2>
        <p className="text-xs font-semibold text-darkText/75 leading-relaxed">
          Buat akun email untuk masuk ke LarisManis, atau gunakan akun Google.
        </p>
      </div>
      <form
        action={async (formData) => {
          await handleRegister(formData);
        }}
        className="grid gap-4.5"
      >
        <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
          <span>Nama</span>
          <input
            name="name"
            required
            className="h-11 rounded-xl border-2 border-darkText bg-white px-4 text-sm font-bold text-darkText outline-none transition-all focus:bg-white focus:ring-4 focus:ring-brutalBlue/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            className="h-11 rounded-xl border-2 border-darkText bg-white px-4 text-sm font-bold text-darkText outline-none transition-all focus:bg-white focus:ring-4 focus:ring-brutalBlue/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            className="h-11 rounded-xl border-2 border-darkText bg-white px-4 text-sm font-bold text-darkText outline-none transition-all focus:bg-white focus:ring-4 focus:ring-brutalBlue/40"
          />
        </label>
        {error ? (
          <p className="text-xs font-bold text-white bg-brutalRed border-2 border-darkText px-3 py-1.5 rounded-lg shadow-brutal-sm">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-xs font-bold text-darkText bg-brutalGreen border-2 border-darkText px-3 py-1.5 rounded-lg shadow-brutal-sm">
            {success}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="btn-brutal inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-darkText bg-brutalBlue px-5 text-sm font-bold text-darkText shadow-brutal hover:shadow-brutal-hover disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          {pending ? "Membuat akun..." : "Daftar"}
        </button>
      </form>
      {googleEnabled ? (
        <>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t-2 border-darkText/20"></div>
            <span className="flex-shrink mx-4 text-[10px] font-extrabold uppercase tracking-wider text-darkText">Atau</span>
            <div className="flex-grow border-t-2 border-darkText/20"></div>
          </div>
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googlePending}
            className="btn-brutal inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-darkText bg-brutalYellow px-5 text-sm font-bold text-darkText shadow-brutal hover:shadow-brutal-hover disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <Chrome className="h-4 w-4" />
            {googlePending ? "Mengarahkan..." : "Daftar dengan Google"}
          </button>
        </>
      ) : null}
      <p className="text-center text-xs font-semibold text-darkText border-t-2 border-darkText pt-4 mt-2">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-extrabold text-brutalRed hover:underline decoration-2">
          Login di sini
        </Link>
      </p>
    </section>
  );
}
