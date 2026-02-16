import { Suspense } from "react";

import { AuthSuspenseFallback } from "@/components/auth/auth-suspense-fallback";

import { LoginForm } from "./ui";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <LoginForm />
    </Suspense>
  );
}
