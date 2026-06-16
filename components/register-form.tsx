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
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Daftar akun</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Buat akun email untuk masuk ke LarisManis, atau gunakan akun Google.
        </p>
      </div>
      <form
        action={async (formData) => {
          await handleRegister(formData);
        }}
        className="grid gap-4"
      >
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span className="font-medium">Nama</span>
          <input
            name="name"
            required
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span className="font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span className="font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500"
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus className="h-4 w-4" />
          {pending ? "Membuat akun..." : "Daftar"}
        </button>
      </form>
      {googleEnabled ? (
        <>
          <div className="my-5 h-px bg-slate-200" />
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googlePending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Chrome className="h-4 w-4" />
            {googlePending ? "Mengarahkan..." : "Daftar dengan Google"}
          </button>
        </>
      ) : null}
      <p className="mt-5 text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-emerald-700">
          Login di sini
        </Link>
      </p>
    </section>
  );
}
