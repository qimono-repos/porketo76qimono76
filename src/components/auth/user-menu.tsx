import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { PorketoAvatar } from "@/components/brand/porketo-mark";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const GUEST = {
  name: "Qi",
  caption: "Guest desk",
};

export function UserMenu() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return <Skeleton className="size-11 shrink-0 rounded-full" />;
  }

  const signedIn = Boolean(user);
  const label = user?.displayName ?? user?.primaryEmail ?? GUEST.name;
  const caption = signedIn ? (user?.primaryEmail ?? "Signed in") : GUEST.caption;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="shrink-0 rounded-full transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
          aria-label={signedIn ? "Account" : "Qi, guest desk"}
        >
          <PorketoAvatar src={user?.profileImageUrl} alt={label} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 px-3 py-2">
          <PorketoAvatar
            src={user?.profileImageUrl}
            alt=""
            className="size-8"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{label}</p>
            <p className="truncate text-xs text-muted-foreground">{caption}</p>
          </div>
        </div>
        {signedIn ? (
          <DropdownMenuItem onSelect={() => void signOut()}>
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/login">
              <LogIn className="size-4" />
              Sign in
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
