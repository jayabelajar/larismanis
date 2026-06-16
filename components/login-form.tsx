"use client";

import Link from "next/link";
import { useState } from "react";
import { Chrome, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/auth-schema";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function handleSubmit(formData: FormData) {
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email atau password tidak valid.");
      return;
    }

    setPending(true);
    setError("");

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      callbackUrl: "/account",
    });

    setPending(false);

    if (!result || result.error) {
      setError("Email atau password salah.");
      return;
    }

    window.location.href = result.url ?? "/account";
  }

  async function handleGoogleLogin() {
    setGooglePending(true);
    await signIn("google", { callbackUrl: "/account" });
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Login</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Masuk pakai email dan password, atau langsung lanjut dengan akun Google.
        </p>
      </div>
      <form
        action={async (formData) => {
          await handleSubmit(formData);
        }}
        className="grid gap-4"
      >
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
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          {pending ? "Memproses..." : "Masuk"}
        </button>
      </form>
      {googleEnabled ? (
        <>
          <div className="my-5 h-px bg-slate-200" />
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googlePending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Chrome className="h-4 w-4" />
            {googlePending ? "Mengarahkan..." : "Lanjut dengan Google"}
          </button>
        </>
      ) : null}
      <p className="mt-5 text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-emerald-700">
          Daftar sekarang
        </Link>
      </p>
    </section>
  );
}
