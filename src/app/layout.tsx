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

  const email = claims ? String(claims.email) : null;
  const initial = email ? email[0]!.toUpperCase() : "";

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3 text-sm">
      <div className="flex items-center gap-5">
        <Link href="/" className="font-bold tracking-tight text-text">
          Tech Stack Log
        </Link>
        <Link href="/technologies" className="text-dim hover:text-text">
          技術マスタ
        </Link>
        {email && (
          <>
            <Link href="/mytech" className="text-dim hover:text-text">
              マイ技術スタック
            </Link>
            <Link href="/profile" className="text-dim hover:text-text">
              プロフィール
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {email ? (
          <>
            <span className="flex items-center gap-2 text-dim">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-fg">
                {initial}
              </span>
              {email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-text hover:bg-bg"
              >
                ログアウト
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-accent px-3 py-1.5 font-semibold text-accent-fg"
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
