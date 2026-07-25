import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Stack Log",
  description: "自分の技術スタックと習熟度を整理して公開するアプリ",
};

async function Header() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const claims = supabaseConfigured
    ? (await (await createClient()).auth.getClaims()).data?.claims
    : null;

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-sm dark:border-zinc-800 dark:bg-black">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="font-semibold text-black dark:text-zinc-50"
        >
          Tech Stack Log
        </Link>
        <Link
          href="/technologies"
          className="text-zinc-600 dark:text-zinc-400"
        >
          技術マスタ
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {claims ? (
          <>
            <span className="text-zinc-600 dark:text-zinc-400">
              {String(claims.email)}
            </span>
            <Link href="/mytech" className="text-black dark:text-zinc-50">
              マイ技術スタック
            </Link>
            <Link href="/profile" className="text-black dark:text-zinc-50">
              プロフィール
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-zinc-300 px-2 py-1 text-black dark:border-zinc-700 dark:text-zinc-50"
              >
                ログアウト
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded bg-black px-3 py-1 text-white dark:bg-zinc-50 dark:text-black"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
