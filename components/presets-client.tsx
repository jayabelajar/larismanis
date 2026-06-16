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
  fixedFee: "Biaya tetap (Rp)",
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
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="btn-brutal inline-flex h-11 items-center gap-2 rounded-xl border-2 border-darkText bg-brutalBlue px-5 text-sm font-bold text-darkText shadow-brutal hover:shadow-brutal-hover cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Simpan Preset
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn-brutal inline-flex h-11 items-center gap-2 rounded-xl border-2 border-darkText bg-white px-5 text-sm font-bold text-darkText shadow-brutal hover:shadow-brutal-hover cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Default
        </button>
        {message ? (
          <p className="text-xs font-bold text-darkText bg-brutalYellow border-2 border-darkText px-3 py-1.5 rounded-lg shadow-brutal-sm">
            {message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-6">
        {presets.map((preset, index) => (
          <section key={preset.key} className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b-2 border-darkText pb-4">
              <h3 className="text-xl font-extrabold text-darkText">{preset.label}</h3>
              <p className="text-xs font-semibold text-darkText/70 leading-relaxed">
                Mode {preset.mode}. Nilai di bawah ini akan otomatis dimuat saat Anda memilih channel ini di kalkulator.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {feeKeys.map((key) => (
                <label key={key} className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
                  <span>{feeLabels[key]}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={preset[key] === 0 ? "" : preset[key]}
                    onChange={(event) => updateValue(index, key, Number(event.target.value))}
                    placeholder="0"
                    className="h-11 rounded-xl border-2 border-darkText bg-white px-4 text-sm font-bold text-darkText outline-none transition-all focus:bg-white focus:ring-4 focus:ring-brutalBlue/40"
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
