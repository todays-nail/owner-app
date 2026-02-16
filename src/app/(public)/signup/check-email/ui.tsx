"use client";

import { MailCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { AuthNoticeBox } from "@/components/auth/auth-notice-box";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { getSignupEmailRedirectTo } from "@/lib/auth/redirects";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignupCheckEmail() {
  const sp = useSearchParams();
  const email = sp.get("email") || "";

  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  return (
    <PublicAuthCenter>
      <AuthCard>
        <AuthPageHeader
          title="이메일을 확인해 주세요"
          description="인증 메일을 보냈습니다. 메일 인증 후 사업자 인증을 진행할 수 있어요."
        />

        {email ? (
          <AuthNoticeBox className="mt-6">{email}</AuthNoticeBox>
        ) : null}

        {error ? (
          <AuthNoticeBox className="mt-3">{error}</AuthNoticeBox>
        ) : null}

        {message ? (
          <AuthNoticeBox className="mt-3">{message}</AuthNoticeBox>
        ) : null}

        <div className="mt-6 space-y-3">
          <AuthPrimaryButton
            disabled={pending || !email}
            onClick={async () => {
              setError(null);
              setMessage(null);
              setPending(true);
              try {
                const supabase = createSupabaseBrowserClient();
                if (!supabase) {
                  setError(
                    "Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
                  );
                  return;
                }

                const emailRedirectTo = getSignupEmailRedirectTo();

                const { error: resendError } = await supabase.auth.resend({
                  type: "signup",
                  email,
                  options: emailRedirectTo ? { emailRedirectTo } : undefined
                });

                if (resendError) {
                  setError(resendError.message);
                  return;
                }

                setMessage("인증 메일을 다시 보냈습니다.");
              } finally {
                setPending(false);
              }
            }}
            type="button"
          >
            <MailCheck className="mr-2 h-4 w-4" />
            {pending ? "보내는 중..." : "인증 메일 재발송"}
          </AuthPrimaryButton>

          <AuthFooterLink
            prefixText=""
            linkText="로그인으로 이동"
            href="/login"
            className="mt-0"
          />
        </div>
      </AuthCard>
    </PublicAuthCenter>
  );
}
