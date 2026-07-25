create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- M1のtechnologiesと同様、テーブル作成だけではanon/authenticatedに権限が付かないため明示的にgrantする
grant select on table profiles to anon, authenticated;
grant update on table profiles to authenticated;

-- 新規ユーザー登録（auth.users への insert）をフックし、profiles の行を自動生成する
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLSを有効化。ポリシーが1件も無い状態はデフォルトで全拒否になる（GRANTがあっても関係ない）
alter table profiles enable row level security;

-- SELECT: 誰でも読める
create policy "view"
on profiles
for select
using ( true );

-- UPDATE: 自分の行だけ更新できる
create policy "update_own_profile"
on profiles
for update
using ( id = auth.uid() );
