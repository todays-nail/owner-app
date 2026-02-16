import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function signOutCurrentUser(): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
