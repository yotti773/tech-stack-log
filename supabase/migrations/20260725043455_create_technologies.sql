create table technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  official_url text,
  created_at timestamptz not null default now()
);

-- 共有マスタなので誰でも読めてよい（書き込みはM4でServer Actions経由に限定する）
grant select on table technologies to anon, authenticated;
