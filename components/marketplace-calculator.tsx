"use client";

import { useMemo, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { calculateSellingPrice } from "@/lib/calculator";
import { formatCurrency, formatPercent } from "@/lib/format";
import { DEFAULT_PRESETS, getPresetByKey } from "@/lib/presets";
import { loadHistory, loadPresets, saveHistory } from "@/lib/storage";
import {
  CalculationHistoryItem,
  CalculatorForm,
  SalesChannelKey,
  SalesChannelPreset,
  SalesMode,
} from "@/lib/types";

const initialForm: CalculatorForm = {
  productName: "",
  mode: "online",
  channel: "shopee",
  productCost: 50000,
  packingCost: 3500,
  operationalCost: 5000,
  targetProfit: 15000,
  fixedFee: 1250,
  sellerVoucher: 2000,
  desiredPrice: 95000,
  adminFee: 7.5,
  serviceFee: 1.5,
  paymentFee: 2,
  shippingProgramFee: 4,
  campaignFee: 1.5,
  affiliateFee: 5,
  adsFee: 3,
  taxFee: 0.5,
};

function Field({
  label,
  name,
  value,
  suffix,
  onChange,
}: {
  label: string;
  name: keyof CalculatorForm;
  value: number;
  suffix?: string;
  onChange: (name: keyof CalculatorForm, value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <input
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-14 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
          type="number"
          min="0"
          step="0.1"
          value={value}
          onChange={(event) => onChange(name, Number(event.target.value))}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function MarketplaceCalculator() {
  const [presets] = useState<SalesChannelPreset[]>(() => loadPresets() ?? DEFAULT_PRESETS);
  const [form, setForm] = useState<CalculatorForm>(() => {
    const activePreset = (loadPresets() ?? DEFAULT_PRESETS).find(
      (preset) => preset.key === initialForm.channel,
    );

    return activePreset
      ? {
          ...initialForm,
          mode: activePreset.mode,
          fixedFee: activePreset.fixedFee,
          adminFee: activePreset.adminFee,
          serviceFee: activePreset.serviceFee,
          paymentFee: activePreset.paymentFee,
          shippingProgramFee: activePreset.shippingProgramFee,
          campaignFee: activePreset.campaignFee,
          affiliateFee: activePreset.affiliateFee,
          adsFee: activePreset.adsFee,
          taxFee: activePreset.taxFee,
        }
      : initialForm;
  });
  const [saveMessage, setSaveMessage] = useState("");

  const result = useMemo(() => calculateSellingPrice(form), [form]);

  const channelPresets = presets.filter((preset) => preset.mode === form.mode);
  const activeChannel = channelPresets.find((preset) => preset.key === form.channel);

  function applyPreset(preset: SalesChannelPreset) {
    setForm((current) => ({
      ...current,
      mode: preset.mode,
      channel: preset.key,
      fixedFee: preset.fixedFee,
      adminFee: preset.adminFee,
      serviceFee: preset.serviceFee,
      paymentFee: preset.paymentFee,
      shippingProgramFee: preset.shippingProgramFee,
      campaignFee: preset.campaignFee,
      affiliateFee: preset.affiliateFee,
      adsFee: preset.adsFee,
      taxFee: preset.taxFee,
    }));
  }

  function updateField(name: keyof CalculatorForm, value: string | number) {
    setForm((current) => ({
      ...current,
      [name]:
        typeof value === "number" ? (Number.isFinite(value) ? Math.max(0, value) : 0) : value,
    }));
  }

  function handleModeChange(mode: SalesMode) {
    const nextPreset = presets.find((preset) => preset.mode === mode) ?? DEFAULT_PRESETS[0];
    applyPreset(nextPreset);
  }

  function handleChannelChange(value: SalesChannelKey) {
    const nextPreset = presets.find((preset) => preset.key === value) ?? getPresetByKey(value);
    applyPreset(nextPreset);
  }

  function resetForm() {
    applyPreset(getPresetByKey("shopee"));
    setForm(initialForm);
    setSaveMessage("");
  }

  function saveCurrentCalculation() {
    const history = loadHistory();
    const item: CalculationHistoryItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      productName: form.productName || "Produk tanpa nama",
      mode: form.mode,
      channel: form.channel,
      recommendedPrice: result.recommendedPrice,
      minimumPrice: result.minimumPrice,
      desiredPrice: form.desiredPrice,
      netProfit: result.desiredPriceProfit,
      margin: result.desiredPriceMargin,
      totalPercentageFee: result.totalPercentageFee,
    };

    saveHistory([item, ...history].slice(0, 25));
    setSaveMessage("Riwayat kalkulasi tersimpan di browser ini.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <section className="grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700 sm:col-span-2">
              <span className="font-medium">Nama produk</span>
              <input
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                placeholder="Contoh: Kemeja Linen Premium"
                value={form.productName}
                onChange={(event) => updateField("productName", event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              <span className="font-medium">Mode penjualan</span>
              <div className="grid h-11 grid-cols-2 rounded-xl bg-slate-100 p-1">
                {(["online", "offline"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleModeChange(mode)}
                    className={`rounded-lg text-sm font-medium capitalize ${
                      form.mode === mode ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              <span className="font-medium">
                {form.mode === "online" ? "Channel penjualan" : "Channel offline"}
              </span>
              <select
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500"
                value={form.channel}
                onChange={(event) => handleChannelChange(event.target.value as SalesChannelKey)}
              >
                {channelPresets.map((preset) => (
                  <option key={preset.key} value={preset.key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              <span className="font-medium">Preset aktif</span>
              <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600">
                {activeChannel?.label ?? "-"}
              </div>
            </label>
            <Field label="Harga jual simulasi" name="desiredPrice" value={form.desiredPrice} onChange={updateField} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Biaya produk</h2>
            <p className="text-sm text-slate-500">Masukkan modal inti dan target profit per produk.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Modal produk" name="productCost" value={form.productCost} onChange={updateField} />
            <Field label="Biaya packing" name="packingCost" value={form.packingCost} onChange={updateField} />
            <Field
              label="Biaya operasional"
              name="operationalCost"
              value={form.operationalCost}
              onChange={updateField}
            />
            <Field label="Target keuntungan" name="targetProfit" value={form.targetProfit} onChange={updateField} />
            <Field label="Biaya tetap transaksi" name="fixedFee" value={form.fixedFee} onChange={updateField} />
            <Field label="Voucher seller" name="sellerVoucher" value={form.sellerVoucher} onChange={updateField} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Persentase potongan channel</h2>
            <p className="text-sm text-slate-500">
              Cocok untuk marketplace, merchant food delivery, atau penjualan offline dengan komisi reseller.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Admin fee" name="adminFee" value={form.adminFee} suffix="%" onChange={updateField} />
            <Field label="Service fee" name="serviceFee" value={form.serviceFee} suffix="%" onChange={updateField} />
            <Field label="Payment fee" name="paymentFee" value={form.paymentFee} suffix="%" onChange={updateField} />
            <Field
              label="Gratis ongkir"
              name="shippingProgramFee"
              value={form.shippingProgramFee}
              suffix="%"
              onChange={updateField}
            />
            <Field label="Campaign fee" name="campaignFee" value={form.campaignFee} suffix="%" onChange={updateField} />
            <Field
              label="Affiliate fee"
              name="affiliateFee"
              value={form.affiliateFee}
              suffix="%"
              onChange={updateField}
            />
            <Field label="Ads fee" name="adsFee" value={form.adsFee} suffix="%" onChange={updateField} />
            <Field label="Pajak" name="taxFee" value={form.taxFee} suffix="%" onChange={updateField} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveCurrentCalculation}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Simpan riwayat
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" />
            Reset input
          </button>
          {saveMessage ? <p className="self-center text-sm text-emerald-700">{saveMessage}</p> : null}
        </div>
      </section>

      <aside className="grid gap-6 self-start">
        <section className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-slate-300">Harga jual minimal</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {formatCurrency(result.minimumPrice)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Harga aman</p>
                <p className="mt-2 text-xl font-semibold">{formatCurrency(result.recommendedPrice)}</p>
              </div>
              <div className="rounded-xl bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Harga psikologis</p>
                <p className="mt-2 text-xl font-semibold">{formatCurrency(result.psychologicalPrice)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Ringkasan kalkulasi</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Total modal</dt>
              <dd className="font-semibold text-slate-950">{formatCurrency(result.totalBaseCost)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Potongan channel</dt>
              <dd className="font-semibold text-slate-950">{formatPercent(result.totalPercentageFee)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Biaya tetap tambahan</dt>
              <dd className="font-semibold text-slate-950">{formatCurrency(result.totalFixedCost)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Total potongan di harga aman</dt>
              <dd className="font-semibold text-slate-950">{formatCurrency(result.totalMarketplaceCut)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Profit di harga aman</dt>
              <dd className="font-semibold text-emerald-700">{formatCurrency(result.netProfitAtRecommended)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Margin di harga aman</dt>
              <dd className="font-semibold text-slate-950">{formatPercent(result.marginAtRecommended)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-semibold capitalize text-white">
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs">
                  {result.profitabilityStatus}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Simulasi profit</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Harga uji</span>
              <span className="font-semibold text-slate-950">{formatCurrency(form.desiredPrice)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Profit bersih</span>
              <span className="font-semibold text-slate-950">{formatCurrency(result.desiredPriceProfit)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Margin</span>
              <span className="font-semibold text-slate-950">{formatPercent(result.desiredPriceMargin)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Status</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  result.simulationStatus === "aman"
                    ? "bg-emerald-50 text-emerald-700"
                    : result.simulationStatus === "tipis"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                }`}
              >
                {result.simulationStatus}
              </span>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
