import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { LevelMeter } from "./level-meter";

// 共通ヘッダー(layout.tsx)が毎リクエスト cookies() を読むため、このページを
// 含めアプリ全体がすでに動的レンダリングになっている。revalidate を指定しても
// 効果が無いため、誤解を招かないよう指定しない(詳細は構築手順書のM5参照)。

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getPublicProfile(username: string) {
  if (!supabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio")
    .eq("username", username)
    .eq("is_public", true)
    .maybeSingle();

  return profile;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    return { title: "ユーザーが見つかりません - Tech Stack Log" };
  }

  const name = profile.display_name || profile.username || username;
  const title = `${name}の技術スタック - Tech Stack Log`;
  const description = profile.bio || `${name}が登録している技術スタックの一覧です。`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  const supabase = createPublicClient();
  const { data: rows } = await supabase
    .from("user_technologies")
    .select("level, years, note, technologies(name, category)")
    .eq("profile_id", profile.id)
    .eq("is_public", true);

  const grouped = new Map<
    string,
    { name: string; level: number; years: number | null; note: string | null }[]
  >();

  for (const row of rows ?? []) {
    const tech = row.technologies;
    if (!tech) continue;
    const category = tech.category ?? "未分類";
    const list = grouped.get(category) ?? [];
    list.push({ name: tech.name, level: row.level, years: row.years, note: row.note });
    grouped.set(category, list);
  }

  const displayName = profile.display_name || profile.username;

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-text">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-dim">@{profile.username}</p>
          {profile.bio && <p className="mt-4 text-sm text-text">{profile.bio}</p>}
        </div>

        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-xs uppercase tracking-wide text-dim before:content-['//_']">
              {category}
            </h2>
            <ul className="overflow-hidden border border-border bg-surface">
              {items.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                  <span className="min-w-28 font-semibold text-accent">
                    {item.name}
                  </span>
                  <LevelMeter value={item.level} />
                  <span className="text-dim">
                    {item.years != null ? `${item.years}年` : ""}
                    {item.years != null && item.note ? "・" : ""}
                    {item.note}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {grouped.size === 0 && (
          <p className="text-dim">まだ公開されている技術はありません。</p>
        )}
      </main>
    </div>
  );
}
