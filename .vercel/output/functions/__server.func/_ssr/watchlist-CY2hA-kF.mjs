import { i as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-BHuQWqIt.mjs";
import { t as authMiddleware } from "./middleware-CDL9FEVX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watchlist-CY2hA-kF.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listNotes_createServerFn_handler = createServerRpc({
	id: "6df0c2ae40e59d70ff0d9e07ef84cb6b1a4b24eafdfebc4cc7fe9d767d5a2bec",
	name: "listNotes",
	filename: "src/lib/watchlist.ts"
}, (opts) => listNotes.__executeServer(opts));
var listNotes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotes_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select symbol, note, pinned
      from ticker_notes
      where user_id = ${context.userId}
      order by pinned desc, symbol asc
    `;
});
var upsertNote_createServerFn_handler = createServerRpc({
	id: "58ef3b5e580a0ff506ea755e8f92f806ff8e0007a1973251b3bd91ab05271685",
	name: "upsertNote",
	filename: "src/lib/watchlist.ts"
}, (opts) => upsertNote.__executeServer(opts));
var upsertNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({
	symbol: data.symbol.trim().toUpperCase(),
	note: data.note,
	pinned: data.pinned
})).handler(upsertNote_createServerFn_handler, async ({ context, data }) => {
	if (!data.symbol) return;
	const sql = await getSql();
	const existing = await sql`
      select symbol, note, pinned
      from ticker_notes
      where user_id = ${context.userId} and symbol = ${data.symbol}
    `;
	const nextNote = data.note ?? existing[0]?.note ?? "";
	const nextPinned = data.pinned ?? existing[0]?.pinned ?? false;
	await sql`
      insert into ticker_notes (user_id, symbol, note, pinned, updated_at)
      values (${context.userId}, ${data.symbol}, ${nextNote}, ${nextPinned}, now())
      on conflict (user_id, symbol)
      do update set
        note = excluded.note,
        pinned = excluded.pinned,
        updated_at = now()
    `;
});
//#endregion
export { listNotes_createServerFn_handler, upsertNote_createServerFn_handler };
