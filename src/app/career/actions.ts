"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  status: "idle" | "error" | "ok";
  message?: string;
};

function parseRequiredDate(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.trim() === "") return null;
  return raw;
}

function parseOptionalDate(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.trim() === "") return null;
  return raw;
}

export async function addCareer(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims()).data?.claims;
  if (!claims) {
    return { status: "error", message: "ログインしてください" };
  }

  const company = (formData.get("company") as string | null)?.trim();
  const role = (formData.get("role") as string | null)?.trim();
  const started_on = parseRequiredDate(formData, "started_on");
  if (!company || !role || !started_on) {
    return { status: "error", message: "会社名・役割・開始年月は必須です" };
  }
  const ended_on = parseOptionalDate(formData, "ended_on");
  const summary = (formData.get("summary") as string | null) || null;
  const is_public = formData.get("is_public") === "on";
  const technology_ids = formData.getAll("technology_ids") as string[];

  const { data: career, error } = await supabase
    .from("careers")
    .insert({
      profile_id: claims.sub as string,
      company,
      role,
      started_on,
      ended_on,
      summary,
      is_public,
    })
    .select("id")
    .single();

  if (error || !career) {
    return { status: "error", message: "登録に失敗しました: " + (error?.message ?? "") };
  }

  if (technology_ids.length > 0) {
    const { error: linkError } = await supabase.from("career_technologies").insert(
      technology_ids.map((technology_id) => ({ career_id: career.id, technology_id }))
    );
    if (linkError) {
      return { status: "error", message: "使用技術の登録に失敗しました: " + linkError.message };
    }
  }

  revalidatePath("/career");
  return { status: "ok", message: "登録しました" };
}

export async function updateCareer(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const company = (formData.get("company") as string | null)?.trim();
  const role = (formData.get("role") as string | null)?.trim();
  const started_on = parseRequiredDate(formData, "started_on");
  if (!company || !role || !started_on) {
    return { status: "error", message: "会社名・役割・開始年月は必須です" };
  }
  const ended_on = parseOptionalDate(formData, "ended_on");
  const summary = (formData.get("summary") as string | null) || null;
  const is_public = formData.get("is_public") === "on";
  const technology_ids = formData.getAll("technology_ids") as string[];

  const { error } = await supabase
    .from("careers")
    .update({ company, role, started_on, ended_on, summary, is_public })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "更新に失敗しました: " + error.message };
  }

  const { error: deleteLinksError } = await supabase
    .from("career_technologies")
    .delete()
    .eq("career_id", id);
  if (deleteLinksError) {
    return { status: "error", message: "使用技術の更新に失敗しました: " + deleteLinksError.message };
  }

  if (technology_ids.length > 0) {
    const { error: linkError } = await supabase.from("career_technologies").insert(
      technology_ids.map((technology_id) => ({ career_id: id, technology_id }))
    );
    if (linkError) {
      return { status: "error", message: "使用技術の更新に失敗しました: " + linkError.message };
    }
  }

  revalidatePath("/career");
  return { status: "ok", message: "更新しました" };
}

export async function deleteCareer(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("careers").delete().eq("id", id);

  revalidatePath("/career");
}
