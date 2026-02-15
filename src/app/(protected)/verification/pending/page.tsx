import Link from "next/link";
import { redirect } from "next/navigation";

import { getOwnerVerificationForCurrentUser } from "@/lib/owner/verification";

export const dynamic = "force-dynamic";

export default async function OwnerVerificationPendingPage() {
  const res = await getOwnerVerificationForCurrentUser();

  if (!res.ok) {
    if (res.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        Failed to load verification status: {res.reason}
        {res.errorMessage ? ` (${res.errorMessage})` : null}
      </div>
    );
  }

  if (res.status === "APPROVED") {
    redirect("/");
  }

  if (res.status !== "PENDING") {
    redirect("/verification/submit");
  }

  const submittedAt = res.row?.submitted_at ? new Date(res.row.submitted_at) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Verification pending</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your business verification is under review. You will be able to access owner
          features after approval.
        </p>

        <div className="mt-6 space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Status:</span> PENDING
          </div>
          {submittedAt ? (
            <div>
              <span className="text-muted-foreground">Submitted:</span>{" "}
              {submittedAt.toLocaleString()}
            </div>
          ) : null}
        </div>

        <div className="mt-6 text-sm">
          Need to update your submission?{" "}
          <Link className="underline hover:text-foreground" href="/verification/submit">
            Resubmit
          </Link>
        </div>
      </div>
    </div>
  );
}

