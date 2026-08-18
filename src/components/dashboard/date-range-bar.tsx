import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDashboardStore } from "@/lib/dashboard-store";
import type { RangePreset } from "@/lib/market/metrics";
import { cn } from "@/lib/utils";

const PRESETS: { id: RangePreset; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "1m", label: "1M" },
  { id: "3m", label: "3M" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1Y" },
];

export function DateRangeBar() {
  const preset = useDashboardStore((s) => s.preset);
  const custom = useDashboardStore((s) => s.custom);
  const setPreset = useDashboardStore((s) => s.setPreset);
  const setCustom = useDashboardStore((s) => s.setCustom);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PRESETS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setPreset(item.id)}
          className={cn(
            "h-11 shrink-0 rounded-full px-3.5 text-sm font-medium transition-[background-color,color] duration-150",
            preset === item.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-[background-color,color] duration-150",
              preset === "custom"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            <CalendarRange className="size-3.5" />
            Custom
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 space-y-3">
          <p className="text-sm font-medium">Custom range</p>
          <div className="grid gap-2">
            <label className="grid gap-1 text-xs text-muted-foreground">
              From
              <Input
                type="date"
                min="2025-01-02"
                max="2026-08-18"
                value={custom.from}
                onChange={(e) => setCustom({ ...custom, from: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              To
              <Input
                type="date"
                min="2025-01-02"
                max="2026-08-18"
                value={custom.to}
                onChange={(e) => setCustom({ ...custom, to: e.target.value })}
              />
            </label>
          </div>
          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={() => setCustom(custom)}
          >
            Apply range
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
