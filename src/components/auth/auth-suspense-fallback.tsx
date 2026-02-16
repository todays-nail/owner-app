import { AuthCard } from "@/components/auth/auth-card";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";

export interface AuthSuspenseFallbackProps {
  message?: string;
}

export function AuthSuspenseFallback({
  message = "불러오는 중..."
}: AuthSuspenseFallbackProps) {
  return (
    <PublicAuthCenter>
      <AuthCard>
        <div className="text-sm text-muted-foreground">{message}</div>
      </AuthCard>
    </PublicAuthCenter>
  );
}
