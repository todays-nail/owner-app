"use client";

import { Button } from "@/components/ui/button";
import { useSignOutViewModel } from "@/features/auth/view-model/use-sign-out-view-model";

export function SignOutButton() {
  const { signOut } = useSignOutViewModel();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={signOut}
    >
      Sign out
    </Button>
  );
}
