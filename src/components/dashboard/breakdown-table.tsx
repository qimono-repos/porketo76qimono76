import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Pin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkline } from "@/components/dashboard/sparkline";
import { TickerLogo } from "@/components/brand/ticker-logo";
import { useDashboardStore } from "@/lib/dashboard-store";
import { useConnectivity } from "@/lib/connectivity";
import {
  formatPct,
  formatSignedUsd,
  formatUsd,
  type AssetRow,
} from "@/lib/market/metrics";
import { cn } from "@/lib/utils";

export function BreakdownTable({
  rows,
  pinned,
}: {
  rows: AssetRow[];
  pinned: Set<string>;
}) {
  const query = useDashboardStore((s) => s.query);
  const setQuery = useDashboardStore((s) => s.setQuery);
  const selected = useDashboardStore((s) => s.selectedSymbol);
  const selectSymbol = useDashboardStore((s) => s.selectSymbol);
  const setHoverSymbol = useDashboardStore((s) => s.setHoverSymbol);
  const { breakdownOffline } = useConnectivity();
  const [sorting, setSorting] = useState<SortingState>([{ id: "endValue", desc: true }]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const next = q
      ? rows.filter(
          (r) =>
            r.symbol.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.sector.toLowerCase().includes(q),
        )
      : rows;
    return [...next].sort((a, b) => Number(pinned.has(b.symbol)) - Number(pinned.has(a.symbol)));
  }, [rows, query, pinned]);

  const columns = useMemo<ColumnDef<AssetRow>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: "Asset",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <TickerLogo
              symbol={row.original.symbol}
              tone={row.original.pnl >= 0 ? "up" : "down"}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium tracking-tight">{row.original.symbol}</span>
                {pinned.has(row.original.symbol) ? (
                  <Pin className="size-3 text-primary" />
                ) : null}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {breakdownOffline ? `${row.original.name} (offline)` : row.original.name}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "spark",
        header: "Path",
        enableSorting: false,
        cell: ({ row }) => (
          <Sparkline values={row.original.spark} up={row.original.growth >= 0} />
        ),
      },
      {
        accessorKey: "endValue",
        header: "Value",
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">{formatUsd(row.original.endValue)}</span>
        ),
      },
      {
        accessorKey: "pnl",
        header: "Revenue",
        cell: ({ row }) => (
          <span
            className={cn(
              "font-mono tabular-nums",
              row.original.pnl >= 0 ? "text-up" : "text-down",
            )}
          >
            {formatSignedUsd(row.original.pnl)}
          </span>
        ),
      },
      {
        accessorKey: "growth",
        header: "Growth",
        cell: ({ row }) => (
          <span
            className={cn(
              "font-mono tabular-nums",
              row.original.growth >= 0 ? "text-up" : "text-down",
            )}
          >
            {formatPct(row.original.growth)}
          </span>
        ),
      },
    ],
    [pinned, breakdownOffline],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className={cn(
              "text-xs font-medium tracking-wide text-muted-foreground uppercase",
              breakdownOffline && "flash-offline text-down",
            )}
          >
            {breakdownOffline ? "Breakdown: Offline" : "Breakdown"}
          </p>
          <h2 className="mt-1 text-base font-medium tracking-tight">
            {filtered.length} names in range
          </h2>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter ticker, name, sector"
          className="sm:max-w-64"
          aria-label="Filter breakdown"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-y border-border">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
                      header.id === "spark" && "w-[38%]",
                    )}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="size-3" />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
                <th className="px-4 py-2.5" />
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const active = selected === row.original.symbol;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/70 transition-[background-color] duration-150 last:border-0",
                    active ? "bg-muted" : "hover:bg-muted/50",
                  )}
                  onMouseEnter={() => setHoverSymbol(row.original.symbol)}
                  onMouseLeave={() => setHoverSymbol(null)}
                  onClick={() =>
                    selectSymbol(active ? null : row.original.symbol)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 align-middle",
                        cell.column.id === "spark" && "w-[38%]",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <Link
                      to="/asset/$symbol"
                      params={{ symbol: row.original.symbol }}
                      className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-card-elevated hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Open ${row.original.symbol}`}
                    >
                      →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <img
              src="/porketo-avatar.png"
              alt=""
              className="size-14 rounded-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
            />
            <p className="text-sm text-muted-foreground">
              Qi found no names matching that filter.
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
