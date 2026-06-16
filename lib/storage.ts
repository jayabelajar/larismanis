import { CalculationHistoryItem, SalesChannelPreset } from "@/lib/types";

export const HISTORY_STORAGE_KEY = "larismanis:history";
export const PRESET_STORAGE_KEY = "larismanis:presets";

export function loadHistory(): CalculationHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CalculationHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: CalculationHistoryItem[]) {
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
}

export function loadPresets(): SalesChannelPreset[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PRESET_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SalesChannelPreset[]) : null;
  } catch {
    return null;
  }
}

export function savePresets(items: SalesChannelPreset[]) {
  window.localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(items));
}
