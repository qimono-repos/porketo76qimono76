import { getMarketBook, sliceDays, type DayMark, type TickerSeries } from "./generate";
import type { AssetClass } from "./universe";

export type RangePreset = "7d" | "1m" | "3m" | "ytd" | "1y" | "custom";

export type DateRange = { from: string; to: string };

export type AssetRow = {
  symbol: string;
  name: string;
  class: AssetClass;
  sector: string;
  venue: string;
  units: number;
  startPrice: number;
  endPrice: number;
  startValue: number;
  endValue: number;
  pnl: number;
  growth: number;
  weight: number;
  leaking: boolean;
  spark: number[];
};

export type BookKpis = {
  bookValue: number;
  startValue: number;
  revenue: number;
  growth: number;
  churn: number;
  winners: number;
  losers: number;
  priorRevenue: number;
  priorGrowth: number;
  priorChurn: number;
};

export type DashboardModel = {
  range: DateRange;
  prior: DateRange;
  kpis: BookKpis;
  rows: AssetRow[];
  bookTrend: { date: string; value: number; revenue: number }[];
  selectedTrend: { date: string; value: number; price: number }[];
};

const AS_OF = "2026-08-18";

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function resolveRange(preset: RangePreset, custom?: DateRange): DateRange {
  const to = AS_OF;
  if (preset === "custom" && custom?.from && custom.to) {
    return custom.from <= custom.to
      ? { from: custom.from, to: custom.to }
      : { from: custom.to, to: custom.from };
  }
  switch (preset) {
    case "7d":
      return { from: addDays(to, -6), to };
    case "1m":
      return { from: addDays(to, -29), to };
    case "3m":
      return { from: addDays(to, -89), to };
    case "ytd":
      return { from: "2026-01-01", to };
    case "1y":
      return { from: addDays(to, -364), to };
    default:
      return { from: addDays(to, -29), to };
  }
}

export function priorRange(range: DateRange): DateRange {
  const start = new Date(`${range.from}T00:00:00Z`);
  const end = new Date(`${range.to}T00:00:00Z`);
  const span = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86_400_000),
  );
  const priorTo = addDays(range.from, -1);
  return { from: addDays(priorTo, -span), to: priorTo };
}

function firstAndLast(days: DayMark[]): { first: DayMark; last: DayMark } | null {
  if (days.length === 0) return null;
  return { first: days[0]!, last: days[days.length - 1]! };
}

function sparkline(days: DayMark[], buckets = 18): number[] {
  if (days.length === 0) return [];
  if (days.length <= buckets) return days.map((d) => d.price);
  const out: number[] = [];
  const step = (days.length - 1) / (buckets - 1);
  for (let i = 0; i < buckets; i += 1) {
    out.push(days[Math.round(i * step)]!.price);
  }
  return out;
}

export function buildDashboard(opts: {
  range: DateRange;
  classFilter: "all" | AssetClass;
  selectedSymbol: string | null;
}): DashboardModel {
  const book = getMarketBook();
  const prior = priorRange(opts.range);

  const filtered = book.series.filter((s) =>
    opts.classFilter === "all" ? true : s.ticker.class === opts.classFilter,
  );

  const rows: AssetRow[] = filtered
    .map((s) => toRow(s, opts.range))
    .filter((r): r is AssetRow => r !== null);

  const bookValue = rows.reduce((acc, r) => acc + r.endValue, 0);
  const startValue = rows.reduce((acc, r) => acc + r.startValue, 0);
  const revenue = bookValue - startValue;
  const growth = startValue === 0 ? 0 : revenue / startValue;
  const leakValue = rows.filter((r) => r.leaking).reduce((acc, r) => acc + r.endValue, 0);
  const churn = bookValue === 0 ? 0 : leakValue / bookValue;

  const priorRows = filtered
    .map((s) => toRow(s, prior))
    .filter((r): r is AssetRow => r !== null);
  const priorEnd = priorRows.reduce((acc, r) => acc + r.endValue, 0);
  const priorStart = priorRows.reduce((acc, r) => acc + r.startValue, 0);
  const priorRevenue = priorEnd - priorStart;
  const priorGrowth = priorStart === 0 ? 0 : priorRevenue / priorStart;
  const priorLeak = priorRows.filter((r) => r.leaking).reduce((acc, r) => acc + r.endValue, 0);
  const priorChurn = priorEnd === 0 ? 0 : priorLeak / priorEnd;

  for (const row of rows) {
    row.weight = bookValue === 0 ? 0 : row.endValue / bookValue;
  }
  rows.sort((a, b) => b.endValue - a.endValue);

  const bookTrend = buildBookTrend(filtered, opts.range, startValue);
  const selected =
    opts.selectedSymbol && book.bySymbol[opts.selectedSymbol]
      ? book.bySymbol[opts.selectedSymbol]
      : null;
  const selectedDays = selected ? sliceDays(selected.days, opts.range.from, opts.range.to) : [];
  const selectedTrend = selectedDays.map((d) => ({
    date: d.date,
    value: d.value,
    price: d.price,
  }));

  return {
    range: opts.range,
    prior,
    kpis: {
      bookValue,
      startValue,
      revenue,
      growth,
      churn,
      winners: rows.filter((r) => r.pnl >= 0).length,
      losers: rows.filter((r) => r.pnl < 0).length,
      priorRevenue,
      priorGrowth,
      priorChurn,
    },
    rows,
    bookTrend,
    selectedTrend,
  };
}

function toRow(series: TickerSeries, range: DateRange): AssetRow | null {
  const days = sliceDays(series.days, range.from, range.to);
  const ends = firstAndLast(days);
  if (!ends) return null;
  const startValue = ends.first.value;
  const endValue = ends.last.value;
  const pnl = endValue - startValue;
  const growth = startValue === 0 ? 0 : pnl / startValue;
  return {
    symbol: series.ticker.symbol,
    name: series.ticker.name,
    class: series.ticker.class,
    sector: series.ticker.sector,
    venue: series.ticker.venue,
    units: series.ticker.units,
    startPrice: ends.first.price,
    endPrice: ends.last.price,
    startValue,
    endValue,
    pnl,
    growth,
    weight: 0,
    leaking: pnl < 0,
    spark: sparkline(days),
  };
}

function buildBookTrend(
  series: TickerSeries[],
  range: DateRange,
  startValue: number,
): { date: string; value: number; revenue: number }[] {
  const byDate = new Map<string, number>();
  for (const s of series) {
    for (const day of sliceDays(s.days, range.from, range.to)) {
      byDate.set(day.date, (byDate.get(day.date) ?? 0) + day.value);
    }
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value, revenue: value - startValue }));
}

export function formatUsd(value: number, compact = false): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (compact) {
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  }
  return `${sign}$${abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: abs >= 1000 ? 0 : 2,
  })}`;
}

export function formatSignedUsd(value: number, compact = false): string {
  const body = formatUsd(value, compact);
  if (value > 0) return `+${body}`;
  return body;
}

export function formatPct(value: number): string {
  const n = value * 100;
  const body = `${Math.abs(n).toFixed(2)}%`;
  if (n > 0) return `+${body}`;
  if (n < 0) return `-${body}`;
  return body;
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: value >= 1000 ? 2 : 3,
  })}`;
}

export function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${Number(d)}`;
}
