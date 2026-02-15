import { Suspense } from "react";

import { LoginForm } from "./ui";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
          <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
