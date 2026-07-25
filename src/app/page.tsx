import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

export default async function Home() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseConfigured ? await createClient() : null;

  const { data: technologies, error } = supabase
    ? await supabase.from("technologies").select("*").order("name")
    : { data: null, error: null };

  const claims = supabase ? (await supabase.auth.getClaims()).data?.claims : null;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-6 px-8 py-32 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Tech Stack Log
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          自分の技術スタックと習熟度を整理して公開するアプリ。まだ準備中です。
        </p>

        {claims ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">
              ログイン中: {String(claims.email)}
            </span>
            <Link
              href="/mytech"
              className="rounded border border-zinc-300 px-3 py-1 text-black dark:border-zinc-700 dark:text-zinc-50"
            >
              マイ技術スタック
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-zinc-300 px-3 py-1 text-black dark:border-zinc-700 dark:text-zinc-50"
              >
                ログアウト
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded bg-black px-3 py-1 text-sm text-white dark:bg-zinc-50 dark:text-black"
          >
            ログイン
          </Link>
        )}

        {error && (
          <p className="text-red-600">データの取得に失敗しました: {error.message}</p>
        )}

        <ul className="w-full text-left">
          {technologies?.map((tech) => (
            <li
              key={tech.id}
              className="border-b border-zinc-200 py-3 dark:border-zinc-800"
            >
              <span className="font-medium text-black dark:text-zinc-50">
                {tech.name}
              </span>
              {tech.category && (
                <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {tech.category}
                </span>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
