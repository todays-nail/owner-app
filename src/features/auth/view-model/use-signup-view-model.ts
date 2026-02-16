"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { signUpWithEmailPassword } from "@/features/auth/services/auth-browser-service";

export interface SignupViewModel {
  email: string;
  password: string;
  error: string | null;
  pending: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useSignupViewModel(): SignupViewModel {
  const router = useRouter();

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
        const result = await signUpWithEmailPassword(email, password);
        if (result.errorMessage) {
          setError(result.errorMessage);
          return;
        }

        router.push("/");
        router.refresh();
      } finally {
        setPending(false);
      }
    },
    [email, password, router]
  );

  return {
    email,
    password,
    error,
    pending,
    setEmail,
    setPassword,
    submit
  };
}
