import { redirect } from "next/navigation";

import { getOwnerVerificationForCurrentUser } from "@/lib/owner/verification";

export const dynamic = "force-dynamic";

export default async function VerifiedLayout({ children }: { children: React.ReactNode }) {
  const res = await getOwnerVerificationForCurrentUser();

  if (!res.ok) {
    if (res.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        Verification check unavailable: {res.reason}
        {res.errorMessage ? ` (${res.errorMessage})` : null}
      </div>
    );
  }

  if (res.status !== "APPROVED") {
    redirect("/verification");
  }

  return children;
}
