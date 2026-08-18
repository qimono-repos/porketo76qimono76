import { cn } from "@/lib/utils";

const HAPPY = [
  "/porketos/01-original.png",
  "/porketos/02-grin.png",
  "/porketos/03-sparkle.png",
  "/porketos/04-coinrain.png",
  "/porketos/05-confetti.png",
  "/porketos/06-moneybags.png",
  "/porketos/07-party.png",
  "/porketos/08-wink.png",
  "/porketos/09-hearts.png",
  "/porketos/10-leap.png",
] as const;

const SAD = [
  "/porketos/11-bored.png",
  "/porketos/12-crying.png",
  "/porketos/13-brokenheart.png",
  "/porketos/14-empty.png",
  "/porketos/15-shattered.png",
  "/porketos/16-dusty.png",
  "/porketos/17-cryglasses.png",
  "/porketos/18-shocked.png",
  "/porketos/19-broke.png",
  "/porketos/20-sideeye.png",
] as const;

function pick(symbol: string, pack: readonly string[]): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash * 33 + symbol.charCodeAt(i)) >>> 0;
  }
  return pack[hash % pack.length]!;
}

export function porketoSrc(symbol: string, up: boolean): string {
  return pick(symbol, up ? HAPPY : SAD);
}

export function PorketoEmoji({
  symbol,
  up,
  className,
}: {
  symbol: string;
  up: boolean;
  className?: string;
}) {
  const mark = symbol.toUpperCase();
  return (
    <div className={cn("relative", className)}>
      <img
        src={porketoSrc(symbol, up)}
        alt=""
        className="size-full object-contain"
        draggable={false}
      />
      <span
        className={cn(
          "porketo-ticker pointer-events-none font-bold tracking-tight",
          mark.length >= 5 ? "text-xs sm:text-sm" : mark.length === 4 ? "text-sm sm:text-base" : "text-base sm:text-lg",
        )}
      >
        {mark}
      </span>
    </div>
  );
}
