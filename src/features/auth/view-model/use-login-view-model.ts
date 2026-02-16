"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { signInWithEmailPassword } from "@/features/auth/services/auth-browser-service";

export interface LoginViewModel {
  email: string;
  password: string;
  error: string | null;
  pending: boolean;
  nextPath: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useLoginViewModel(): LoginViewModel {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = sp.get("next") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const submit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setPending(true);

      try {
        const result = await signInWithEmailPassword(email, password);
        if (result.errorMessage) {
          setError(result.errorMessage);
          return;
        }

        router.refresh();
        router.push(nextPath);
      } finally {
        setPending(false);
      }
    },
    [email, password, router, nextPath]
  );

  return {
    email,
    password,
    error,
    pending,
    nextPath,
    setEmail,
    setPassword,
    submit
  };
}
