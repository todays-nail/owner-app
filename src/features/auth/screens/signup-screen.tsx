"use client";

import { SignupFormView } from "@/features/auth/ui/signup-form-view";
import { useSignupViewModel } from "@/features/auth/view-model/use-signup-view-model";

export function SignupScreen() {
  const vm = useSignupViewModel();

  return (
    <SignupFormView
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
