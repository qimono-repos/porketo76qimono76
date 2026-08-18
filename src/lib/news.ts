import { createServerFn } from "@tanstack/react-start";
import { UNIVERSE } from "@/lib/market/universe";

export type DeskNews = {
  symbol: string;
  title: string;
  excerpt: string;
  url: string;
  source: "yahoo" | "wikipedia";
  publishedAt: string | null;
};

const YAHOO_SYMBOL: Record<string, string> = {
  PAXG: "PAXG-USD",
  BNB: "BNB-USD",
  SOL: "SOL-USD",
  GNO: "GNO-USD",
  QNT: "QNT-USD",
};

const WIKI_TITLE: Record<string, string> = {
  AMD: "Advanced_Micro_Devices",
  META: "Meta_Platforms",
  AAPL: "Apple_Inc.",
  IBM: "IBM",
  MU: "Micron_Technology",
  NVDA: "Nvidia",
  MSFT: "Microsoft",
  TSM: "Taiwan_Semiconductor_Manufacturing",
  IONQ: "IonQ",
  AMZN: "Amazon_(company)",
  MDB: "MongoDB",
  GOOGL: "Alphabet_Inc.",
  XNDU: "Nasdaq-100",
  QBTS: "D-Wave_Systems",
  QNT: "Overledger",
  SPCX: "Special-purpose_acquisition_company",
  FLKR: "Franklin_Templeton",
  QCOM: "Qualcomm",
  PAXG: "Gold_as_an_investment",
  BNB: "Binance",
  SOL: "Solana_(blockchain_platform)",
  GNO: "Gnosis",
};

const YAHOO_UA =
  "Mozilla/5.0 (compatible; Porketo/1.0; +https://finance.yahoo.com/)";
const WIKI_UA = "Porketo/1.0 (financial desk news fallback)";

let cache: { at: number; items: DeskNews[] } | null = null;
const TTL_MS = 10 * 60 * 1000;

function decode(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstWords(text: string, count = 40): string {
  const words = decode(text).split(" ").filter(Boolean);
  if (words.length <= count) return words.join(" ");
  return `${words.slice(0, count).join(" ")}…`;
}

function tag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decode(match[1] ?? "") : "";
}

function parseRss(xml: string): { title: string; description: string; link: string; pubDate: string }[] {
  const items: { title: string; description: string; link: string; pubDate: string }[] = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    const block = match[1] ?? "";
    const title = tag(block, "title");
    const link = tag(block, "link");
    if (!title || !link) continue;
    items.push({
      title,
      description: tag(block, "description"),
      link,
      pubDate: tag(block, "pubDate"),
    });
  }
  return items;
}

async function readText(url: string, headers: Record<string, string>, ms = 8000): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fromYahoo(symbol: string): Promise<DeskNews | null> {
  const yahoo = YAHOO_SYMBOL[symbol] ?? symbol;
  const xml = await readText(
    `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(yahoo)}&region=US&lang=en-US`,
    { "User-Agent": YAHOO_UA, Accept: "application/rss+xml, application/xml, text/xml" },
  );
  if (!xml) return null;
  const item = parseRss(xml)[0];
  if (!item) return null;
  return {
    symbol,
    title: firstWords(item.title, 12),
    excerpt: firstWords(item.description || item.title, 40),
    url: item.link,
    source: "yahoo",
    publishedAt: item.pubDate || null,
  };
}

async function fromWikipedia(symbol: string, name: string): Promise<DeskNews | null> {
  const slug = WIKI_TITLE[symbol] ?? name.replace(/\s+/g, "_");
  const raw = await readText(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
    { "User-Agent": WIKI_UA, Accept: "application/json" },
  );
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as {
      type?: string;
      title?: string;
      extract?: string;
      content_urls?: { desktop?: { page?: string } };
    };
    if (!data.extract || data.type === "disambiguation") return null;
    return {
      symbol,
      title: firstWords(data.title || name, 12),
      excerpt: firstWords(data.extract, 40),
      url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${slug}`,
      source: "wikipedia",
      publishedAt: null,
    };
  } catch {
    return null;
  }
}

async function fetchOne(symbol: string, name: string): Promise<DeskNews | null> {
  const yahoo = await fromYahoo(symbol);
  if (yahoo) return yahoo;
  return fromWikipedia(symbol, name);
}

async function loadDeskNews(): Promise<DeskNews[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.items;
  const results = await Promise.all(
    UNIVERSE.map((ticker) => fetchOne(ticker.symbol, ticker.name)),
  );
  const items = results.filter((item): item is DeskNews => item !== null);
  cache = { at: Date.now(), items };
  return items;
}

export const listDeskNews = createServerFn({ method: "GET" }).handler(async () => {
  return loadDeskNews();
});
