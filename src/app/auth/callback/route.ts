import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth(GitHub)用のコールバック。
// マジックリンク確認用の /auth/confirm とは別物なので混同しないこと:
//   /auth/confirm … メールのtoken_hashを verifyOtp() で検証する
//   /auth/callback … プロバイダから返る code を exchangeCodeForSession() で交換する
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // request.url のホスト名は実際の接続先と食い違うことがあるため、
  // 実際に届いたHostヘッダーからoriginを組み立てる（/auth/confirm と同じ理由）
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;

  const code = searchParams.get("code");

  // オープンリダイレクト防止。外部URLを渡されても自サイト内に留める
  const requestedNext = searchParams.get("next") ?? "/";
  const next = requestedNext.startsWith("/") ? requestedNext : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // GitHub側で許可をキャンセルした場合などは code の代わりに error が返る
  const providerError =
    searchParams.get("error_description") ?? searchParams.get("error");

  console.error("auth/callback: code missing", { providerError });
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent(
      providerError ?? "認証コードを受け取れませんでした"
    )}`
  );
}
