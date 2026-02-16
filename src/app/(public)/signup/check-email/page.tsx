import { Suspense } from "react";

import { AuthSuspenseFallback } from "@/components/auth/auth-suspense-fallback";

import { SignupCheckEmail } from "./ui";

export const dynamic = "force-dynamic";

export default function SignupCheckEmailPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <SignupCheckEmail />
    </Suspense>
  );
}
