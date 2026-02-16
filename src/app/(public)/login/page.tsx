import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";

import { LoginForm } from "./ui";

export const dynamic = "force-dynamic";

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
