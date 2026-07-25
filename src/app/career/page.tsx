import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CareerForm } from "./career-form";
import { CareerRow } from "./career-row";

export default async function CareerPage() {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseConfigured ? await createClient() : null;
  const claims = supabase ? (await supabase.auth.getClaims()).data?.claims : null;

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

  const [{ data: careers }, { data: technologies }] = await Promise.all([
    supabase
      .from("careers")
      .select(
        "id, company, role, started_on, ended_on, summary, is_public, career_technologies(technology_id)"
      )
      .eq("profile_id", claims.sub as string)
      .order("started_on", { ascending: false }),
    supabase.from("technologies").select("id, name").order("name"),
  ]);

  return (
    <div className="flex flex-1 flex-col items-center bg-bg">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-text">略歴</h1>
          <p className="mt-1 text-sm text-dim">
            職歴・経歴と、そこで使った技術を記録します
          </p>
        </div>

        <CareerForm technologies={technologies ?? []} />

        <ul className="overflow-hidden border border-border bg-surface">
          {(careers ?? []).map((career) => (
            <CareerRow
              key={career.id}
              id={career.id}
              company={career.company}
              role={career.role}
              startedOn={career.started_on}
              endedOn={career.ended_on}
              summary={career.summary}
              isPublic={career.is_public}
              technologyIds={career.career_technologies.map((ct) => ct.technology_id)}
              technologies={technologies ?? []}
            />
          ))}
        </ul>

        {(careers ?? []).length === 0 && (
          <p className="text-dim">まだ略歴が登録されていません。</p>
        )}
      </main>
    </div>
  );
}
