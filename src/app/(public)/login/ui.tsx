"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [resendPending, setResendPending] = React.useState(false);
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Owner Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with Supabase Email/Password.
        </p>

        <form
          className="mt-6 space-y-3"
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

              const { error: signInError } = await supabase.auth.signInWithPassword(
                {
                  email,
                  password
                }
              );

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
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}

          {needsEmailConfirm ? (
            <div className="space-y-2">
              <Button
                className="w-full"
                disabled={resendPending || !email}
                type="button"
                variant="outline"
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

                    let emailRedirectTo: string | undefined;
                    try {
                      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
                      if (siteUrl) {
                        emailRedirectTo = new URL("/login", siteUrl).toString();
                      } else if (typeof window !== "undefined") {
                        emailRedirectTo = `${window.location.origin}/login`;
                      }
                    } catch {
                      if (typeof window !== "undefined") {
                        emailRedirectTo = `${window.location.origin}/login`;
                      }
                    }

                    const { error: resendError } = await supabase.auth.resend({
                      type: "signup",
                      email,
                      options: emailRedirectTo ? { emailRedirectTo } : undefined
                    });

                    if (resendError) {
                      setError(resendError.message);
                      return;
                    }

                    setResendMessage("Confirmation email resent.");
                  } finally {
                    setResendPending(false);
                  }
                }}
              >
                {resendPending ? "Sending..." : "Resend confirmation email"}
              </Button>

              {resendMessage ? (
                <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                  {resendMessage}
                </div>
              ) : null}
            </div>
          ) : null}

          <Button className="w-full" disabled={pending} type="submit">
            {pending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link className="underline hover:text-foreground" href="/signup">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
