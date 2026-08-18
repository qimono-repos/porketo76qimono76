import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PorketoEmoji } from "@/components/brand/porketo-emoji";
import { Sparkline } from "@/components/dashboard/sparkline";
import { Card } from "@/components/ui/card";
import { useConnectivity } from "@/lib/connectivity";
import { cacheDayLabel, cacheIsFresh, readNewsCache, writeNewsCache } from "@/lib/news-cache";
import { listDeskNews, type DeskNews } from "@/lib/news";
import type { AssetRow } from "@/lib/market/metrics";
import { useDashboardStore } from "@/lib/dashboard-store";
import { clipWords } from "@/lib/utils";

export function NewsCarousel({ rows }: { rows: AssetRow[] }) {
  const selected = useDashboardStore((s) => s.selectedSymbol);
  const hover = useDashboardStore((s) => s.hoverSymbol);
  const { online, newsArchive } = useConnectivity();
  const [items, setItems] = useState<DeskNews[] | null>(() =>
    typeof window === "undefined" ? null : (readNewsCache()?.items ?? null),
  );
  const [fetchedAt, setFetchedAt] = useState<number | null>(() =>
    typeof window === "undefined" ? null : (readNewsCache()?.fetchedAt ?? null),
  );
  const [autoIndex, setAutoIndex] = useState(0);
  const [userHeld, setUserHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const rowBySymbol = useMemo(
    () => Object.fromEntries(rows.map((row) => [row.symbol, row])) as Record<string, AssetRow>,
    [rows],
  );
  const visible = useMemo(() => {
    const allow = new Set(rows.map((row) => row.symbol));
    return (items ?? []).filter((item) => allow.has(item.symbol));
  }, [items, rows]);

  useEffect(() => {
    let cancelled = false;
    const cached = readNewsCache();
    if (cached) {
      setItems(cached.items);
      setFetchedAt(cached.fetchedAt);
    }
    const shouldRefresh = online && !cacheIsFresh(cached);
    if (!shouldRefresh) {
      if (!cached) setItems([]);
      return;
    }
    listDeskNews()
      .then((next) => {
        if (cancelled) return;
        const saved = writeNewsCache(next);
        setItems(saved.items);
        setFetchedAt(saved.fetchedAt);
      })
      .catch(() => {
        if (!cancelled && !cached) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [online]);

  const focus = hover ?? selected;
  const focusIdx = focus ? visible.findIndex((item) => item.symbol === focus) : -1;
  const index = focusIdx >= 0 ? focusIdx : autoIndex;

  useEffect(() => {
    if (autoIndex >= visible.length && visible.length > 0) setAutoIndex(0);
  }, [autoIndex, visible.length]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const child = root.children[index] as HTMLElement | undefined;
    if (!child) return;
    root.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, [index, visible.length]);

  useEffect(() => {
    if (paused || userHeld || visible.length < 2) return;
    if (autoIndex >= 9 || autoIndex >= visible.length - 1) return;
    const wait = 5000 + autoIndex * 2000;
    const id = window.setTimeout(() => {
      setAutoIndex((i) => i + 1);
    }, wait);
    return () => window.clearTimeout(id);
  }, [paused, userHeld, autoIndex, visible.length]);

  const current = visible[index];
  const archive = newsArchive;
  const heading = archive
    ? `Desk news: Archive ${fetchedAt ? cacheDayLabel(fetchedAt) : "—"}`
    : "Desk news";

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {heading}
          </p>
          <p className="mt-1 text-base font-medium tracking-tight">
            {current
              ? `${current.symbol} · ${current.source === "yahoo" ? "Yahoo Finance" : "Wikipedia"}`
              : "Loading the tape"}
          </p>
        </div>
        {visible.length > 0 ? (
          <p className="font-mono text-xs text-subtle tabular-nums">
            {index + 1} / {visible.length}
          </p>
        ) : null}
      </div>

      {items === null ? (
        <div className="grid grid-cols-2 items-center gap-3 px-4 py-6">
          <div className="mx-auto size-32 animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <img
            src="/porketo-avatar.png"
            alt=""
            className="size-14 rounded-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
          />
          <p className="text-sm text-muted-foreground">Qi found no open tape for this book.</p>
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            ref={scroller}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((item) => {
              const row = rowBySymbol[item.symbol];
              const up = row ? row.pnl >= 0 : true;
              return (
                <a
                  key={`${item.symbol}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid w-full min-w-full shrink-0 snap-start grid-cols-2 items-start outline-none focus-visible:bg-muted"
                  aria-label={`${item.symbol} news: ${item.title}`}
                >
                  <div className="grid place-items-center px-3 pt-4 sm:px-5">
                    <PorketoEmoji
                      symbol={item.symbol}
                      up={up}
                      className="h-32 w-32 sm:h-40 sm:w-40"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center py-4 pr-4 sm:pr-6">
                    <h3 className="line-clamp-2 text-base font-medium tracking-tight text-pretty sm:text-lg">
                      {clipWords(item.title, 12)}
                    </h3>
                    <p className="mt-2 line-clamp-6 text-sm leading-relaxed text-muted-foreground">
                      {clipWords(item.excerpt, 40)}
                    </p>
                  </div>
                  <div className="col-span-1 px-3 pb-4 sm:px-5">
                    {row ? <Sparkline values={row.spark} up={up} className="h-8 w-full" /> : null}
                  </div>
                </a>
              );
            })}
          </div>
          <div className="flex items-center justify-between px-2 pb-3">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Previous story"
              onClick={() => {
                setUserHeld(true);
                setAutoIndex((i) => (i - 1 + visible.length) % visible.length);
              }}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Next story"
              onClick={() => {
                setUserHeld(true);
                setAutoIndex((i) => (i + 1) % visible.length);
              }}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
