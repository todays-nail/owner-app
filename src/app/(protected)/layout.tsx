import { redirect } from "next/navigation";

import { AppShell } from "@/components/shell/app-shell";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  // If env is missing, keep the app reachable for build/dev scaffolding.
  if (!supabase) {
    return (
      <AppShell>
        <div className="rounded-lg border border-border bg-muted p-4 text-sm">
          Missing env. Set `NEXT_PUBLIC_SUPABASE_URL` and
          `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
        </div>
      </AppShell>
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AppShell headerRight={<SignOutButton />}>{children}</AppShell>;
}
