-- M5(公開ページ)着手にあたり判明した問題を修正する。
-- これまでの SELECT ポリシーは using (true) で、is_public に関わらず
-- 誰でも全ユーザーのプロフィール行を読めてしまっていた（user_technologies 側は
-- M4で「公開されているか、自分のものか」という正しいOR条件になっている）。
-- /u/[username] はこのポリシーに守られて初めて安全になるため、ここで
-- user_technologies と同じ形に揃える。

drop policy "view" on profiles;

create policy "view"
on profiles
for select
using ( is_public = true or id = auth.uid() );
