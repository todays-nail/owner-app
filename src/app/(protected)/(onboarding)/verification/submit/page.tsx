import {redirect} from "next/navigation";

import {OwnerVerificationSubmitForm} from "@/features/owner-verification/submit-form";
import {createPageMetadata} from "@/lib/metadata";
import {getOwnerVerificationForCurrentUser} from "@/lib/owner/verification";

export const metadata = createPageMetadata({
  title: "사업자 정보 인증",
  description: "필수 항목을 입력하고 사업자등록증을 업로드해 주세요."
});

export const dynamic = "force-dynamic";

export default async function OwnerVerificationSubmitPage() {
  const res = await getOwnerVerificationForCurrentUser();

  if (!res.ok) {
    if (res.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        인증 상태를 불러오지 못했습니다: {res.reason}
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
        shop_address1: res.row?.shop_address1 ?? "",
        shop_address2: res.row?.shop_address2 ?? "",
        shop_postcode: res.row?.shop_postcode ?? "",
        shop_photo_path: res.row?.shop_photo_path ?? null,
        rejected_reason: res.row?.rejected_reason ?? null
      }}
    />
  );
}
