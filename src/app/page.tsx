import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-6 px-8 py-32 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Tech Stack Log
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          自分の技術スタックと習熟度を整理して公開するアプリ。
        </p>

        <Link
          href="/login"
          className="rounded bg-black px-4 py-2 text-white dark:bg-zinc-50 dark:text-black"
        >
          ログインしてはじめる
        </Link>
      </main>
    </div>
  );
}
