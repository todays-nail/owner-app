"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignupCheckEmail() {
  const sp = useSearchParams();
  const email = sp.get("email") || "";

  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a confirmation email. After confirming, you can sign in.
        </p>

        {email ? (
          <div className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm">
            {email}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm">
            {message}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <Button
            className="w-full"
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

                setMessage("Confirmation email resent.");
              } finally {
                setPending(false);
              }
            }}
            type="button"
          >
            {pending ? "Sending..." : "Resend confirmation email"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link className="underline hover:text-foreground" href="/login">
              Go to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

