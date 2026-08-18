import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Pin } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DateRangeBar } from "@/components/dashboard/date-range-bar";
import { TickerLogo } from "@/components/brand/ticker-logo";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDashboardStore } from "@/lib/dashboard-store";
import { getMarketBook, sliceDays } from "@/lib/market/generate";
import {
  formatDateLabel,
  formatPct,
  formatPrice,
  formatSignedUsd,
  formatUsd,
  resolveRange,
  shortDate,
} from "@/lib/market/metrics";
import { getTicker } from "@/lib/market/universe";
import { listNotes, upsertNote } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/asset/$symbol")({ component: AssetPage });

function AssetPage() {
  const { symbol } = Route.useParams();
  const ticker = getTicker(symbol);
  const preset = useDashboardStore((s) => s.preset);
  const custom = useDashboardStore((s) => s.custom);
  const range = useMemo(() => resolveRange(preset, custom), [preset, custom]);
  const { user, isPending } = useCurrentUserState();
  const [note, setNote] = useState("");
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending || !user || !ticker) return;
    let cancelled = false;
    listNotes()
      .then((rows) => {
        if (cancelled) return;
        const row = rows.find((r) => r.symbol === ticker.symbol);
        setNote(row?.note ?? "");
        setPinned(row?.pinned ?? false);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user, isPending, ticker]);

  if (!ticker) {
    return (
      <AppShell>
        <Card className="p-6">
          <h1 className="text-lg font-medium">Unknown ticker</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {symbol.toUpperCase()} is not on this desk.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Back to overview</Link>
          </Button>
        </Card>
      </AppShell>
    );
  }

  const symbolKey = ticker.symbol;
  const series = getMarketBook().bySymbol[symbolKey];
  const days = series ? sliceDays(series.days, range.from, range.to) : [];
  const first = days[0];
  const last = days[days.length - 1];
  const pnl = first && last ? last.value - first.value : 0;
  const growth = first && last && first.value !== 0 ? pnl / first.value : 0;
  const up = growth >= 0;
  const stroke = up ? "var(--color-up)" : "var(--color-down)";

  async function persist(next: { note?: string; pinned?: boolean }) {
    if (!user) return;
    setSaving(true);
    try {
      await upsertNote({
        data: {
          symbol: symbolKey,
          note: next.note ?? note,
          pinned: next.pinned ?? pinned,
        },
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon-sm" aria-label="Back">
            <Link to="/">
              <ArrowLeft />
            </Link>
          </Button>
          <TickerLogo
            symbol={ticker.symbol}
            size="lg"
            tone={pnl >= 0 ? "up" : "down"}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-medium tracking-tight">{ticker.symbol}</h1>
              <Badge variant="outline" className="capitalize">
                {ticker.class}
              </Badge>
              <Badge>{ticker.sector}</Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">{ticker.name}</p>
          </div>
        </div>

        <DateRangeBar />

        <section>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Last mark
          </p>
          <p className="mt-1 font-mono text-4xl font-medium tabular-nums">
            {last ? formatPrice(last.price) : "—"}
          </p>
          <p className={cn("mt-2 text-sm tabular-nums", up ? "text-up" : "text-down")}>
            {formatPct(growth)} · {formatSignedUsd(pnl)} on {ticker.units.toLocaleString()} units
          </p>
          <p className="mt-1 text-xs text-subtle">
            {formatDateLabel(range.from)} – {formatDateLabel(range.to)} · {ticker.venue}
          </p>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Position" value={last ? formatUsd(last.value) : "—"} />
          <Stat label="Revenue" value={formatSignedUsd(pnl)} tone={up ? "up" : "down"} />
          <Stat label="Growth" value={formatPct(growth)} tone={up ? "up" : "down"} />
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 pb-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Price
            </p>
          </div>
          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={days} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="asset-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis
                  dataKey="price"
                  tickFormatter={(v: number) => formatPrice(v)}
                  tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const point = payload[0].payload as { date: string; price: number; value: number };
                    return (
                      <div className="rounded-xl bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]">
                        <p className="text-muted-foreground">{shortDate(point.date)}</p>
                        <p className="mt-1 font-mono text-sm tabular-nums">{formatPrice(point.price)}</p>
                        <p className="mt-0.5 text-muted-foreground tabular-nums">
                          {formatUsd(point.value)} book
                        </p>
                      </div>
                    );
                  }}
                  cursor={{ stroke: "var(--color-border-strong)", strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={stroke}
                  strokeWidth={2}
                  fill="url(#asset-fill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Desk note</p>
              <p className="text-xs text-muted-foreground">
                {user ? "Saved to your account." : "Sign in to pin this name and keep a note."}
              </p>
            </div>
            <Button
              type="button"
              variant={pinned ? "default" : "secondary"}
              size="sm"
              disabled={!user || saving}
              onClick={() => {
                const next = !pinned;
                setPinned(next);
                void persist({ pinned: next });
              }}
            >
              <Pin className="size-3.5" />
              {pinned ? "Pinned" : "Pin"}
            </Button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => {
              if (user) void persist({ note });
            }}
            disabled={!user}
            rows={4}
            placeholder={user ? "Add a thesis, level, or reminder" : "Sign in to write a note"}
            className="mt-3 w-full resize-none rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
          />
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p
        className={cn(
          "mt-2 font-mono text-xl font-medium tabular-nums",
          tone === "up" && "text-up",
          tone === "down" && "text-down",
        )}
      >
        {value}
      </p>
    </Card>
  );
}
