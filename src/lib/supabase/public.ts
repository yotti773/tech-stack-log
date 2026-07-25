import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// /u/[username] のような未認証・公開ページ専用。cookies() を一切読まないため、
// server.ts の createClient() と違いISR/静的レンダリングを妨げない。
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
