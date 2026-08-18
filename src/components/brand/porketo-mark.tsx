import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, string> = {
  xs: "size-7",
  sm: "size-8",
  md: "size-11",
  lg: "size-16",
  xl: "size-28",
};

export function PorketoMark({
  size = "sm",
  className,
  alt = "Porketo",
}: {
  size?: Size;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/porketo-mark.png"
      alt={alt}
      className={cn(
        "shrink-0 rounded-full bg-card object-cover outline outline-1 -outline-offset-1 outline-foreground/10",
        SIZES[size],
        className,
      )}
    />
  );
}

export function PorketoAvatar({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src || "/porketo-avatar.png"}
      alt={alt}
      className={cn(
        "size-11 shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10",
        className,
      )}
    />
  );
}
