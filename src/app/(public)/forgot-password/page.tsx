"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { IconInput } from "@/components/auth/icon-input";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { OneulNailLogo } from "@/components/brand/oneulnail-logo";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <PublicAuthCenter>
      <AuthCard>
        <div className="text-center">
          <OneulNailLogo className="mx-auto" />
          <h1 className="mt-7 text-[1.95rem] font-semibold leading-tight text-foreground">
            비밀번호 재설정
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요.
          </p>
        </div>

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
            <div className="rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90">
              {message}
            </div>
          ) : null}

          <Button
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#f26f59] to-[#ea5a47] text-base font-semibold text-white shadow-[0_10px_24px_rgba(233,89,73,0.35)] hover:opacity-100 hover:brightness-105"
            disabled={pending}
            type="submit"
          >
            {pending ? "보내는 중..." : "재설정 링크 보내기"}
          </Button>
        </form>
      </AuthCard>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        <Link className="font-semibold text-primary hover:underline" href="/login">
          로그인으로 돌아가기
        </Link>
      </p>
    </PublicAuthCenter>
  );
}
