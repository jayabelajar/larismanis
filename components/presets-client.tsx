"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { DEFAULT_PRESETS } from "@/lib/presets";
import { loadPresets, savePresets } from "@/lib/storage";
import { SalesChannelPreset } from "@/lib/types";

const feeKeys: Array<keyof Omit<SalesChannelPreset, "key" | "label" | "mode">> = [
  "adminFee",
  "serviceFee",
  "paymentFee",
  "shippingProgramFee",
  "campaignFee",
  "affiliateFee",
  "adsFee",
  "taxFee",
  "fixedFee",
];

const feeLabels: Record<(typeof feeKeys)[number], string> = {
  adminFee: "Admin fee (%)",
  serviceFee: "Service fee (%)",
  paymentFee: "Payment fee (%)",
  shippingProgramFee: "Gratis ongkir (%)",
  campaignFee: "Campaign fee (%)",
  affiliateFee: "Affiliate fee (%)",
  adsFee: "Ads fee (%)",
  taxFee: "Pajak (%)",
  fixedFee: "Biaya tetap",
};

export function PresetsClient() {
  const [presets, setPresets] = useState<SalesChannelPreset[]>(() => loadPresets() ?? DEFAULT_PRESETS);
  const [message, setMessage] = useState("");

  function updateValue(index: number, key: (typeof feeKeys)[number], value: number) {
    setPresets((current) =>
      current.map((preset, presetIndex) =>
        presetIndex === index ? { ...preset, [key]: Math.max(0, value) } : preset,
      ),
    );
  }

  function handleSave() {
    savePresets(presets);
    setMessage("Preset fee berhasil disimpan di browser ini.");
  }

  function handleReset() {
    setPresets(DEFAULT_PRESETS);
    savePresets(DEFAULT_PRESETS);
    setMessage("Preset dikembalikan ke nilai default.");
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Save className="h-4 w-4" />
          Simpan preset
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset default
        </button>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </div>
      <div className="grid gap-4">
        {presets.map((preset, index) => (
          <section key={preset.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-950">{preset.label}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Mode {preset.mode}. Nilai di sini dipakai otomatis saat channel ini dipilih di kalkulator.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {feeKeys.map((key) => (
                <label key={key} className="flex flex-col gap-2 text-sm text-slate-700">
                  <span className="font-medium">{feeLabels[key]}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={preset[key]}
                    onChange={(event) => updateValue(index, key, Number(event.target.value))}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500"
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
