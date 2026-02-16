"use client";

import { Lock, RotateCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { IconInput } from "@/components/auth/icon-input";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { OneulNailLogo } from "@/components/brand/oneulnail-logo";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [hasSession, setHasSession] = React.useState<boolean | null>(null);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setHasSession(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!cancelled) setHasSession(Boolean(data.session));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PublicAuthCenter>
      <AuthCard>
        <div className="text-center">
          <OneulNailLogo className="mx-auto" />
          <h1 className="mt-7 text-[1.95rem] font-semibold leading-tight text-foreground">
            새 비밀번호 설정
          </h1>
          <p className="mt-2 text-base text-muted-foreground">새 비밀번호를 입력해 주세요.</p>
        </div>

        {hasSession === false ? (
          <div className="mt-6 rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90">
            링크가 만료되었거나 세션이 없습니다. {" "}
            <Link className="font-semibold text-primary hover:underline" href="/forgot-password">
              재설정 메일을 다시 요청
            </Link>
            해주세요.
          </div>
        ) : null}

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setMessage(null);

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
                setError("Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
                return;
              }

              const { data } = await supabase.auth.getSession();
              if (!data.session) {
                setError("세션이 없습니다. 링크를 다시 요청해 주세요.");
                return;
              }

              const { error: updateError } = await supabase.auth.updateUser({
                password
              });

              if (updateError) {
                setError(updateError.message);
                return;
              }

              setMessage("비밀번호가 변경되었습니다. 잠시 후 이동합니다.");
              router.refresh();
              router.push("/");
            } finally {
              setPending(false);
            }
          }}
        >
          <IconInput
            autoComplete="new-password"
            icon={Lock}
            id="new-password"
            label="새 비밀번호"
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
            id="new-password-confirm"
            label="새 비밀번호 확인"
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재입력"
            required
            type="password"
            value={confirmPassword}
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
            disabled={pending || hasSession === false}
            type="submit"
          >
            {pending ? "변경 중..." : "비밀번호 변경"}
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
