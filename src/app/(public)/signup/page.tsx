"use client";

import {
  ArrowRight,
  Info,
  Lock,
  Mail,
  Phone,
  RotateCw,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooterLink } from "@/components/auth/auth-footer-link";
import { IconInput } from "@/components/auth/icon-input";
import { AuthNoticeBox } from "@/components/auth/auth-notice-box";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { getSignupEmailRedirectTo } from "@/lib/auth/redirects";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  return (
    <PublicAuthCenter>
      <AuthCard>
        <AuthPageHeader
          title="사장님 계정 만들기"
          description="전문적인 네일샵 관리를 위한 첫 걸음"
          titleClassName="text-[2.05rem]"
        />

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            if (!termsAccepted) {
              setError("약관에 동의해 주세요.");
              return;
            }

            if (password.length < 8) {
              setError("비밀번호는 8자 이상이어야 합니다.");
              return;
            }

            if (password !== confirmPassword) {
              setError("비밀번호가 일치하지 않습니다.");
              return;
            }

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

              const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo,
                  data: {
                    contact_name: contactName.trim(),
                    contact_phone: contactPhone.trim(),
                    terms_accepted_at: new Date().toISOString()
                  }
                }
              });

              if (signUpError) {
                setError(signUpError.message);
                return;
              }

              router.push(`/signup/check-email?email=${encodeURIComponent(email)}`);
            } finally {
              setPending(false);
            }
          }}
        >
          <IconInput
            autoComplete="email"
            icon={Mail}
            id="signup-email"
            inputMode="email"
            label="이메일"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@oneul.com"
            required
            value={email}
          />

          <div className="grid gap-3 min-[460px]:grid-cols-2">
            <IconInput
              autoComplete="new-password"
              icon={Lock}
              id="signup-password"
              label="비밀번호"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              required
              type="password"
              value={password}
            />

            <IconInput
              autoComplete="new-password"
              icon={RotateCw}
              id="signup-password-confirm"
              label="비밀번호 확인"
              minLength={8}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          <div className="grid gap-3 min-[460px]:grid-cols-2">
            <IconInput
              icon={User}
              id="signup-contact-name"
              label="담당자명"
              onChange={(e) => setContactName(e.target.value)}
              placeholder="홍길동"
              required
              value={contactName}
            />

            <IconInput
              icon={Phone}
              id="signup-contact-phone"
              label="연락처"
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
              value={contactPhone}
            />
          </div>

          <div className="space-y-3 pt-1">
            <label
              className="flex items-start gap-3 text-[1.07rem] leading-relaxed text-foreground/85"
              htmlFor="terms-accepted"
            >
              <input
                checked={termsAccepted}
                className="mt-1 h-5 w-5 rounded-md border border-border accent-primary"
                id="terms-accepted"
                onChange={(e) => setTermsAccepted(e.target.checked)}
                type="checkbox"
              />
              <span>
                <Link className="text-primary underline" href="/terms">
                  이용약관
                </Link>{" "}
                및{" "}
                <Link className="text-primary underline" href="/privacy">
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>

            {error ? (
              <AuthNoticeBox>{error}</AuthNoticeBox>
            ) : null}
          </div>

          <AuthPrimaryButton
            className="group relative text-[1.1rem] shadow-[0_10px_24px_rgba(233,89,73,0.38)]"
            disabled={pending}
            type="submit"
          >
            {pending ? "가입 중..." : "가입하고 사업자 인증하기"}
            <ArrowRight className="absolute right-6 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </AuthPrimaryButton>

          <section className="pt-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border/80" />
              <span className="inline-flex items-center gap-1 font-medium">
                <Info className="h-3.5 w-3.5" />
                안내사항
              </span>
              <span className="h-px flex-1 bg-border/80" />
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              가입 후 사업자 인증을 완료해야 운영센터 이용이 가능합니다.
            </p>
          </section>
        </form>
      </AuthCard>

      <AuthFooterLink
        prefixText="이미 계정이 있으신가요?"
        linkText="로그인하기"
        href="/login"
        className="text-lg"
      />
    </PublicAuthCenter>
  );
}
