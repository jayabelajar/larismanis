"use client";

import { useState } from "react";
import { Clock3, Trash2 } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { loadHistory, saveHistory } from "@/lib/storage";
import { CalculationHistoryItem } from "@/lib/types";
import { getPresetByKey } from "@/lib/presets";

export function HistoryClient({ userEmail }: { userEmail: string }) {
  const [items, setItems] = useState<CalculationHistoryItem[]>(() => loadHistory(userEmail));

  function clearHistory() {
    saveHistory(userEmail, []);
    setItems([]);
  }

  if (!items.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <Clock3 className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-950">Belum ada riwayat</h2>
        <p className="mt-2 text-sm text-slate-500">
          Simpan hasil kalkulasi dari halaman kalkulator setelah login. Riwayat tersimpan per akun di browser ini.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Menampilkan {items.length} kalkulasi terbaru untuk akun yang sedang login.
        </p>
        <button
          type="button"
          onClick={clearHistory}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Trash2 className="h-4 w-4" />
          Hapus semua
        </button>
      </div>
      <div className="grid gap-4">
        {items.map((item) => {
          const preset = getPresetByKey(item.channel);
          return (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    {item.mode} · {preset.label}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    {item.productName}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Harga aman</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatCurrency(item.recommendedPrice)}
                  </p>
                </div>
              </div>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-slate-500">Harga minimal</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(item.minimumPrice)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Harga simulasi</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(item.desiredPrice)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Profit simulasi</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{formatCurrency(item.netProfit)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Margin</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{formatPercent(item.margin)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
