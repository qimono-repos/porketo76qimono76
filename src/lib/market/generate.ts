import { UNIVERSE, type Ticker } from "./universe";

export const MARKET_START = "2025-01-02";
export const MARKET_AS_OF = "2026-08-18";

export type DayMark = {
  date: string;
  price: number;
  value: number;
};

export type TickerSeries = {
  ticker: Ticker;
  days: DayMark[];
};

export type MarketBook = {
  dates: string[];
  series: TickerSeries[];
  bySymbol: Record<string, TickerSeries>;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function enumerateDates(start: string, end: string): string[] {
  const out: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (cursor <= last) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Shared tape so names move together, with a few regime shifts. */
function marketShock(date: string, rand: () => number): number {
  const month = date.slice(0, 7);
  let bias = 0;
  if (month === "2025-04") bias = -0.0062;
  else if (month === "2025-08") bias = 0.0024;
  else if (month === "2025-11") bias = 0.0046;
  else if (month === "2026-02") bias = -0.0036;
  else if (month === "2026-06") bias = 0.0038;
  else if (month === "2026-07") bias = 0.0044;
  else if (month === "2026-08") bias = -0.0018;
  return bias + gaussian(rand) * 0.011;
}

function buildBook(): MarketBook {
  const dates = enumerateDates(MARKET_START, MARKET_AS_OF);
  const marketRand = mulberry32(0x51a7c0de);
  const shocks = dates.map((d) => marketShock(d, marketRand));

  const series = UNIVERSE.map((ticker) => {
    const rand = mulberry32(hashString(ticker.symbol));
    const path: number[] = new Array(dates.length);
    // Walk backwards from the anchor so the last print matches the target.
    path[dates.length - 1] = ticker.anchor;
    for (let i = dates.length - 2; i >= 0; i -= 1) {
      const date = dates[i + 1]!;
      const isWeekend = weekday(date) === 0 || weekday(date) === 6;
      if (ticker.class === "equity" && isWeekend) {
        path[i] = path[i + 1]!;
        continue;
      }
      const idio = ticker.drift / 365 + ticker.vol * gaussian(rand) * 0.042;
      const mix = 0.55 * shocks[i + 1]! + 0.45 * idio;
      const prev = path[i + 1]! / (1 + mix);
      path[i] = Math.max(prev, ticker.anchor * 0.18);
    }

    const days: DayMark[] = dates.map((date, i) => {
      const price = Number(path[i]!.toFixed(ticker.anchor >= 200 ? 2 : 3));
      return { date, price, value: price * ticker.units };
    });

    return { ticker, days };
  });

  return {
    dates,
    series,
    bySymbol: Object.fromEntries(series.map((s) => [s.ticker.symbol, s])),
  };
}

let cached: MarketBook | null = null;

export function getMarketBook(): MarketBook {
  if (!cached) cached = buildBook();
  return cached;
}

export function sliceDays(days: DayMark[], from: string, to: string): DayMark[] {
  return days.filter((d) => d.date >= from && d.date <= to);
}
