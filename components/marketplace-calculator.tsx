"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Save, Trash2 } from "lucide-react";
import { calculateSellingPrice } from "@/lib/calculator";
import { formatCurrency, formatPercent } from "@/lib/format";
import { DEFAULT_PRESETS, getPresetByKey } from "@/lib/presets";
import { loadHistory, loadPresets, saveHistory } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
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
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  name: keyof CalculatorForm;
  value: number;
  prefix?: string;
  suffix?: string;
  onChange: (name: keyof CalculatorForm, value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
      <span>{label}</span>
      <div className="relative flex items-center w-full">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 text-xs font-extrabold text-darkText/60">
            {prefix}
          </span>
        ) : null}
        <input
          className={`h-11 w-full rounded-xl border-2 border-darkText bg-white ${
            prefix ? "pl-10" : "pl-4"
          } ${
            suffix ? "pr-16" : "pr-4"
          } text-sm font-bold text-darkText outline-none transition-all placeholder:text-darkText/45 focus:bg-white focus:ring-4 focus:ring-brutalBlue/40`}
          type="number"
          min="0"
          step="any"
          value={value === 0 ? "" : value}
          onChange={(event) => onChange(name, Number(event.target.value))}
          placeholder="0"
        />
        {suffix ? (
          <span className="absolute right-2 text-[10px] font-extrabold text-darkText bg-brutalYellow px-2 py-0.5 rounded-lg border-2 border-darkText shadow-brutal-sm">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function MarketplaceCalculator() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
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

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // Calculate recommendation breakdown percentages for visual fee breakdown bar
  const totalRecommended = result.recommendedPrice || 1;
  const basePct = Math.max(0, Math.min(100, (result.totalBaseCost / totalRecommended) * 100));
  const feePct = Math.max(0, Math.min(100, (result.totalMarketplaceCut / totalRecommended) * 100));
  const profitPct = Math.max(0, Math.min(100, (result.netProfitAtRecommended / totalRecommended) * 100));

  function resetForm() {
    applyPreset(getPresetByKey("shopee"));
    setForm(initialForm);
    setSaveMessage("");
  }

  function saveCurrentCalculation() {
    if (!userEmail) {
      router.push("/login?callbackUrl=/history");
      return;
    }

    const history = loadHistory(userEmail);
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

    saveHistory(userEmail, [item, ...history].slice(0, 25));
    setSaveMessage("Riwayat kalkulasi tersimpan di browser ini.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="grid gap-8">
        {/* Panel Info & Saluran */}
        <div className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText sm:col-span-2">
              <span>Nama Produk</span>
              <input
                className="h-11 rounded-xl border-2 border-darkText bg-white px-4 text-sm font-bold text-darkText outline-none transition-all placeholder:text-darkText/45 focus:bg-white focus:ring-4 focus:ring-brutalBlue/40"
                placeholder="Contoh: Kemeja Linen Premium"
                value={form.productName}
                onChange={(event) => updateField("productName", event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
              <span>Mode Penjualan</span>
              <div className="grid h-11 grid-cols-2 rounded-xl bg-white p-1 border-2 border-darkText shadow-brutal-sm">
                {(["online", "offline"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleModeChange(mode)}
                    className={`rounded-lg text-[10px] md:text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      form.mode === mode
                        ? "bg-brutalBlue text-darkText border-2 border-darkText shadow-brutal-sm"
                        : "text-darkText hover:bg-bgLight"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </label>
            <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
              <span>
                {form.mode === "online" ? "Channel Penjualan" : "Channel Offline"}
              </span>
              <div className="relative flex items-center">
                <select
                  className="h-11 w-full rounded-xl border-2 border-darkText bg-white pl-4 pr-10 text-sm font-bold text-darkText outline-none transition-all focus:bg-white focus:ring-4 focus:ring-brutalBlue/40 appearance-none cursor-pointer"
                  value={form.channel}
                  onChange={(event) => handleChannelChange(event.target.value as SalesChannelKey)}
                >
                  {channelPresets.map((preset) => (
                    <option key={preset.key} value={preset.key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 text-darkText">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </label>
            <label className="flex flex-col gap-2 text-xs font-extrabold uppercase tracking-wider text-darkText">
              <span>Preset Aktif</span>
              <div className="flex h-11 items-center rounded-xl border-2 border-darkText bg-brutalGreen px-4 text-sm font-extrabold text-darkText shadow-brutal-sm">
                {activeChannel?.label ?? "-"}
              </div>
            </label>
            <Field
              label="Harga Jual Simulasi"
              name="desiredPrice"
              value={form.desiredPrice}
              prefix="Rp"
              onChange={updateField}
            />
          </div>
        </div>

        {/* Panel Biaya Produk */}
        <div className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b-2 border-darkText pb-4">
            <h3 className="text-xl font-extrabold text-darkText">Biaya Produk & Target</h3>
            <p className="text-xs font-semibold text-darkText/70 leading-relaxed">Masukkan modal per unit dan keuntungan bersih yang dibidik.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Modal Produk" name="productCost" value={form.productCost} prefix="Rp" onChange={updateField} />
            <Field label="Biaya Packing" name="packingCost" value={form.packingCost} prefix="Rp" onChange={updateField} />
            <Field
              label="Biaya Operasional"
              name="operationalCost"
              value={form.operationalCost}
              prefix="Rp"
              onChange={updateField}
            />
            <Field label="Target Keuntungan" name="targetProfit" value={form.targetProfit} prefix="Rp" onChange={updateField} />
            <Field label="Biaya Tetap Transaksi" name="fixedFee" value={form.fixedFee} prefix="Rp" onChange={updateField} />
            <Field label="Voucher Seller" name="sellerVoucher" value={form.sellerVoucher} prefix="Rp" onChange={updateField} />
          </div>
        </div>

        {/* Panel Persentase Potongan Channel */}
        <div className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b-2 border-darkText pb-4">
            <h3 className="text-xl font-extrabold text-darkText">Potongan Channel Penjualan</h3>
            <p className="text-xs font-semibold text-darkText/70 leading-relaxed">
              Persentase komisi, pajak, admin fee, program gratis ongkir, serta alokasi iklan promosi.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Admin Fee" name="adminFee" value={form.adminFee} suffix="%" onChange={updateField} />
            <Field label="Service Fee" name="serviceFee" value={form.serviceFee} suffix="%" onChange={updateField} />
            <Field label="Payment Fee" name="paymentFee" value={form.paymentFee} suffix="%" onChange={updateField} />
            <Field
              label="Gratis Ongkir Program"
              name="shippingProgramFee"
              value={form.shippingProgramFee}
              suffix="%"
              onChange={updateField}
            />
            <Field label="Campaign Fee" name="campaignFee" value={form.campaignFee} suffix="%" onChange={updateField} />
            <Field
              label="Affiliate Fee"
              name="affiliateFee"
              value={form.affiliateFee}
              suffix="%"
              onChange={updateField}
            />
            <Field label="Ads Fee" name="adsFee" value={form.adsFee} suffix="%" onChange={updateField} />
            <Field label="Pajak" name="taxFee" value={form.taxFee} suffix="%" onChange={updateField} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={saveCurrentCalculation}
            className="btn-brutal inline-flex h-11 items-center gap-2 rounded-xl border-2 border-darkText bg-brutalBlue px-5 text-sm font-bold text-darkText shadow-brutal hover:shadow-brutal-hover cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Simpan Riwayat
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn-brutal inline-flex h-11 items-center gap-2 rounded-xl border-2 border-darkText bg-white px-5 text-sm font-bold text-darkText shadow-brutal hover:shadow-brutal-hover cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Reset Input
          </button>
          {!userEmail ? (
            <p className="text-xs font-bold text-darkText/70">
              Riwayat membutuhkan login.{" "}
              <Link href="/login" className="font-extrabold text-brutalRed hover:underline decoration-2">
                Masuk ke Akun
              </Link>
            </p>
          ) : null}
          {saveMessage ? (
            <p className="text-xs font-bold text-darkText bg-brutalYellow border-2 border-darkText px-3 py-1.5 rounded-lg shadow-brutal-sm">
              {saveMessage}
            </p>
          ) : null}
        </div>
      </section>

      {/* ASIDE PANEL - RESULTS */}
      <aside className="grid gap-8 self-start">
        {/* Harga Ringkasan Utama */}
        <section className="rounded-3xl border-2 border-darkText bg-brutalRed p-6 text-white shadow-brutal sm:p-8 flex flex-col gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/95">Harga Jual Minimal</p>
            <p className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatCurrency(result.minimumPrice)}
            </p>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white border-2 border-darkText p-4 shadow-brutal-sm text-darkText">
              <p className="text-[10px] font-bold uppercase tracking-wider text-darkText/60">Harga Aman</p>
              <p className="mt-1 text-lg font-extrabold">{formatCurrency(result.recommendedPrice)}</p>
            </div>
            <div className="rounded-2xl bg-white border-2 border-darkText p-4 shadow-brutal-sm text-darkText">
              <p className="text-[10px] font-bold uppercase tracking-wider text-darkText/60">Harga Psikologis</p>
              <p className="mt-1 text-lg font-extrabold">{formatCurrency(result.psychologicalPrice)}</p>
            </div>
          </div>
        </section>

        {/* Visual Fee Breakdown Bar */}
        <section className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-extrabold text-darkText">Distribusi Harga Aman</h4>
            <p className="text-[11px] font-semibold text-darkText/70">Bagaimana harga rekomendasi dialokasikan.</p>
          </div>
          <div className="h-5 w-full rounded-xl bg-bgLight overflow-hidden flex border-2 border-darkText shadow-brutal-sm">
            <div
              style={{ width: `${basePct}%` }}
              className="bg-brutalGreen h-full transition-all border-r-2 border-darkText"
              title={`Modal: ${formatPercent(basePct / 100)}`}
            />
            <div
              style={{ width: `${feePct}%` }}
              className="bg-brutalYellow h-full transition-all border-r-2 border-darkText"
              title={`Biaya/Potongan: ${formatPercent(feePct / 100)}`}
            />
            <div
              style={{ width: `${profitPct}%` }}
              className="bg-brutalPurple h-full transition-all"
              title={`Profit Bersih: ${formatPercent(profitPct / 100)}`}
            />
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-extrabold uppercase tracking-wider text-darkText">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-brutalGreen border border-darkText flex-shrink-0" />
              <span className="truncate">Modal ({formatPercent(basePct / 100)})</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <span className="h-2.5 w-2.5 rounded bg-brutalYellow border border-darkText flex-shrink-0" />
              <span className="truncate">Fee ({formatPercent(feePct / 100)})</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="h-2.5 w-2.5 rounded bg-brutalPurple border border-darkText flex-shrink-0" />
              <span className="truncate">Profit ({formatPercent(profitPct / 100)})</span>
            </div>
          </div>
        </section>

        {/* Ringkasan Kalkulasi Detail */}
        <section className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-5">
          <h4 className="text-sm font-extrabold text-darkText">Ringkasan Perhitungan</h4>
          <dl className="grid gap-3.5 text-xs divide-y-2 divide-darkText">
            <div className="flex items-center justify-between gap-4 pt-3.5 first:pt-0">
              <dt className="text-darkText/70 font-bold">Total Modal Produk</dt>
              <dd className="font-extrabold text-darkText">{formatCurrency(result.totalBaseCost)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Total Potongan Persen</dt>
              <dd className="font-extrabold text-darkText">{formatPercent(result.totalPercentageFee)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Biaya Transaksi Tetap</dt>
              <dd className="font-extrabold text-darkText">{formatCurrency(result.totalFixedCost)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Nominal Fee di Harga Aman</dt>
              <dd className="font-extrabold text-darkText">{formatCurrency(result.totalMarketplaceCut)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Profit di Harga Aman</dt>
              <dd className="font-extrabold text-brutalRed">{formatCurrency(result.netProfitAtRecommended)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Margin di Harga Aman</dt>
              <dd className="font-extrabold text-darkText">{formatPercent(result.marginAtRecommended)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Kelayakan Profit</dt>
              <dd className="font-bold">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border-2 border-darkText shadow-brutal-sm ${
                    result.profitabilityStatus === "untung"
                      ? "bg-brutalGreen text-darkText"
                      : "bg-brutalRed text-white"
                  }`}
                >
                  {result.profitabilityStatus}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        {/* Simulasi Harga Uji */}
        <section className="rounded-3xl border-2 border-darkText bg-white p-6 shadow-brutal sm:p-8 flex flex-col gap-5">
          <h4 className="text-sm font-extrabold text-darkText">Hasil Simulasi</h4>
          <dl className="grid gap-3.5 text-xs divide-y-2 divide-darkText">
            <div className="flex items-center justify-between gap-4 pt-3.5 first:pt-0">
              <dt className="text-darkText/70 font-bold">Harga Uji</dt>
              <dd className="font-extrabold text-darkText">{formatCurrency(form.desiredPrice)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Profit Bersih Simulasi</dt>
              <dd className="font-extrabold text-darkText">{formatCurrency(result.desiredPriceProfit)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Margin Simulasi</dt>
              <dd className="font-extrabold text-darkText">{formatPercent(result.desiredPriceMargin)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3.5">
              <dt className="text-darkText/70 font-bold">Status Risiko</dt>
              <dd className="font-bold">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border-2 border-darkText shadow-brutal-sm ${
                    result.simulationStatus === "aman"
                      ? "bg-brutalGreen text-darkText"
                      : result.simulationStatus === "tipis"
                        ? "bg-brutalYellow text-darkText"
                        : "bg-brutalRed text-white"
                  }`}
                >
                  {result.simulationStatus}
                </span>
              </dd>
            </div>
          </dl>
        </section>
      </aside>
    </div>
  );
}
