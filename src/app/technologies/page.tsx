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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          技術マスタ
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          このアプリで登録できる技術の一覧です。無ければマイ技術スタックのページから追加できます。
        </p>

        {error && (
          <p className="text-red-600">データの取得に失敗しました: {error.message}</p>
        )}

        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              {category}
            </h2>
            <ul>
              {items.map((tech) => (
                <li
                  key={tech.id}
                  className="border-b border-zinc-200 py-2 dark:border-zinc-800"
                >
                  {tech.official_url ? (
                    <a
                      href={tech.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black underline dark:text-zinc-50"
                    >
                      {tech.name}
                    </a>
                  ) : (
                    <span className="text-black dark:text-zinc-50">
                      {tech.name}
                    </span>
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
