import { redirect } from "next/navigation";

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
      <div className="min-h-dvh bg-background p-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-muted p-4 text-sm">
          Missing env. Set `NEXT_PUBLIC_SUPABASE_URL` and
          `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
        </div>
      </div>
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return children;
}
