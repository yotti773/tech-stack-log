"use server";

import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "error" | "sent";
  message?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");

  if (typeof email !== "string" || email.trim().length === 0) {
    return { status: "error", message: "メールアドレスを入力してください" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "sent", message: "ログインリンクをメールで送信しました" };
}
