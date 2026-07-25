"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

// config.toml の minimum_password_length に合わせる
const MIN_PASSWORD_LENGTH = 6;

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  // signInWithOAuth はサーバー側では遷移せず「飛ばすべきURL」を返すだけなので、
  // こちらで redirect する
  if (error || !data?.url) {
    redirect(
      `/login?error=${encodeURIComponent(
        error?.message ?? "GitHubログインを開始できませんでした"
      )}`
    );
  }

  redirect(data.url);
}

export async function authenticate(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const isSignUp = formData.get("mode") === "signup";

  if (typeof email !== "string" || email.trim() === "") {
    return { status: "error", message: "メールアドレスを入力してください" };
  }
  if (typeof password !== "string" || password === "") {
    return { status: "error", message: "パスワードを入力してください" };
  }
  if (isSignUp && password.length < MIN_PASSWORD_LENGTH) {
    return {
      status: "error",
      message: `パスワードは${MIN_PASSWORD_LENGTH}文字以上にしてください`,
    };
  }

  const supabase = await createClient();

  const { error } = isSignUp
    ? await supabase.auth.signUp({ email, password })
    : await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      // ログイン失敗時はどちらが違うかを伝えない（アカウントの存在を推測させないため）
      message: isSignUp
        ? `登録に失敗しました: ${error.message}`
        : "メールアドレスまたはパスワードが違います",
    };
  }

  // redirect は例外を投げるので try/catch の外で呼ぶ（Next.jsのdocsの指示）
  redirect("/");
}
