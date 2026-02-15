import { redirect } from "next/navigation";

import { OwnerVerificationSubmitForm } from "@/features/owner-verification/submit-form";
import { getOwnerVerificationForCurrentUser } from "@/lib/owner/verification";

export const dynamic = "force-dynamic";

export default async function OwnerVerificationSubmitPage() {
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

  if (res.status === "PENDING") {
    redirect("/verification/pending");
  }

  return (
    <OwnerVerificationSubmitForm
      initial={{
        status: res.status,
        business_number: res.row?.business_number ?? "",
        shop_name: res.row?.shop_name ?? "",
        owner_name: res.row?.owner_name ?? "",
        contact_phone: res.row?.contact_phone ?? "",
        rejected_reason: res.row?.rejected_reason ?? null
      }}
    />
  );
}

