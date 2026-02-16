"use client";

import { Mail } from "lucide-react";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { IconInput } from "@/components/auth/icon-input";
import { AuthNoticeBox } from "@/components/auth/auth-notice-box";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <PublicAuthCenter>
      <AuthCard>
        <AuthPageHeader
          title="비밀번호 재설정"
          description="가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요."
        />

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setMessage(null);

            setPending(true);
            try {
              const supabase = createSupabaseBrowserClient();
              if (!supabase) {
                setError("Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
                return;
              }

              let redirectTo: string | undefined;
              try {
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
                if (siteUrl) {
                  redirectTo = new URL("/auth/callback?next=/reset-password", siteUrl).toString();
                } else if (typeof window !== "undefined") {
                  redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
                }
              } catch {
                if (typeof window !== "undefined") {
                  redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
                }
              }

              const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo
              });

              if (resetError) {
                setError(resetError.message);
                return;
              }

              setMessage("메일을 보냈습니다. 받은편지함을 확인해 주세요.");
            } finally {
              setPending(false);
            }
          }}
        >
          <IconInput
            autoComplete="email"
            icon={Mail}
            id="forgot-password-email"
            inputMode="email"
            label="이메일"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@oneul.com"
            required
            value={email}
          />

          {error ? (
            <AuthNoticeBox>{error}</AuthNoticeBox>
          ) : null}

          {message ? (
            <AuthNoticeBox>{message}</AuthNoticeBox>
          ) : null}

          <AuthPrimaryButton disabled={pending} type="submit">
            {pending ? "보내는 중..." : "재설정 링크 보내기"}
          </AuthPrimaryButton>
        </form>
      </AuthCard>

      <AuthFooterLink prefixText="" linkText="로그인으로 돌아가기" href="/login" />
    </PublicAuthCenter>
  );
}
