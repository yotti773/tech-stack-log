import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
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
          <Link href="/login" className="btn-term px-3 py-1.5 text-sm font-semibold">
            ログイン
          </Link>
        </main>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, is_public")
    .eq("id", claims.sub as string)
    .single();

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-lg flex-col gap-8 px-8 py-16">
        <h1 className="font-display text-3xl tracking-wide text-text">
          プロフィール編集
        </h1>
        <ProfileForm
          username={profile?.username ?? ""}
          displayName={profile?.display_name ?? ""}
          bio={profile?.bio ?? ""}
          isPublic={profile?.is_public ?? false}
        />
      </main>
    </div>
  );
}
