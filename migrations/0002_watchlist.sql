create table if not exists ticker_notes (
  user_id text not null,
  symbol text not null,
  note text not null default '',
  pinned boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, symbol)
);
create index if not exists ticker_notes_user_id_idx on ticker_notes (user_id);
