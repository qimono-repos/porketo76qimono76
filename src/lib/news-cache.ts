import type { DeskNews } from "@/lib/news";

const KEY = "porketo.desk-news.v2";
const DAY = 24 * 60 * 60 * 1000;

export type NewsCache = {
  fetchedAt: number;
  items: DeskNews[];
};

export function readNewsCache(): NewsCache | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NewsCache;
    if (!parsed || !Array.isArray(parsed.items) || typeof parsed.fetchedAt !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeNewsCache(items: DeskNews[]): NewsCache {
  const next: NewsCache = { fetchedAt: Date.now(), items };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

export function cacheIsFresh(cache: NewsCache | null, now = Date.now()): boolean {
  if (!cache) return false;
  return now - cache.fetchedAt < DAY;
}

export function cacheDayLabel(fetchedAt: number): string {
  const d = new Date(fetchedAt);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
