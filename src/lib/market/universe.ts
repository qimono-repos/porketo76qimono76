export type AssetClass = "equity" | "crypto";

export type Ticker = {
  symbol: string;
  name: string;
  class: AssetClass;
  venue: string;
  sector: string;
  /** Terminal price used as the generator's end anchor. */
  anchor: number;
  /** Book units (shares or coins). */
  units: number;
  vol: number;
  drift: number;
};

export const UNIVERSE: Ticker[] = [
  { symbol: "AMD", name: "Advanced Micro Devices", class: "equity", venue: "NASDAQ", sector: "Semiconductors", anchor: 178.4, units: 850, vol: 0.38, drift: 0.22 },
  { symbol: "META", name: "Meta Platforms", class: "equity", venue: "NASDAQ", sector: "Internet", anchor: 548.2, units: 320, vol: 0.28, drift: 0.18 },
  { symbol: "AAPL", name: "Apple", class: "equity", venue: "NASDAQ", sector: "Consumer Tech", anchor: 236.1, units: 1100, vol: 0.22, drift: 0.12 },
  { symbol: "IBM", name: "IBM", class: "equity", venue: "NYSE", sector: "Enterprise IT", anchor: 192.6, units: 400, vol: 0.2, drift: 0.08 },
  { symbol: "MU", name: "Micron Technology", class: "equity", venue: "NASDAQ", sector: "Memory", anchor: 142.3, units: 600, vol: 0.42, drift: 0.25 },
  { symbol: "NVDA", name: "NVIDIA", class: "equity", venue: "NASDAQ", sector: "Accelerators", anchor: 186.8, units: 2200, vol: 0.4, drift: 0.35 },
  { symbol: "MSFT", name: "Microsoft", class: "equity", venue: "NASDAQ", sector: "Software", anchor: 428.5, units: 380, vol: 0.2, drift: 0.14 },
  { symbol: "TSM", name: "Taiwan Semiconductor", class: "equity", venue: "NYSE", sector: "Foundry", anchor: 198.4, units: 500, vol: 0.28, drift: 0.2 },
  { symbol: "IONQ", name: "IonQ", class: "equity", venue: "NYSE", sector: "Quantum", anchor: 38.2, units: 1800, vol: 0.72, drift: 0.4 },
  { symbol: "AMZN", name: "Amazon", class: "equity", venue: "NASDAQ", sector: "Commerce", anchor: 214.7, units: 700, vol: 0.26, drift: 0.16 },
  { symbol: "MDB", name: "MongoDB", class: "equity", venue: "NASDAQ", sector: "Data", anchor: 268.9, units: 180, vol: 0.45, drift: 0.1 },
  { symbol: "GOOGL", name: "Alphabet", class: "equity", venue: "NASDAQ", sector: "Search", anchor: 188.3, units: 900, vol: 0.24, drift: 0.15 },
  { symbol: "XNDU", name: "Nasdaq-100 UCITS", class: "equity", venue: "LSE", sector: "Index", anchor: 52.4, units: 1500, vol: 0.18, drift: 0.12 },
  { symbol: "QBTS", name: "D-Wave Quantum", class: "equity", venue: "NYSE", sector: "Quantum", anchor: 16.4, units: 4200, vol: 0.85, drift: 0.3 },
  { symbol: "QNT", name: "Quant", class: "equity", venue: "CRYPTO", sector: "Interop", anchor: 94.1, units: 220, vol: 0.55, drift: 0.18 },
  { symbol: "SPCX", name: "SPAC & New Issues", class: "equity", venue: "NYSE", sector: "SPAC", anchor: 27.1, units: 800, vol: 0.25, drift: 0.04 },
  { symbol: "FLKR", name: "Franklin FTSE Korea", class: "equity", venue: "NYSE", sector: "Country", anchor: 26.5, units: 900, vol: 0.22, drift: 0.08 },
  { symbol: "QCOM", name: "Qualcomm", class: "equity", venue: "NASDAQ", sector: "Wireless", anchor: 176.2, units: 450, vol: 0.3, drift: 0.14 },
  { symbol: "PAXG", name: "Pax Gold", class: "crypto", venue: "CRYPTO", sector: "Gold", anchor: 2684, units: 18, vol: 0.12, drift: 0.08 },
  { symbol: "BNB", name: "Binance Coin", class: "crypto", venue: "CRYPTO", sector: "Exchange", anchor: 612.4, units: 85, vol: 0.5, drift: 0.22 },
  { symbol: "SOL", name: "Solana", class: "crypto", venue: "CRYPTO", sector: "L1", anchor: 178.6, units: 420, vol: 0.62, drift: 0.28 },
  { symbol: "GNO", name: "Gnosis", class: "crypto", venue: "CRYPTO", sector: "Infra", anchor: 294.2, units: 95, vol: 0.48, drift: 0.12 },
];

export const TICKER_BY_SYMBOL = Object.fromEntries(
  UNIVERSE.map((t) => [t.symbol, t]),
) as Record<string, Ticker>;

export function getTicker(symbol: string): Ticker | undefined {
  return TICKER_BY_SYMBOL[symbol.toUpperCase()];
}
