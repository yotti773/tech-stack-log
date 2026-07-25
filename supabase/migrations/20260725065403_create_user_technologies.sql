create table user_technologies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  technology_id uuid not null references technologies (id) on delete cascade,
  level smallint not null check (level between 1 and 5),
  years numeric(4, 1) check (years >= 0),
  note text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (profile_id, technology_id)
);

grant select on table user_technologies to anon, authenticated;
grant insert, update, delete on table user_technologies to authenticated;

-- 「無ければ新規追加」機能のため、共有マスタへの書き込みをログインユーザーに開放する
grant insert on table technologies to authenticated;

alter table user_technologies enable row level security;

-- SELECT: 公開されているか、自分のものなら読める（二層のRLS）
create policy "view"
on user_technologies
for select
using ( is_public = true or profile_id = auth.uid() );

-- INSERT: 自分のprofile_idでしか新規登録できない
create policy "user_technologies_insert"
on user_technologies
for insert
with check ( profile_id = auth.uid() );

-- UPDATE: 自分の行だけ更新できる
create policy "user_technologies_update"
on user_technologies
for update
using ( profile_id = auth.uid() );

-- DELETE: 自分の行だけ削除できる
create policy "user_technologies_delete"
on user_technologies
for delete
using ( profile_id = auth.uid() );
