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
  const [{ data: rows }, { data: careers }] = await Promise.all([
    supabase
      .from("user_technologies")
      .select("level, years, note, technologies(name, category)")
      .eq("profile_id", profile.id)
      .eq("is_public", true),
    supabase
      .from("careers")
      .select("id, company, role, started_on, ended_on, summary, career_technologies(technologies(name))")
      .eq("profile_id", profile.id)
      .eq("is_public", true)
      .order("started_on", { ascending: false }),
  ]);

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

        {(careers ?? []).length > 0 && (
          <section>
            <h2 className="mb-2 text-xs uppercase tracking-wide text-dim before:content-['//_']">
              略歴
            </h2>
            <ul className="overflow-hidden border border-border bg-surface">
              {(careers ?? []).map((career) => (
                <li
                  key={career.id}
                  className="flex flex-col gap-1 border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-semibold text-accent">{career.company}</span>
                    <span className="text-text">{career.role}</span>
                    <span className="text-xs text-dim">
                      {career.started_on} 〜 {career.ended_on ?? "現在"}
                    </span>
                  </div>
                  {career.summary && <p className="text-dim">{career.summary}</p>}
                  {career.career_technologies.length > 0 && (
                    <p className="text-xs text-dim">
                      {career.career_technologies
                        .map((ct) => ct.technologies?.name)
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
