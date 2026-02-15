"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
      }}
    >
      Sign out
    </Button>
  );
}
