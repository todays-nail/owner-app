"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { OneulNailLogo } from "@/components/brand/oneulnail-logo";
import { Button } from "@/components/ui/button";
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
        <div className="text-center">
          <OneulNailLogo className="mx-auto" />
          <h1 className="mt-7 text-[1.95rem] font-semibold leading-tight text-foreground">
            이메일을 확인해 주세요
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            인증 메일을 보냈습니다. 메일 인증 후 사업자 인증을 진행할 수 있어요.
          </p>
        </div>

        {email ? (
          <div className="mt-6 rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90">
            {email}
          </div>
        ) : null}

        {error ? (
          <div className="mt-3 rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-3 rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90">
            {message}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <Button
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#f26f59] to-[#ea5a47] text-base font-semibold text-white shadow-[0_10px_24px_rgba(233,89,73,0.35)] hover:opacity-100 hover:brightness-105"
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
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link className="font-semibold text-primary hover:underline" href="/login">
              로그인으로 이동
            </Link>
          </p>
        </div>
      </AuthCard>
    </PublicAuthCenter>
  );
}
