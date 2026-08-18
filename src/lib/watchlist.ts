import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type TickerNote = {
  symbol: string;
  note: string;
  pinned: boolean;
};

export const listNotes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<TickerNote>`
      select symbol, note, pinned
      from ticker_notes
      where user_id = ${context.userId}
      order by pinned desc, symbol asc
    `;
  });

export const upsertNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { symbol: string; note?: string; pinned?: boolean }) => ({
    symbol: data.symbol.trim().toUpperCase(),
    note: data.note,
    pinned: data.pinned,
  }))
  .handler(async ({ context, data }) => {
    if (!data.symbol) return;
    const sql = await getSql();
    const existing = await sql<TickerNote>`
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
