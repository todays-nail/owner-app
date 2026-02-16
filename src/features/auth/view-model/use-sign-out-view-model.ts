"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { signOutCurrentUser } from "@/features/auth/services/auth-browser-service";

export interface SignOutViewModel {
  signOut: () => Promise<void>;
}

export function useSignOutViewModel(): SignOutViewModel {
  const router = useRouter();

  const signOut = React.useCallback(async () => {
    await signOutCurrentUser();
    router.refresh();
    router.push("/login");
  }, [router]);

  return {
    signOut
  };
}
