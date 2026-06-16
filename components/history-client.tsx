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
      <section className="rounded-3xl border-2 border-dashed border-darkText bg-white p-12 text-center shadow-brutal flex flex-col items-center justify-center gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-darkText bg-brutalYellow text-darkText shadow-brutal-sm">
          <Clock3 className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-extrabold text-darkText">Belum ada riwayat</h3>
          <p className="text-xs font-semibold text-darkText/70 max-w-sm leading-relaxed">
            Simpan hasil kalkulasi dari halaman kalkulator setelah login. Riwayat tersimpan per akun di browser ini.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold text-darkText/75">
          Menampilkan {items.length} kalkulasi terbaru untuk akun Anda.
        </p>
        <button
          type="button"
          onClick={clearHistory}
          className="btn-brutal inline-flex h-10 items-center gap-2 rounded-xl border-2 border-darkText bg-brutalRed text-white px-4 text-sm font-bold shadow-brutal-sm hover:shadow-brutal cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Semua
        </button>
      </div>
      <div className="grid gap-6">
        {items.map((item) => {
          const preset = getPresetByKey(item.channel);
          return (
            <article key={item.id} className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b-2 border-darkText pb-5">
                <div className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-lg bg-brutalYellow border-2 border-darkText px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-darkText shadow-brutal-sm">
                    {item.mode} · {preset.label}
                  </span>
                  <h3 className="text-lg font-extrabold text-darkText">
                    {item.productName}
                  </h3>
                  <p className="text-xs font-semibold text-darkText/60">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </p>
                </div>
                <div className="rounded-xl bg-brutalGreen px-4.5 py-3 border-2 border-darkText shadow-brutal-sm sm:text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-darkText/80">Harga Aman</p>
                  <p className="mt-1 text-2xl font-extrabold text-darkText">
                    {formatCurrency(item.recommendedPrice)}
                  </p>
                </div>
              </div>
              <dl className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="flex flex-col gap-1">
                  <dt className="text-darkText/70 font-bold">Harga Minimal</dt>
                  <dd className="font-extrabold text-darkText">{formatCurrency(item.minimumPrice)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-darkText/70 font-bold">Harga Uji</dt>
                  <dd className="font-extrabold text-darkText">{formatCurrency(item.desiredPrice)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-darkText/70 font-bold">Profit Bersih</dt>
                  <dd className="font-extrabold text-brutalRed">{formatCurrency(item.netProfit)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-darkText/70 font-bold">Margin</dt>
                  <dd className="font-extrabold text-darkText">{formatPercent(item.margin)}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
