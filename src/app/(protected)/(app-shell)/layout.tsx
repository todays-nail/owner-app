import { AppShell } from "@/components/shell/app-shell";
import { SignOutButton } from "@/features/auth/sign-out-button";

export const dynamic = "force-dynamic";

export default function AppShellLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShell headerRight={<SignOutButton />}>{children}</AppShell>;
}
