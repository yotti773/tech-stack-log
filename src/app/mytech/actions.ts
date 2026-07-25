"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  status: "idle" | "error" | "ok";
  message?: string;
};

function parseLevel(formData: FormData): number | null {
  const raw = formData.get("level");
  const level = Number(raw);
  if (!Number.isInteger(level) || level < 1 || level > 5) return null;
  return level;
}

function parseYears(formData: FormData): number | null {
  const raw = formData.get("years");
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const years = Number(raw);
  return Number.isFinite(years) && years >= 0 ? years : null;
}

export async function addUserTechnology(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims()).data?.claims;
  if (!claims) {
    return { status: "error", message: "ログインしてください" };
  }

  const level = parseLevel(formData);
  if (level === null) {
    return { status: "error", message: "習熟度は1〜5で入力してください" };
  }
  const years = parseYears(formData);
  const note = (formData.get("note") as string | null) || null;
  const is_public = formData.get("is_public") === "on";

  let technology_id = formData.get("technology_id") as string;
  const newName = (formData.get("new_technology_name") as string | null)?.trim();

  if (!technology_id && newName) {
    const { data: existing } = await supabase
      .from("technologies")
      .select("id")
      .ilike("name", newName)
      .maybeSingle();

    if (existing) {
      technology_id = existing.id;
    } else {
      const category = (formData.get("category") as string | null)?.trim() || null;
      const { data: created, error: createError } = await supabase
        .from("technologies")
        .insert({ name: newName, category })
        .select("id")
        .single();

      if (createError || !created) {
        return {
          status: "error",
          message: "技術の新規追加に失敗しました: " + (createError?.message ?? ""),
        };
      }
      technology_id = created.id;
    }
  }

  if (!technology_id) {
    return { status: "error", message: "技術を選択するか、新しい技術名を入力してください" };
  }

  const { error } = await supabase.from("user_technologies").insert({
    profile_id: claims.sub as string,
    technology_id,
    level,
    years,
    note,
    is_public,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "その技術はすでに登録されています" };
    }
    return { status: "error", message: "登録に失敗しました: " + error.message };
  }

  revalidatePath("/mytech");
  return { status: "ok", message: "登録しました" };
}

export async function updateUserTechnology(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const level = parseLevel(formData);
  if (level === null) {
    return { status: "error", message: "習熟度は1〜5で入力してください" };
  }
  const years = parseYears(formData);
  const note = (formData.get("note") as string | null) || null;
  const is_public = formData.get("is_public") === "on";

  const { error } = await supabase
    .from("user_technologies")
    .update({ level, years, note, is_public })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "更新に失敗しました: " + error.message };
  }

  revalidatePath("/mytech");
  return { status: "ok", message: "更新しました" };
}

export async function deleteUserTechnology(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("user_technologies").delete().eq("id", id);

  revalidatePath("/mytech");
}
