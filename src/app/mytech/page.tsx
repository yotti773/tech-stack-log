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
      <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex w-full max-w-xl flex-col items-center gap-4 px-8 py-32 text-center">
          <p className="text-black dark:text-zinc-50">
            この機能を使うにはログインが必要です。
          </p>
          <Link
            href="/login"
            className="rounded bg-black px-3 py-1 text-sm text-white dark:bg-zinc-50 dark:text-black"
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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          マイ技術スタック
        </h1>

        <AddTechForm technologies={technologies ?? []} />

        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              {category}
            </h2>
            <ul>
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
          <p className="text-zinc-600 dark:text-zinc-400">
            まだ技術が登録されていません。
          </p>
        )}
      </main>
    </div>
  );
}
