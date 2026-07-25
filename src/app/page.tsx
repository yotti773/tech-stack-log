import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const claims = supabaseConfigured
    ? (await (await createClient()).auth.getClaims()).data?.claims
    : null;

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-xl flex-col items-center gap-6 px-8 py-32 text-center">
        <h1 className="font-display text-4xl tracking-wide text-text">
          Tech Stack Log
        </h1>
        <p className="text-lg leading-8 text-dim">
          自分の技術スタックと習熟度を整理して公開するアプリ。
        </p>

        {claims ? (
          <Link href="/mytech" className="btn-term px-4 py-2 font-semibold">
            マイ技術スタックを見る
          </Link>
        ) : (
          <Link href="/login" className="btn-term px-4 py-2 font-semibold">
            ログインしてはじめる
          </Link>
        )}
      </main>
    </div>
  );
}
