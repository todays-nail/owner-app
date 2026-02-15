"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Create Owner Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Email/Password</p>

        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setPending(true);
            try {
              const supabase = createSupabaseBrowserClient();
              if (!supabase) {
                setError(
                  "Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
                );
                return;
              }

              const { error: signUpError } = await supabase.auth.signUp({
                email,
                password
              });

              if (signUpError) {
                setError(signUpError.message);
                return;
              }

              router.push("/");
              router.refresh();
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">Min 8 characters.</p>
          </div>

          {error ? (
            <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}

          <Button className="w-full" disabled={pending} type="submit">
            {pending ? "Creating..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline hover:text-foreground" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
