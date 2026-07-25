import { createClient } from "@/lib/supabase/server";

export default async function TechnologiesPage() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { data: technologies, error } = supabaseConfigured
    ? await (await createClient())
        .from("technologies")
        .select("id, name, category, official_url")
        .order("name")
    : { data: null, error: null };

  const grouped = new Map<
    string,
    { id: string; name: string; official_url: string | null }[]
  >();

  for (const tech of technologies ?? []) {
    const category = tech.category ?? "未分類";
    const list = grouped.get(category) ?? [];
    list.push({ id: tech.id, name: tech.name, official_url: tech.official_url });
    grouped.set(category, list);
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <h1 className="font-display text-3xl tracking-wide text-text">
          技術マスタ
        </h1>
        <p className="text-sm text-dim">
          このアプリで登録できる技術の一覧です。無ければマイ技術スタックのページから追加できます。
        </p>

        {error && (
          <p className="text-bad">データの取得に失敗しました: {error.message}</p>
        )}

        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-xs uppercase tracking-wide text-dim before:content-['//_']">
              {category}
            </h2>
            <ul className="overflow-hidden border border-border bg-surface">
              {items.map((tech) => (
                <li
                  key={tech.id}
                  className="border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                  {tech.official_url ? (
                    <a
                      href={tech.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-text underline decoration-border underline-offset-2 hover:text-accent hover:decoration-accent"
                    >
                      {tech.name}
                    </a>
                  ) : (
                    <span className="font-medium text-text">{tech.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
