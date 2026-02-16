import { SignOutButton } from "@/features/auth/sign-out-button";

export const dynamic = "force-dynamic";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="text-sm font-semibold">Owner</div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-6xl items-center px-4 py-10">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
