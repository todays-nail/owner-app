import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";

import { SignupCheckEmail } from "./ui";

export const dynamic = "force-dynamic";

export default function SignupCheckEmailPage() {
  return (
    <Suspense
      fallback={
        <PublicAuthCenter>
          <AuthCard>
            <div className="text-sm text-muted-foreground">불러오는 중...</div>
          </AuthCard>
        </PublicAuthCenter>
      }
    >
      <SignupCheckEmail />
    </Suspense>
  );
}
