create table careers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  company text not null,
  role text not null,
  started_on date not null,
  ended_on date,
  summary text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table career_technologies (
  career_id uuid not null references careers (id) on delete cascade,
  technology_id uuid not null references technologies (id) on delete cascade,
  primary key (career_id, technology_id)
);

grant select on table careers to anon, authenticated;
grant insert, update, delete on table careers to authenticated;

grant select on table career_technologies to anon, authenticated;
grant insert, delete on table career_technologies to authenticated;

alter table careers enable row level security;
alter table career_technologies enable row level security;

-- careers: user_technologies/profiles と同じ「公開されているか、自分のものか」の二層RLS
create policy "view"
on careers
for select
using ( is_public = true or profile_id = auth.uid() );

create policy "careers_insert"
on careers
for insert
with check ( profile_id = auth.uid() );

create policy "careers_update"
on careers
for update
using ( profile_id = auth.uid() );

create policy "careers_delete"
on careers
for delete
using ( profile_id = auth.uid() );

-- career_technologies: 自分のテーブルにis_public列を持たないため、
-- 親careerの公開状態・所有者を経由して判定する
create policy "view"
on career_technologies
for select
using (
  exists (
    select 1 from careers c
    where c.id = career_technologies.career_id
      and (c.is_public = true or c.profile_id = auth.uid())
  )
);

create policy "career_technologies_insert"
on career_technologies
for insert
with check (
  exists (
    select 1 from careers c
    where c.id = career_technologies.career_id
      and c.profile_id = auth.uid()
  )
);

create policy "career_technologies_delete"
on career_technologies
for delete
using (
  exists (
    select 1 from careers c
    where c.id = career_technologies.career_id
      and c.profile_id = auth.uid()
  )
);
