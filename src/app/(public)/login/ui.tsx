"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { IconInput } from "@/components/auth/icon-input";
import { AuthNoticeBox } from "@/components/auth/auth-notice-box";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSignupEmailRedirectTo } from "@/lib/auth/redirects";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function getReadableAuthError(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : "";
  const message = rawMessage.toLowerCase();

  if (message.includes("failed to fetch")) {
    return "인증 서버에 연결하지 못했습니다. 네트워크 상태와 Supabase 설정(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)을 확인해주세요.";
  }

  if (rawMessage.length > 0) {
    return rawMessage;
  }

  return "로그인 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [resendPending, setResendPending] = React.useState(false);
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);

  return (
    <PublicAuthCenter>
      <AuthCard>
        <AuthPageHeader title="사장님 로그인" description="이메일과 비밀번호로 로그인하세요." />

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setResendMessage(null);
            setNeedsEmailConfirm(false);
            setPending(true);
            try {
              const supabase = createSupabaseBrowserClient();
              if (!supabase) {
                setError(
                  "Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
                );
                return;
              }

              const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
              });

              if (signInError) {
                setError(signInError.message);
                const msg = signInError.message.toLowerCase();
                if (msg.includes("not confirmed") || msg.includes("email not confirmed")) {
                  setNeedsEmailConfirm(true);
                }
                return;
              }

              router.refresh();
              router.push(next);
            } catch (unknownError) {
              setError(getReadableAuthError(unknownError));
            } finally {
              setPending(false);
            }
          }}
        >
          <IconInput
            autoComplete="email"
            icon={Mail}
            id="login-email"
            inputMode="email"
            label="이메일"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@oneul.com"
            required
            value={email}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium text-foreground/90" htmlFor="login-password">
                비밀번호
              </label>
              <Link className="text-sm text-primary hover:underline" href="/forgot-password">
                비밀번호 찾기
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoComplete="current-password"
                className="h-12 rounded-full border-border/60 bg-muted/60 pl-11 pr-12 text-base placeholder:text-muted-foreground/90 focus-visible:ring-primary/60 focus-visible:ring-offset-0"
                id="login-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground transition hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                type="button"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <AuthNoticeBox>{error}</AuthNoticeBox>
          ) : null}

          {needsEmailConfirm ? (
            <div className="space-y-2">
              <Button
                className="h-11 w-full rounded-full"
                disabled={resendPending || !email}
                onClick={async () => {
                  setError(null);
                  setResendMessage(null);
                  setResendPending(true);
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

                    setResendMessage("인증 메일을 다시 보냈습니다.");
                  } catch (unknownError) {
                    setError(getReadableAuthError(unknownError));
                  } finally {
                    setResendPending(false);
                  }
                }}
                type="button"
                variant="outline"
              >
                {resendPending ? "보내는 중..." : "인증 메일 재발송"}
              </Button>

              {resendMessage ? (
                <AuthNoticeBox>{resendMessage}</AuthNoticeBox>
              ) : null}
            </div>
          ) : null}

          <AuthPrimaryButton disabled={pending} type="submit">
            {pending ? "로그인 중..." : "로그인"}
          </AuthPrimaryButton>
        </form>
      </AuthCard>

      <AuthFooterLink
        prefixText="계정이 없으신가요?"
        linkText="회원가입"
        href="/signup"
        className="text-base"
      />
    </PublicAuthCenter>
  );
}
