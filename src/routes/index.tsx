import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BreakdownTable } from "@/components/dashboard/breakdown-table";
import { DateRangeBar } from "@/components/dashboard/date-range-bar";
import { Hero } from "@/components/dashboard/hero";
import { NewsCarousel } from "@/components/dashboard/news-carousel";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AppShell } from "@/components/layout/app-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDashboardStore } from "@/lib/dashboard-store";
import { buildDashboard, resolveRange } from "@/lib/market/metrics";
import { listNotes, type TickerNote } from "@/lib/watchlist";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const preset = useDashboardStore((s) => s.preset);
  const custom = useDashboardStore((s) => s.custom);
  const classFilter = useDashboardStore((s) => s.classFilter);
  const selectedSymbol = useDashboardStore((s) => s.selectedSymbol);
  const { user, isPending } = useCurrentUserState();
  const [notes, setNotes] = useState<TickerNote[]>([]);

  useEffect(() => {
    if (isPending || !user) {
      setNotes([]);
      return;
    }
    let cancelled = false;
    listNotes()
      .then((rows) => {
        if (!cancelled) setNotes(rows);
      })
      .catch(() => {
        if (!cancelled) setNotes([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending]);

  const range = useMemo(() => resolveRange(preset, custom), [preset, custom]);
  const model = useMemo(
    () =>
      buildDashboard({
        range,
        classFilter,
        selectedSymbol,
      }),
    [range, classFilter, selectedSymbol],
  );
  const pinned = useMemo(
    () => new Set(notes.filter((n) => n.pinned).map((n) => n.symbol)),
    [notes],
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <Hero model={model} classFilter={classFilter} />
        <DateRangeBar />
        {false ? <TrendChart model={model} /> : <NewsCarousel rows={model.rows} />}
        <BreakdownTable rows={model.rows} pinned={pinned} />
      </div>
    </AppShell>
  );
}
