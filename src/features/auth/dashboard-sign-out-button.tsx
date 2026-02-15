"use client";

import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function DashboardSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="로그아웃"
      className="flex w-full items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
      }}
    >
      <span className="material-icons text-sm" aria-hidden="true">
        logout
      </span>
      로그아웃
    </button>
  );
}
