import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Pin, u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as Route$1 } from "./router-CRKGctpY.mjs";
import { i as useCurrentUserState, n as Card, t as Button } from "./card-B9ubEBfw.mjs";
import { _ as upsertNote, c as formatPrice, d as getMarketBook, f as getTicker, g as sliceDays, h as shortDate, l as formatSignedUsd, m as resolveRange, n as Badge, o as formatDateLabel, p as listNotes, r as DateRangeBar, s as formatPct, t as AppShell, u as formatUsd, v as useDashboardStore } from "./watchlist-OSSmK3i8.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset._symbol-FNbA7RA4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssetPage() {
	const { symbol } = Route$1.useParams();
	const ticker = getTicker(symbol);
	const preset = useDashboardStore((s) => s.preset);
	const custom = useDashboardStore((s) => s.custom);
	const range = (0, import_react.useMemo)(() => resolveRange(preset, custom), [preset, custom]);
	const { user, isPending } = useCurrentUserState();
	const [note, setNote] = (0, import_react.useState)("");
	const [pinned, setPinned] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isPending || !user || !ticker) return;
		let cancelled = false;
		listNotes().then((rows) => {
			if (cancelled) return;
			const row = rows.find((r) => r.symbol === ticker.symbol);
			setNote(row?.note ?? "");
			setPinned(row?.pinned ?? false);
		}).catch(() => void 0);
		return () => {
			cancelled = true;
		};
	}, [
		user,
		isPending,
		ticker
	]);
	if (!ticker) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-medium",
				children: "Unknown ticker"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [symbol.toUpperCase(), " is not on this desk."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to overview"
				})
			})
		]
	}) });
	const symbolKey = ticker.symbol;
	const series = getMarketBook().bySymbol[symbolKey];
	const days = series ? sliceDays(series.days, range.from, range.to) : [];
	const first = days[0];
	const last = days[days.length - 1];
	const pnl = first && last ? last.value - first.value : 0;
	const growth = first && last && first.value !== 0 ? pnl / first.value : 0;
	const up = growth >= 0;
	const stroke = up ? "var(--color-up)" : "var(--color-down)";
	async function persist(next) {
		if (!user) return;
		setSaving(true);
		try {
			await upsertNote({ data: {
				symbol: symbolKey,
				note: next.note ?? note,
				pinned: next.pinned ?? pinned
			} });
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Back",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl font-medium tracking-tight",
								children: ticker.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "capitalize",
								children: ticker.class
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: ticker.sector })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted-foreground",
						children: ticker.name
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Last mark"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-4xl font-medium tabular-nums",
					children: last ? formatPrice(last.price) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-2 text-sm tabular-nums", up ? "text-up" : "text-down"),
					children: [
						formatPct(growth),
						" · ",
						formatSignedUsd(pnl),
						" on ",
						ticker.units.toLocaleString(),
						" units"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-subtle",
					children: [
						formatDateLabel(range.from),
						" – ",
						formatDateLabel(range.to),
						" · ",
						ticker.venue
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Position",
						value: last ? formatUsd(last.value) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Revenue",
						value: formatSignedUsd(pnl),
						tone: up ? "up" : "down"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Growth",
						value: formatPct(growth),
						tone: up ? "up" : "down"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Price"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 sm:h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: days,
							margin: {
								top: 8,
								right: 12,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "asset-fill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: stroke,
										stopOpacity: .28
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: stroke,
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tickFormatter: shortDate,
									tick: {
										fill: "var(--color-subtle)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									minTickGap: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									dataKey: "price",
									tickFormatter: (v) => formatPrice(v),
									tick: {
										fill: "var(--color-subtle)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									width: 64,
									domain: ["auto", "auto"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									content: ({ active, payload }) => {
										if (!active || !payload?.[0]) return null;
										const point = payload[0].payload;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted-foreground",
													children: shortDate(point.date)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 font-mono text-sm tabular-nums",
													children: formatPrice(point.price)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-0.5 text-muted-foreground tabular-nums",
													children: [formatUsd(point.value), " book"]
												})
											]
										});
									},
									cursor: {
										stroke: "var(--color-border-strong)",
										strokeDasharray: "4 4"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "price",
									stroke,
									strokeWidth: 2,
									fill: "url(#asset-fill)",
									isAnimationActive: false
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Desk note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: user ? "Saved to your account." : "Sign in to pin this name and keep a note."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: pinned ? "default" : "secondary",
						size: "sm",
						disabled: !user || saving,
						onClick: () => {
							const next = !pinned;
							setPinned(next);
							persist({ pinned: next });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5" }), pinned ? "Pinned" : "Pin"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: note,
					onChange: (e) => setNote(e.target.value),
					onBlur: () => {
						if (user) persist({ note });
					},
					disabled: !user,
					rows: 4,
					placeholder: user ? "Add a thesis, level, or reminder" : "Sign in to write a note",
					className: "mt-3 w-full resize-none rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
				})]
			})
		]
	}) });
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-2 font-mono text-xl font-medium tabular-nums", tone === "up" && "text-up", tone === "down" && "text-down"),
			children: value
		})]
	});
}
//#endregion
export { AssetPage as component };
