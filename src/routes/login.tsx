import { Link, Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PorketoBackdrop } from "@/components/brand/porketo-backdrop";
import { PorketoMark } from "@/components/brand/porketo-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <main className="relative grid min-h-dvh place-items-center bg-background px-6">
        <PorketoBackdrop />
        <Skeleton className="relative z-10 h-72 w-full max-w-sm rounded-2xl" />
      </main>
    );
  }

  if (user) return <Navigate to="/" />;

  return (
    <main className="relative grid min-h-dvh place-items-center bg-background px-6">
      <PorketoBackdrop />
      <Card className="relative z-10 w-full max-w-sm p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <PorketoMark size="xs" />
          Porketo
        </Link>
        <div className="mt-5 flex justify-center">
          <PorketoMark size="xl" alt="Qi" className="size-24" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-medium tracking-tight">Sign in to Porketo</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Qi is holding the guest desk. Sign in to pin names and keep notes.
        </p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}
        </div>
        <Button asChild variant="ghost" className="mt-3 w-full">
          <Link to="/">Stay as Qi</Link>
        </Button>
      </Card>
    </main>
  );
}
