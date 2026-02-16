"use client";

import { useSignOutViewModel } from "@/features/auth/view-model/use-sign-out-view-model";

export function DashboardSignOutButton() {
  const { signOut } = useSignOutViewModel();

  return (
    <button
      type="button"
      aria-label="로그아웃"
      className="flex w-full items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
      onClick={signOut}
    >
      <span className="material-icons text-sm" aria-hidden="true">
        logout
      </span>
      로그아웃
    </button>
  );
}
