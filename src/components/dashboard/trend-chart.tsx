import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { TickerLogo } from "@/components/brand/ticker-logo";
import { useDashboardStore } from "@/lib/dashboard-store";
import { getMarketBook, sliceDays } from "@/lib/market/generate";
import { getTicker } from "@/lib/market/universe";
import {
  formatPrice,
  formatUsd,
  shortDate,
  type DashboardModel,
} from "@/lib/market/metrics";

type Point = { date: string; value: number; price?: number };

type TipProps = {
  active?: boolean;
  payload?: { payload: Point }[];
  isolated: boolean;
};

function ChartTip({ active, payload, isolated }: TipProps) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]">
      <p className="text-muted-foreground">{shortDate(point.date)}</p>
      <p className="mt-1 font-mono text-sm tabular-nums">
        {isolated && point.price != null ? formatPrice(point.price) : formatUsd(point.value)}
      </p>
      {isolated && point.price != null ? (
        <p className="mt-0.5 text-muted-foreground tabular-nums">{formatUsd(point.value)} book</p>
      ) : null}
    </div>
  );
}

export function TrendChart({ model }: { model: DashboardModel }) {
  const selectedSymbol = useDashboardStore((s) => s.selectedSymbol);
  const hoverSymbol = useDashboardStore((s) => s.hoverSymbol);
  const selectSymbol = useDashboardStore((s) => s.selectSymbol);

  const preview = hoverSymbol ?? selectedSymbol;
  const ticker = preview ? getTicker(preview) : undefined;

  const data = useMemo<Point[]>(() => {
    if (!preview) return model.bookTrend;
    const series = getMarketBook().bySymbol[preview];
    if (!series) return model.bookTrend;
    return sliceDays(series.days, model.range.from, model.range.to).map((d) => ({
      date: d.date,
      value: d.value,
      price: d.price,
    }));
  }, [preview, model.bookTrend, model.range.from, model.range.to]);

  const isolated = Boolean(preview);
  const up = data.length > 1 ? data[data.length - 1]!.value >= data[0]!.value : true;
  const stroke = up ? "var(--color-up)" : "var(--color-down)";
  const gradientId = up ? "porketo-up" : "porketo-down";
  const previewRow = preview
    ? model.rows.find((row) => row.symbol === preview)
    : undefined;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div className="flex items-start gap-2.5">
          {ticker ? (
            <TickerLogo
              symbol={ticker.symbol}
              size="sm"
              className="mt-4"
              tone={previewRow ? (previewRow.pnl >= 0 ? "up" : "down") : up ? "up" : "down"}
            />
          ) : null}
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Trend
            </p>
            <h2 className="mt-1 text-base font-medium tracking-tight">
              {ticker ? `${ticker.symbol} · ${ticker.name}` : "Book value"}
            </h2>
            <p className="text-xs text-subtle">
              {ticker
                ? "Hover a row to preview · tap to lock"
                : "Full book · hover a name below to isolate it"}
            </p>
          </div>
        </div>
        {selectedSymbol ? (
          <button
            type="button"
            onClick={() => selectSymbol(null)}
            className="h-9 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Show book
          </button>
        ) : null}
      </div>
      <div className="h-56 px-1 pb-2 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(v: number) => formatUsd(v, true)}
              tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
              domain={[
                (min: number) => min * 0.992,
                (max: number) => max * 1.008,
              ]}
            />
            <Tooltip
              content={<ChartTip isolated={isolated} />}
              cursor={{ stroke: "var(--color-border-strong)", strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
