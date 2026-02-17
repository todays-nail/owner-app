import {redirect} from "next/navigation";

import {createPageMetadata} from "@/lib/metadata";
import {getOwnerVerificationForCurrentUser} from "@/lib/owner/verification";

export const metadata = createPageMetadata({
  title: "사업자 인증",
  description: "사업자 인증 상태를 확인합니다."
});

export const dynamic = "force-dynamic";

export default async function VerificationGatePage() {
  const res = await getOwnerVerificationForCurrentUser();

  if (!res.ok) {
    if (res.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        인증 상태를 확인할 수 없습니다: {res.reason}
        {res.errorMessage ? ` (${res.errorMessage})` : null}
      </div>
    );
  }

  if (res.status === "APPROVED") {
    redirect("/dashboard");
  }

  if (res.status === "PENDING") {
    redirect("/verification/pending");
  }

  redirect("/verification/submit");
}
