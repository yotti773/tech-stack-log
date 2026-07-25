"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  status: "idle" | "error" | "ok";
  message?: string;
};

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims()).data?.claims;
  if (!claims) {
    return { status: "error", message: "ログインしてください" };
  }

  const username = (formData.get("username") as string | null)?.trim() || null;
  const display_name =
    (formData.get("display_name") as string | null)?.trim() || null;
  const bio = (formData.get("bio") as string | null)?.trim() || null;
  const is_public = formData.get("is_public") === "on";

  if (username && !/^[a-z0-9_-]{3,20}$/.test(username)) {
    return {
      status: "error",
      message:
        "ユーザー名は半角英小文字・数字・ハイフン・アンダースコアで3〜20文字にしてください（公開ページのURLになります）",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, display_name, bio, is_public })
    .eq("id", claims.sub as string);

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "そのユーザー名はすでに使われています" };
    }
    return { status: "error", message: "更新に失敗しました: " + error.message };
  }

  revalidatePath("/profile");
  return { status: "ok", message: "更新しました" };
}
