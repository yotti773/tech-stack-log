import type { Metadata } from "next";
import { VT323, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

const vt323 = VT323({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-body",
  weight: ["400", "500", "600"],
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
        <Link href="/" className="font-display text-lg tracking-wide text-text">
          Tech Stack Log_
        </Link>
        <Link href="/technologies" className="text-dim hover:text-accent">
          技術マスタ
        </Link>
        {email && (
          <>
            <Link href="/mytech" className="text-dim hover:text-accent">
              マイ技術スタック
            </Link>
            <Link href="/profile" className="text-dim hover:text-accent">
              プロフィール
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {email ? (
          <>
            <span className="flex items-center gap-2 text-dim">
              <span className="flex h-6 w-6 items-center justify-center border border-accent text-xs font-bold text-accent">
                {initial}
              </span>
              {email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="border border-border px-3 py-1.5 text-dim hover:border-accent hover:text-accent"
              >
                ログアウト
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="btn-term px-3 py-1.5 font-semibold">
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
      className={`${vt323.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
