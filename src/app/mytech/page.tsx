import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddTechForm } from "./add-tech-form";
import { TechRow } from "./tech-row";

export default async function MyTechPage() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseConfigured ? await createClient() : null;
  const claims = supabase
    ? (await supabase.auth.getClaims()).data?.claims
    : null;

  if (!supabase || !claims) {
    return (
      <div className="flex flex-1 flex-col items-center bg-bg">
        <main className="flex w-full max-w-xl flex-col items-center gap-4 px-8 py-32 text-center">
          <p className="text-text">この機能を使うにはログインが必要です。</p>
          <Link
            href="/login"
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-fg"
          >
            ログイン
          </Link>
        </main>
      </div>
    );
  }

  const [{ data: myTech }, { data: technologies }] = await Promise.all([
    supabase
      .from("user_technologies")
      .select("id, level, years, note, is_public, technologies(id, name, category)")
      .eq("profile_id", claims.sub as string),
    supabase.from("technologies").select("id, name").order("name"),
  ]);

  const grouped = new Map<
    string,
    { id: string; name: string; level: number; years: number | null; note: string | null; is_public: boolean }[]
  >();

  for (const row of myTech ?? []) {
    const tech = row.technologies;
    if (!tech) continue;
    const category = tech.category ?? "未分類";
    const list = grouped.get(category) ?? [];
    list.push({
      id: row.id,
      name: tech.name,
      level: row.level,
      years: row.years,
      note: row.note,
      is_public: row.is_public,
    });
    grouped.set(category, list);
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            マイ技術スタック
          </h1>
          <p className="mt-1 text-sm text-dim">
            登録した技術を習熟度・カテゴリごとに管理します
          </p>
        </div>

        <AddTechForm technologies={technologies ?? []} />

        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-dim">
              {category}
            </h2>
            <ul className="overflow-hidden rounded-lg border border-border bg-surface">
              {items.map((item) => (
                <TechRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  level={item.level}
                  years={item.years}
                  note={item.note}
                  isPublic={item.is_public}
                />
              ))}
            </ul>
          </section>
        ))}

        {grouped.size === 0 && (
          <p className="text-dim">まだ技術が登録されていません。</p>
        )}
      </main>
    </div>
  );
}
