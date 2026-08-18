import { Link, useRouterState } from "@tanstack/react-router";
import { Coins, LayoutGrid, LineChart } from "lucide-react";
import type { ReactNode } from "react";
import { PorketoBackdrop } from "@/components/brand/porketo-backdrop";
import { PorketoMark } from "@/components/brand/porketo-mark";
import { UserMenu } from "@/components/auth/user-menu";
import { useDashboardStore } from "@/lib/dashboard-store";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "all" as const, label: "Overview", icon: LayoutGrid },
  { id: "equity" as const, label: "Equities", icon: LineChart },
  { id: "crypto" as const, label: "Crypto", icon: Coins },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const classFilter = useDashboardStore((s) => s.classFilter);
  const setClassFilter = useDashboardStore((s) => s.setClassFilter);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <PorketoBackdrop />
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-sm">
        <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link to="/" className="flex min-h-11 items-center gap-2.5">
            <PorketoMark size="sm" />
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">Porketo</span>
              <span className="block text-xs text-muted-foreground">Book desk</span>
            </span>
          </Link>
          <UserMenu />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-6xl gap-6 px-4">
        <aside className="sticky top-24 hidden h-[calc(100dvh-7rem)] w-48 shrink-0 flex-col gap-1 py-6 lg:flex">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === "/" && classFilter === item.id;
            return (
              <Link
                key={item.id}
                to="/"
                onClick={() => setClassFilter(item.id)}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm transition-[background-color,color] duration-150",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-auto flex items-center gap-2 px-2">
            <PorketoMark size="xs" />
            <p className="text-xs leading-relaxed text-subtle">
              Simulated marks through 18 Aug 2026. Not live quotes.
            </p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-28 pt-5 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === "/" && classFilter === item.id;
            return (
              <Link
                key={item.id}
                to="/"
                onClick={() => setClassFilter(item.id)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition-[background-color,color] duration-150",
                  active ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
