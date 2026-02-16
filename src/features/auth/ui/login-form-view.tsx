"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LoginFormViewProps {
  email: string;
  password: string;
  error: string | null;
  pending: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function LoginFormView({
  email,
  password,
  error,
  pending,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: LoginFormViewProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Owner Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with Supabase Email/Password.
        </p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
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
              onChange={(event) => onPasswordChange(event.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
              {error}
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
