import "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as createServerFn, o as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { c as CalendarRange, i as LayoutGrid, o as Coins, r as LogOut, s as ChartLine } from "../_libs/lucide-react.mjs";
import { a as Trigger, i as Root2, n as Item2, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as signOut } from "./client-sGid3STf.mjs";
import { i as useCurrentUserState, r as Skeleton, t as Button } from "./card-B9ubEBfw.mjs";
import { t as authMiddleware } from "./middleware-CDL9FEVX.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:zoom-in-[0.97]", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none select-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
		...props
	});
}
function UserMenu() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-11 shrink-0 rounded-full" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		variant: "secondary",
		size: "sm",
		className: "min-h-11 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			children: "Sign in"
		})
	});
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	const initial = label.charAt(0).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-sm font-medium shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
			"aria-label": "Account",
			children: user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "size-full object-cover"
			}) : initial
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm font-medium",
				children: label
			}), user.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs text-muted-foreground",
				children: user.primaryEmail
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onSelect: () => void signOut(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
		})]
	})] });
}
var useDashboardStore = create()((set) => ({
	preset: "1m",
	custom: {
		from: "2026-07-20",
		to: "2026-08-18"
	},
	classFilter: "all",
	selectedSymbol: null,
	hoverSymbol: null,
	query: "",
	setPreset: (preset) => set({ preset }),
	setCustom: (custom) => set({
		custom,
		preset: "custom"
	}),
	setClassFilter: (classFilter) => set({
		classFilter,
		selectedSymbol: null
	}),
	selectSymbol: (selectedSymbol) => set({ selectedSymbol }),
	setHoverSymbol: (hoverSymbol) => set({ hoverSymbol }),
	setQuery: (query) => set({ query })
}));
var NAV = [
	{
		id: "all",
		label: "Overview",
		icon: LayoutGrid
	},
	{
		id: "equity",
		label: "Equities",
		icon: ChartLine
	},
	{
		id: "crypto",
		label: "Crypto",
		icon: Coins
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const classFilter = useDashboardStore((s) => s.classFilter);
	const setClassFilter = useDashboardStore((s) => s.setClassFilter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/80 bg-background/90 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-h-11 items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								className: "size-4",
								fill: "none",
								"aria-hidden": true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M5 18 L12 6 L19 18",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M8 13.5 H16",
									stroke: "currentColor",
									strokeWidth: "1.8",
									strokeLinecap: "round",
									className: "text-primary-foreground/70"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[15px] font-semibold tracking-tight",
								children: "Vantage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-muted-foreground",
								children: "Book desk"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenu, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl gap-6 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-24 hidden h-[calc(100dvh-7rem)] w-48 shrink-0 flex-col gap-1 py-6 lg:flex",
					children: [NAV.map((item) => {
						const Icon = item.icon;
						const active = pathname === "/" && classFilter === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							onClick: () => setClassFilter(item.id),
							className: cn("flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm transition-[background-color,color] duration-150", active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-auto px-3 text-[11px] leading-relaxed text-subtle",
						children: "Simulated marks through 18 Aug 2026. Not live quotes."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 pb-28 pt-5 lg:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-lg grid-cols-3 gap-1",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = pathname === "/" && classFilter === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							onClick: () => setClassFilter(item.id),
							className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-[background-color,color] duration-150", active ? "bg-muted text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.id);
					})
				})
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		up: "bg-up/15 text-up",
		down: "bg-down/15 text-down",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-xl bg-muted px-3 text-sm text-foreground shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/50", className),
		...props
	});
}
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
function PopoverContent({ className, align = "center", sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		align,
		sideOffset,
		className: cn("z-50 w-80 rounded-2xl bg-popover p-3 text-popover-foreground shadow-[var(--shadow-border)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:zoom-in-[0.97]", className),
		...props
	}) });
}
var PRESETS = [
	{
		id: "7d",
		label: "7D"
	},
	{
		id: "1m",
		label: "1M"
	},
	{
		id: "3m",
		label: "3M"
	},
	{
		id: "ytd",
		label: "YTD"
	},
	{
		id: "1y",
		label: "1Y"
	}
];
function DateRangeBar() {
	const preset = useDashboardStore((s) => s.preset);
	const custom = useDashboardStore((s) => s.custom);
	const setPreset = useDashboardStore((s) => s.setPreset);
	const setCustom = useDashboardStore((s) => s.setCustom);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
		children: [PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setPreset(item.id),
			className: cn("h-11 shrink-0 rounded-full px-3.5 text-sm font-medium transition-[background-color,color] duration-150", preset === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"),
			children: item.label
		}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-[background-color,color] duration-150", preset === "custom" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "size-3.5" }), "Custom"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			className: "w-72 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Custom range"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-xs text-muted-foreground",
						children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							min: "2025-01-02",
							max: "2026-08-18",
							value: custom.from,
							onChange: (e) => setCustom({
								...custom,
								from: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 text-xs text-muted-foreground",
						children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							min: "2025-01-02",
							max: "2026-08-18",
							value: custom.to,
							onChange: (e) => setCustom({
								...custom,
								to: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					className: "w-full",
					onClick: () => setCustom(custom),
					children: "Apply range"
				})
			]
		})] })]
	});
}
var UNIVERSE = [
	{
		symbol: "AMD",
		name: "Advanced Micro Devices",
		class: "equity",
		venue: "NASDAQ",
		sector: "Semiconductors",
		anchor: 178.4,
		units: 850,
		vol: .38,
		drift: .22
	},
	{
		symbol: "META",
		name: "Meta Platforms",
		class: "equity",
		venue: "NASDAQ",
		sector: "Internet",
		anchor: 548.2,
		units: 320,
		vol: .28,
		drift: .18
	},
	{
		symbol: "AAPL",
		name: "Apple",
		class: "equity",
		venue: "NASDAQ",
		sector: "Consumer Tech",
		anchor: 236.1,
		units: 1100,
		vol: .22,
		drift: .12
	},
	{
		symbol: "IBM",
		name: "IBM",
		class: "equity",
		venue: "NYSE",
		sector: "Enterprise IT",
		anchor: 192.6,
		units: 400,
		vol: .2,
		drift: .08
	},
	{
		symbol: "MU",
		name: "Micron Technology",
		class: "equity",
		venue: "NASDAQ",
		sector: "Memory",
		anchor: 142.3,
		units: 600,
		vol: .42,
		drift: .25
	},
	{
		symbol: "NVDA",
		name: "NVIDIA",
		class: "equity",
		venue: "NASDAQ",
		sector: "Accelerators",
		anchor: 186.8,
		units: 2200,
		vol: .4,
		drift: .35
	},
	{
		symbol: "MSFT",
		name: "Microsoft",
		class: "equity",
		venue: "NASDAQ",
		sector: "Software",
		anchor: 428.5,
		units: 380,
		vol: .2,
		drift: .14
	},
	{
		symbol: "TSM",
		name: "Taiwan Semiconductor",
		class: "equity",
		venue: "NYSE",
		sector: "Foundry",
		anchor: 198.4,
		units: 500,
		vol: .28,
		drift: .2
	},
	{
		symbol: "IONQ",
		name: "IonQ",
		class: "equity",
		venue: "NYSE",
		sector: "Quantum",
		anchor: 38.2,
		units: 1800,
		vol: .72,
		drift: .4
	},
	{
		symbol: "AMZN",
		name: "Amazon",
		class: "equity",
		venue: "NASDAQ",
		sector: "Commerce",
		anchor: 214.7,
		units: 700,
		vol: .26,
		drift: .16
	},
	{
		symbol: "MDB",
		name: "MongoDB",
		class: "equity",
		venue: "NASDAQ",
		sector: "Data",
		anchor: 268.9,
		units: 180,
		vol: .45,
		drift: .1
	},
	{
		symbol: "GOOGL",
		name: "Alphabet",
		class: "equity",
		venue: "NASDAQ",
		sector: "Search",
		anchor: 188.3,
		units: 900,
		vol: .24,
		drift: .15
	},
	{
		symbol: "XNDU",
		name: "Nasdaq-100 UCITS",
		class: "equity",
		venue: "LSE",
		sector: "Index",
		anchor: 52.4,
		units: 1500,
		vol: .18,
		drift: .12
	},
	{
		symbol: "QBTS",
		name: "D-Wave Quantum",
		class: "equity",
		venue: "NYSE",
		sector: "Quantum",
		anchor: 16.4,
		units: 4200,
		vol: .85,
		drift: .3
	},
	{
		symbol: "QNT",
		name: "Quant",
		class: "equity",
		venue: "CRYPTO",
		sector: "Interop",
		anchor: 94.1,
		units: 220,
		vol: .55,
		drift: .18
	},
	{
		symbol: "SPCX",
		name: "SPAC & New Issues",
		class: "equity",
		venue: "NYSE",
		sector: "SPAC",
		anchor: 27.1,
		units: 800,
		vol: .25,
		drift: .04
	},
	{
		symbol: "FLKR",
		name: "Franklin FTSE Korea",
		class: "equity",
		venue: "NYSE",
		sector: "Country",
		anchor: 26.5,
		units: 900,
		vol: .22,
		drift: .08
	},
	{
		symbol: "QCOM",
		name: "Qualcomm",
		class: "equity",
		venue: "NASDAQ",
		sector: "Wireless",
		anchor: 176.2,
		units: 450,
		vol: .3,
		drift: .14
	},
	{
		symbol: "PAXG",
		name: "Pax Gold",
		class: "crypto",
		venue: "CRYPTO",
		sector: "Gold",
		anchor: 2684,
		units: 18,
		vol: .12,
		drift: .08
	},
	{
		symbol: "BNB",
		name: "Binance Coin",
		class: "crypto",
		venue: "CRYPTO",
		sector: "Exchange",
		anchor: 612.4,
		units: 85,
		vol: .5,
		drift: .22
	},
	{
		symbol: "SOL",
		name: "Solana",
		class: "crypto",
		venue: "CRYPTO",
		sector: "L1",
		anchor: 178.6,
		units: 420,
		vol: .62,
		drift: .28
	},
	{
		symbol: "GNO",
		name: "Gnosis",
		class: "crypto",
		venue: "CRYPTO",
		sector: "Infra",
		anchor: 294.2,
		units: 95,
		vol: .48,
		drift: .12
	}
];
var TICKER_BY_SYMBOL = Object.fromEntries(UNIVERSE.map((t) => [t.symbol, t]));
function getTicker(symbol) {
	return TICKER_BY_SYMBOL[symbol.toUpperCase()];
}
var MARKET_START = "2025-01-02";
var MARKET_AS_OF = "2026-08-18";
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hashString(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i += 1) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function gaussian(rand) {
	const u = Math.max(rand(), 1e-9);
	const v = Math.max(rand(), 1e-9);
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function enumerateDates(start, end) {
	const out = [];
	const cursor = /* @__PURE__ */ new Date(`${start}T00:00:00Z`);
	const last = /* @__PURE__ */ new Date(`${end}T00:00:00Z`);
	while (cursor <= last) {
		out.push(cursor.toISOString().slice(0, 10));
		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}
	return out;
}
function weekday(date) {
	return (/* @__PURE__ */ new Date(`${date}T00:00:00Z`)).getUTCDay();
}
/** Shared tape so names move together, with a few regime shifts. */
function marketShock(date, rand) {
	const month = date.slice(0, 7);
	let bias = 0;
	if (month === "2025-04") bias = -.0062;
	else if (month === "2025-08") bias = .0024;
	else if (month === "2025-11") bias = .0046;
	else if (month === "2026-02") bias = -.0036;
	else if (month === "2026-06") bias = .0038;
	else if (month === "2026-07") bias = .0044;
	else if (month === "2026-08") bias = -.0018;
	return bias + gaussian(rand) * .011;
}
function buildBook() {
	const dates = enumerateDates(MARKET_START, MARKET_AS_OF);
	const marketRand = mulberry32(1369948382);
	const shocks = dates.map((d) => marketShock(d, marketRand));
	const series = UNIVERSE.map((ticker) => {
		const rand = mulberry32(hashString(ticker.symbol));
		const path = new Array(dates.length);
		path[dates.length - 1] = ticker.anchor;
		for (let i = dates.length - 2; i >= 0; i -= 1) {
			const date = dates[i + 1];
			const isWeekend = weekday(date) === 0 || weekday(date) === 6;
			if (ticker.class === "equity" && isWeekend) {
				path[i] = path[i + 1];
				continue;
			}
			const idio = ticker.drift / 365 + ticker.vol * gaussian(rand) * .042;
			const mix = .55 * shocks[i + 1] + .45 * idio;
			const prev = path[i + 1] / (1 + mix);
			path[i] = Math.max(prev, ticker.anchor * .18);
		}
		return {
			ticker,
			days: dates.map((date, i) => {
				const price = Number(path[i].toFixed(ticker.anchor >= 200 ? 2 : 3));
				return {
					date,
					price,
					value: price * ticker.units
				};
			})
		};
	});
	return {
		dates,
		series,
		bySymbol: Object.fromEntries(series.map((s) => [s.ticker.symbol, s]))
	};
}
var cached = null;
function getMarketBook() {
	if (!cached) cached = buildBook();
	return cached;
}
function sliceDays(days, from, to) {
	return days.filter((d) => d.date >= from && d.date <= to);
}
var AS_OF = "2026-08-18";
function addDays(iso, days) {
	const d = /* @__PURE__ */ new Date(`${iso}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
function resolveRange(preset, custom) {
	const to = AS_OF;
	if (preset === "custom" && custom?.from && custom.to) return custom.from <= custom.to ? {
		from: custom.from,
		to: custom.to
	} : {
		from: custom.to,
		to: custom.from
	};
	switch (preset) {
		case "7d": return {
			from: addDays(to, -6),
			to
		};
		case "1m": return {
			from: addDays(to, -29),
			to
		};
		case "3m": return {
			from: addDays(to, -89),
			to
		};
		case "ytd": return {
			from: "2026-01-01",
			to
		};
		case "1y": return {
			from: addDays(to, -364),
			to
		};
		default: return {
			from: addDays(to, -29),
			to
		};
	}
}
function priorRange(range) {
	const start = /* @__PURE__ */ new Date(`${range.from}T00:00:00Z`);
	const end = /* @__PURE__ */ new Date(`${range.to}T00:00:00Z`);
	const span = Math.max(1, Math.round((end.getTime() - start.getTime()) / 864e5));
	const priorTo = addDays(range.from, -1);
	return {
		from: addDays(priorTo, -span),
		to: priorTo
	};
}
function firstAndLast(days) {
	if (days.length === 0) return null;
	return {
		first: days[0],
		last: days[days.length - 1]
	};
}
function sparkline(days, buckets = 18) {
	if (days.length === 0) return [];
	if (days.length <= buckets) return days.map((d) => d.price);
	const out = [];
	const step = (days.length - 1) / (buckets - 1);
	for (let i = 0; i < buckets; i += 1) out.push(days[Math.round(i * step)].price);
	return out;
}
function buildDashboard(opts) {
	const book = getMarketBook();
	const prior = priorRange(opts.range);
	const filtered = book.series.filter((s) => opts.classFilter === "all" ? true : s.ticker.class === opts.classFilter);
	const rows = filtered.map((s) => toRow(s, opts.range)).filter((r) => r !== null);
	const bookValue = rows.reduce((acc, r) => acc + r.endValue, 0);
	const startValue = rows.reduce((acc, r) => acc + r.startValue, 0);
	const revenue = bookValue - startValue;
	const growth = startValue === 0 ? 0 : revenue / startValue;
	const leakValue = rows.filter((r) => r.leaking).reduce((acc, r) => acc + r.endValue, 0);
	const churn = bookValue === 0 ? 0 : leakValue / bookValue;
	const priorRows = filtered.map((s) => toRow(s, prior)).filter((r) => r !== null);
	const priorEnd = priorRows.reduce((acc, r) => acc + r.endValue, 0);
	const priorStart = priorRows.reduce((acc, r) => acc + r.startValue, 0);
	const priorRevenue = priorEnd - priorStart;
	const priorGrowth = priorStart === 0 ? 0 : priorRevenue / priorStart;
	const priorLeak = priorRows.filter((r) => r.leaking).reduce((acc, r) => acc + r.endValue, 0);
	const priorChurn = priorEnd === 0 ? 0 : priorLeak / priorEnd;
	for (const row of rows) row.weight = bookValue === 0 ? 0 : row.endValue / bookValue;
	rows.sort((a, b) => b.endValue - a.endValue);
	const bookTrend = buildBookTrend(filtered, opts.range, startValue);
	const selected = opts.selectedSymbol && book.bySymbol[opts.selectedSymbol] ? book.bySymbol[opts.selectedSymbol] : null;
	const selectedTrend = (selected ? sliceDays(selected.days, opts.range.from, opts.range.to) : []).map((d) => ({
		date: d.date,
		value: d.value,
		price: d.price
	}));
	return {
		range: opts.range,
		prior,
		kpis: {
			bookValue,
			startValue,
			revenue,
			growth,
			churn,
			winners: rows.filter((r) => r.pnl >= 0).length,
			losers: rows.filter((r) => r.pnl < 0).length,
			priorRevenue,
			priorGrowth,
			priorChurn
		},
		rows,
		bookTrend,
		selectedTrend
	};
}
function toRow(series, range) {
	const days = sliceDays(series.days, range.from, range.to);
	const ends = firstAndLast(days);
	if (!ends) return null;
	const startValue = ends.first.value;
	const endValue = ends.last.value;
	const pnl = endValue - startValue;
	const growth = startValue === 0 ? 0 : pnl / startValue;
	return {
		symbol: series.ticker.symbol,
		name: series.ticker.name,
		class: series.ticker.class,
		sector: series.ticker.sector,
		venue: series.ticker.venue,
		units: series.ticker.units,
		startPrice: ends.first.price,
		endPrice: ends.last.price,
		startValue,
		endValue,
		pnl,
		growth,
		weight: 0,
		leaking: pnl < 0,
		spark: sparkline(days)
	};
}
function buildBookTrend(series, range, startValue) {
	const byDate = /* @__PURE__ */ new Map();
	for (const s of series) for (const day of sliceDays(s.days, range.from, range.to)) byDate.set(day.date, (byDate.get(day.date) ?? 0) + day.value);
	return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({
		date,
		value,
		revenue: value - startValue
	}));
}
function formatUsd(value, compact = false) {
	const abs = Math.abs(value);
	const sign = value < 0 ? "-" : "";
	if (compact) {
		if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
		if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}k`;
	}
	return `${sign}$${abs.toLocaleString("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: abs >= 1e3 ? 0 : 2
	})}`;
}
function formatSignedUsd(value, compact = false) {
	const body = formatUsd(value, compact);
	if (value > 0) return `+${body}`;
	return body;
}
function formatPct(value) {
	const n = value * 100;
	const body = `${Math.abs(n).toFixed(2)}%`;
	if (n > 0) return `+${body}`;
	if (n < 0) return `-${body}`;
	return body;
}
function formatPrice(value) {
	return `$${value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: value >= 1e3 ? 2 : 3
	})}`;
}
function formatDateLabel(iso) {
	const [y, m, d] = iso.split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][Number(m) - 1]} ${Number(d)}, ${y}`;
}
function shortDate(iso) {
	const [, m, d] = iso.split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][Number(m) - 1]} ${Number(d)}`;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listNotes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6df0c2ae40e59d70ff0d9e07ef84cb6b1a4b24eafdfebc4cc7fe9d767d5a2bec"));
var upsertNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({
	symbol: data.symbol.trim().toUpperCase(),
	note: data.note,
	pinned: data.pinned
})).handler(createSsrRpc("58ef3b5e580a0ff506ea755e8f92f806ff8e0007a1973251b3bd91ab05271685"));
//#endregion
export { upsertNote as _, buildDashboard as a, formatPrice as c, getMarketBook as d, getTicker as f, sliceDays as g, shortDate as h, Input as i, formatSignedUsd as l, resolveRange as m, Badge as n, formatDateLabel as o, listNotes as p, DateRangeBar as r, formatPct as s, AppShell as t, formatUsd as u, useDashboardStore as v };
