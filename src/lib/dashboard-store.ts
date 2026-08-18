import { create } from "zustand";
import type { AssetClass } from "@/lib/market/universe";
import type { DateRange, RangePreset } from "@/lib/market/metrics";

type ClassFilter = "all" | AssetClass;

type DashboardState = {
  preset: RangePreset;
  custom: DateRange;
  classFilter: ClassFilter;
  selectedSymbol: string | null;
  hoverSymbol: string | null;
  query: string;
  setPreset: (preset: RangePreset) => void;
  setCustom: (range: DateRange) => void;
  setClassFilter: (filter: ClassFilter) => void;
  selectSymbol: (symbol: string | null) => void;
  setHoverSymbol: (symbol: string | null) => void;
  setQuery: (query: string) => void;
};

export const useDashboardStore = create<DashboardState>()((set) => ({
  preset: "1m",
  custom: { from: "2026-07-20", to: "2026-08-18" },
  classFilter: "all",
  selectedSymbol: null,
  hoverSymbol: null,
  query: "",
  setPreset: (preset) => set({ preset }),
  setCustom: (custom) => set({ custom, preset: "custom" }),
  setClassFilter: (classFilter) => set({ classFilter, selectedSymbol: null }),
  selectSymbol: (selectedSymbol) => set({ selectedSymbol }),
  setHoverSymbol: (hoverSymbol) => set({ hoverSymbol }),
  setQuery: (query) => set({ query }),
}));
