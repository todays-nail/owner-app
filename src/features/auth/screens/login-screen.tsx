"use client";

import { LoginFormView } from "@/features/auth/ui/login-form-view";
import { useLoginViewModel } from "@/features/auth/view-model/use-login-view-model";

export function LoginScreen() {
  const vm = useLoginViewModel();

  return (
    <LoginFormView
      email={vm.email}
      password={vm.password}
      error={vm.error}
      pending={vm.pending}
      onEmailChange={vm.setEmail}
      onPasswordChange={vm.setPassword}
      onSubmit={vm.submit}
    />
  );
}
