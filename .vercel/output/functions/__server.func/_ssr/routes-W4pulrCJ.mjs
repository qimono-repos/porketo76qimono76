import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Info, l as ArrowUpDown, n as Pin } from "../_libs/lucide-react.mjs";
import { a as TooltipTrigger, i as TooltipContent, r as Tooltip } from "./router-CRKGctpY.mjs";
import { i as useCurrentUserState, n as Card } from "./card-B9ubEBfw.mjs";
import { a as buildDashboard, c as formatPrice, d as getMarketBook, f as getTicker, g as sliceDays, h as shortDate, i as Input, l as formatSignedUsd, m as resolveRange, n as Badge, o as formatDateLabel, p as listNotes, r as DateRangeBar, s as formatPct, t as AppShell, u as formatUsd, v as useDashboardStore } from "./watchlist-OSSmK3i8.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip$1, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { i as getSortedRowModel, n as useReactTable, r as getCoreRowModel, t as flexRender } from "../_libs/@tanstack/react-table+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-W4pulrCJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Sparkline({ values, up, className }) {
	if (values.length < 2) return null;
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const w = 72;
	const h = 24;
	const d = values.map((v, i) => {
		const x = i / (values.length - 1) * w;
		const y = h - (v - min) / span * h;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: cn("h-6 w-[72px]", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: up ? "var(--color-up)" : "var(--color-down)",
			strokeWidth: "1.6",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function BreakdownTable({ rows, pinned }) {
	const query = useDashboardStore((s) => s.query);
	const setQuery = useDashboardStore((s) => s.setQuery);
	const selected = useDashboardStore((s) => s.selectedSymbol);
	const selectSymbol = useDashboardStore((s) => s.selectSymbol);
	const setHoverSymbol = useDashboardStore((s) => s.setHoverSymbol);
	const [sorting, setSorting] = (0, import_react.useState)([{
		id: "endValue",
		desc: true
	}]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return [...q ? rows.filter((r) => r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.sector.toLowerCase().includes(q)) : rows].sort((a, b) => Number(pinned.has(b.symbol)) - Number(pinned.has(a.symbol)));
	}, [
		rows,
		query,
		pinned
	]);
	const columns = (0, import_react.useMemo)(() => [
		{
			accessorKey: "symbol",
			header: "Asset",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tracking-tight",
							children: row.original.symbol
						}), pinned.has(row.original.symbol) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3 text-primary" }) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: row.original.name
					})]
				})
			})
		},
		{
			accessorKey: "class",
			header: "Class",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "capitalize",
				children: row.original.class
			})
		},
		{
			id: "spark",
			header: "Path",
			enableSorting: false,
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
				values: row.original.spark,
				up: row.original.growth >= 0
			})
		},
		{
			accessorKey: "endValue",
			header: "Value",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono tabular-nums",
				children: formatUsd(row.original.endValue)
			})
		},
		{
			accessorKey: "weight",
			header: "Wt",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono tabular-nums",
				children: [(row.original.weight * 100).toFixed(1), "%"]
			})
		},
		{
			accessorKey: "pnl",
			header: "Revenue",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono tabular-nums", row.original.pnl >= 0 ? "text-up" : "text-down"),
				children: formatSignedUsd(row.original.pnl)
			})
		},
		{
			accessorKey: "growth",
			header: "Growth",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono tabular-nums", row.original.growth >= 0 ? "text-up" : "text-down"),
				children: formatPct(row.original.growth)
			})
		},
		{
			accessorKey: "leaking",
			header: "Churn",
			cell: ({ row }) => row.original.leaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "down",
				children: "Leaking"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "up",
				children: "Held"
			})
		}
	], [pinned]);
	const table = useReactTable({
		data: filtered,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Breakdown"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-1 text-base font-medium tracking-tight",
				children: [filtered.length, " names in range"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Filter ticker, name, sector",
				className: "sm:max-w-64",
				"aria-label": "Filter breakdown"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-x-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-y border-border",
					children: [hg.headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
						children: header.isPlaceholder ? null : header.column.getCanSort() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex items-center gap-1 hover:text-foreground",
							onClick: header.column.getToggleSortingHandler(),
							children: [flexRender(header.column.columnDef.header, header.getContext()), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3" })]
						}) : flexRender(header.column.columnDef.header, header.getContext())
					}, header.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2.5" })]
				}, hg.id)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: table.getRowModel().rows.map((row) => {
					const active = selected === row.original.symbol;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: cn("border-b border-border/70 transition-[background-color] duration-150 last:border-0", active ? "bg-muted" : "hover:bg-muted/50"),
						onMouseEnter: () => setHoverSymbol(row.original.symbol),
						onMouseLeave: () => setHoverSymbol(null),
						onClick: () => selectSymbol(active ? null : row.original.symbol),
						children: [row.getVisibleCells().map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 align-middle",
							children: flexRender(cell.column.columnDef.cell, cell.getContext())
						}, cell.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/asset/$symbol",
								params: { symbol: row.original.symbol },
								className: "grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-card-elevated hover:text-foreground",
								onClick: (e) => e.stopPropagation(),
								"aria-label": `Open ${row.original.symbol}`,
								children: "→"
							})
						})]
					}, row.id);
				}) })]
			}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-10 text-center text-sm text-muted-foreground",
				children: "No names match that filter."
			}) : null]
		})]
	});
}
var FILTER_LABEL = {
	all: "Full book",
	equity: "Equities",
	crypto: "Crypto"
};
function Hero({ model, classFilter }) {
	const up = model.kpis.growth >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: FILTER_LABEL[classFilter]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					formatDateLabel(model.range.from),
					" – ",
					formatDateLabel(model.range.to)
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Book value"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-4xl font-medium tracking-tight tabular-nums sm:text-5xl",
				children: formatUsd(model.kpis.bookValue)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("mt-2 text-sm tabular-nums", up ? "text-up" : "text-down"),
				children: [
					formatPct(model.kpis.growth),
					" · ",
					model.kpis.winners,
					" up / ",
					model.kpis.losers,
					" down"
				]
			})
		] })]
	});
}
var ITEMS = [
	{
		key: "revenue",
		label: "Revenue",
		hint: "Mark-to-market P&L of the visible book over the selected range."
	},
	{
		key: "growth",
		label: "Growth",
		hint: "Period return: change in book value divided by starting value."
	},
	{
		key: "churn",
		label: "Churn",
		hint: "Share of ending book sitting in names that finished the range down."
	}
];
function KpiCards({ kpis }) {
	const values = {
		revenue: {
			display: formatSignedUsd(kpis.revenue, true),
			positive: kpis.revenue >= 0,
			delta: kpis.revenue - kpis.priorRevenue,
			deltaLabel: `${formatSignedUsd(kpis.revenue - kpis.priorRevenue, true)} vs prior`
		},
		growth: {
			display: formatPct(kpis.growth),
			positive: kpis.growth >= 0,
			delta: kpis.growth - kpis.priorGrowth,
			deltaLabel: `${formatPct(kpis.growth - kpis.priorGrowth)} vs prior`
		},
		churn: {
			display: formatPct(kpis.churn),
			positive: kpis.churn <= kpis.priorChurn,
			delta: kpis.churn - kpis.priorChurn,
			deltaLabel: `${formatPct(kpis.churn - kpis.priorChurn)} vs prior`
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
		children: ITEMS.map((item, i) => {
			const v = values[item.key];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: cn("p-4 stagger-in"),
				style: { animationDelay: `${i * 40}ms` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "relative grid size-8 shrink-0 place-items-center rounded-full text-subtle hover:bg-muted hover:text-foreground",
								"aria-label": `${item.label} definition`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: item.hint })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-2 font-mono text-2xl font-medium tracking-tight tabular-nums", item.key === "churn" ? "text-foreground" : v.positive ? "text-up" : "text-down"),
						children: v.display
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 text-xs tabular-nums", v.positive ? "text-up" : "text-down"),
						children: v.deltaLabel
					})
				]
			}, item.key);
		})
	});
}
function Movers({ rows }) {
	const setHoverSymbol = useDashboardStore((s) => s.setHoverSymbol);
	const selectSymbol = useDashboardStore((s) => s.selectSymbol);
	const selected = useDashboardStore((s) => s.selectedSymbol);
	const leaders = [...rows].sort((a, b) => b.growth - a.growth).slice(0, 3);
	const laggards = [...rows].sort((a, b) => a.growth - b.growth).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoverCard, {
			title: "Leaders",
			rows: leaders,
			selected,
			onHover: setHoverSymbol,
			onSelect: selectSymbol
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoverCard, {
			title: "Laggards",
			rows: laggards,
			selected,
			onHover: setHoverSymbol,
			onSelect: selectSymbol
		})]
	});
}
function MoverCard({ title, rows, selected, onHover, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-1",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-h-12 items-center justify-between gap-3 rounded-xl px-2 transition-[background-color] duration-150", selected === row.symbol ? "bg-muted" : "hover:bg-muted/70"),
				onMouseEnter: () => onHover(row.symbol),
				onMouseLeave: () => onHover(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect(row.symbol),
						className: "min-w-0 flex-1 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium tracking-tight",
							children: row.symbol
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: row.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("font-mono text-sm tabular-nums", row.growth >= 0 ? "text-up" : "text-down"),
							children: formatPct(row.growth)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-muted-foreground tabular-nums",
							children: formatSignedUsd(row.pnl, true)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/asset/$symbol",
						params: { symbol: row.symbol },
						className: "grid size-9 place-items-center rounded-full text-subtle hover:bg-card-elevated hover:text-foreground",
						"aria-label": `Open ${row.symbol}`,
						children: "→"
					})
				]
			}) }, row.symbol))
		})]
	});
}
function ChartTip({ active, payload, isolated }) {
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
				children: isolated && point.price != null ? formatPrice(point.price) : formatUsd(point.value)
			}),
			isolated && point.price != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-muted-foreground tabular-nums",
				children: [formatUsd(point.value), " book"]
			}) : null
		]
	});
}
function TrendChart({ model }) {
	const selectedSymbol = useDashboardStore((s) => s.selectedSymbol);
	const hoverSymbol = useDashboardStore((s) => s.hoverSymbol);
	const selectSymbol = useDashboardStore((s) => s.selectSymbol);
	const preview = hoverSymbol ?? selectedSymbol;
	const ticker = preview ? getTicker(preview) : void 0;
	const data = (0, import_react.useMemo)(() => {
		if (!preview) return model.bookTrend;
		const series = getMarketBook().bySymbol[preview];
		if (!series) return model.bookTrend;
		return sliceDays(series.days, model.range.from, model.range.to).map((d) => ({
			date: d.date,
			value: d.value,
			price: d.price
		}));
	}, [
		preview,
		model.bookTrend,
		model.range.from,
		model.range.to
	]);
	const isolated = Boolean(preview);
	const up = data.length > 1 ? data[data.length - 1].value >= data[0].value : true;
	const stroke = up ? "var(--color-up)" : "var(--color-down)";
	const gradientId = up ? "vantage-up" : "vantage-down";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 p-4 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "Trend"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-base font-medium tracking-tight",
					children: ticker ? `${ticker.symbol} · ${ticker.name}` : "Book value"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: ticker ? "Hover a row to preview · tap to lock" : "Full book · hover a name below to isolate it"
				})
			] }), selectedSymbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => selectSymbol(null),
				className: "h-9 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground hover:text-foreground",
				children: "Show book"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-56 px-1 pb-2 sm:h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data,
					margin: {
						top: 8,
						right: 12,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: gradientId,
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
							tickFormatter: (v) => formatUsd(v, true),
							tick: {
								fill: "var(--color-subtle)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							width: 56,
							domain: [(min) => min * .992, (max) => max * 1.008]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip$1, {
							content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { isolated }),
							cursor: {
								stroke: "var(--color-border-strong)",
								strokeDasharray: "4 4"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "value",
							stroke,
							strokeWidth: 2,
							fill: `url(#${gradientId})`,
							isAnimationActive: false
						})
					]
				})
			})
		})]
	});
}
function Home() {
	const preset = useDashboardStore((s) => s.preset);
	const custom = useDashboardStore((s) => s.custom);
	const classFilter = useDashboardStore((s) => s.classFilter);
	const selectedSymbol = useDashboardStore((s) => s.selectedSymbol);
	const { user, isPending } = useCurrentUserState();
	const [notes, setNotes] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) {
			setNotes([]);
			return;
		}
		let cancelled = false;
		listNotes().then((rows) => {
			if (!cancelled) setNotes(rows);
		}).catch(() => {
			if (!cancelled) setNotes([]);
		});
		return () => {
			cancelled = true;
		};
	}, [user, isPending]);
	const range = (0, import_react.useMemo)(() => resolveRange(preset, custom), [preset, custom]);
	const model = (0, import_react.useMemo)(() => buildDashboard({
		range,
		classFilter,
		selectedSymbol
	}), [
		range,
		classFilter,
		selectedSymbol
	]);
	const pinned = (0, import_react.useMemo)(() => new Set(notes.filter((n) => n.pinned).map((n) => n.symbol)), [notes]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
				model,
				classFilter
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCards, { kpis: model.kpis }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, { model }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Movers, { rows: model.rows }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreakdownTable, {
				rows: model.rows,
				pinned
			})
		]
	}) });
}
//#endregion
export { Home as component };
