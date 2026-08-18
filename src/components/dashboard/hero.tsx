import { Badge } from "@/components/ui/badge";
import { formatDateLabel, formatUsd, type DashboardModel } from "@/lib/market/metrics";
import { cn } from "@/lib/utils";

const FILTER_LABEL = {
  all: "Full book",
  equity: "Equities",
  crypto: "Crypto",
} as const;

export function Hero({
  model,
  classFilter,
}: {
  model: DashboardModel;
  classFilter: "all" | "equity" | "crypto";
}) {
  const { winners, losers, bookValue, growth } = model.kpis;
  const total = winners + losers;
  const upShare = total === 0 ? 0 : winners / total;
  const downShare = total === 0 ? 0 : losers / total;
  const bullish = winners > losers || (winners === losers && growth >= 0);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <img
          src="/porketo-avatar.png"
          alt=""
          className="size-7 rounded-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
        />
        <Badge variant="outline">{FILTER_LABEL[classFilter]}</Badge>
        <span className="text-xs text-muted-foreground">
          {formatDateLabel(model.range.from)} – {formatDateLabel(model.range.to)}
        </span>
      </div>
      <h1 className="text-xl font-medium tracking-tight sm:text-2xl">
        Porketo is{" "}
        <span className={cn(bullish ? "text-up" : "text-down")}>
          {bullish ? "bullish" : "bearish"}
        </span>
        {" : "}
        <span className="font-mono tabular-nums">{formatUsd(bookValue)}</span>
        {" ; "}
        <span className="text-up tabular-nums">{Math.round(upShare * 100)}% up</span>
        {", "}
        <span className="text-down tabular-nums">{Math.round(downShare * 100)}% down</span>
      </h1>
    </section>
  );
}
