import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface AuthServiceResult {
  errorMessage: string | null;
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<AuthServiceResult> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return {
      errorMessage: "Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return {
    errorMessage: error?.message ?? null
  };
}

export async function signUpWithEmailPassword(
  email: string,
  password: string
): Promise<AuthServiceResult> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return {
      errorMessage: "Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  return {
    errorMessage: error?.message ?? null
  };
}

export async function signOutCurrentUser(): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
