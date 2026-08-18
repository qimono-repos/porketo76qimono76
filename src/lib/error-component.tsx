import type { ErrorComponentProps } from "@tanstack/react-router";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-3 overflow-hidden bg-background px-6 text-center text-foreground">
      <img
        src="/porketo.png"
        alt=""
        className="pointer-events-none absolute inset-0 m-auto h-72 w-72 object-contain opacity-20 blur-2xl"
      />
      <img
        src="/porketo-avatar.png"
        alt=""
        className="relative size-16 rounded-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
      />
      <h1 className="relative text-lg font-medium tracking-tight">Porketo hit a snag</h1>
      <p className="relative max-w-md text-sm break-words text-muted-foreground">
        {error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
    </main>
  );
}
