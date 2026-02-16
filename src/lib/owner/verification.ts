import {
  OWNER_VERIFICATION_STATUSES,
  type OwnerVerificationRow,
  type OwnerVerificationStatus
} from "@/lib/owner/verification-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OwnerVerificationResult =
  | { ok: true; status: OwnerVerificationStatus; row: OwnerVerificationRow | null }
  | {
      ok: false;
      reason: "ENV_MISSING" | "NOT_AUTHENTICATED" | "QUERY_FAILED";
      errorMessage?: string;
    };

function normalizeStatus(value: unknown): OwnerVerificationStatus {
  if (typeof value !== "string") return "UNSUBMITTED";
  if ((OWNER_VERIFICATION_STATUSES as readonly string[]).includes(value)) {
    return value as OwnerVerificationStatus;
  }
  return "UNSUBMITTED";
}

export async function getOwnerVerificationForCurrentUser(): Promise<OwnerVerificationResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, reason: "ENV_MISSING" };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, reason: "NOT_AUTHENTICATED" };
  }

  const { data, error } = await supabase
    .from("owner_verifications")
    .select(
      "user_id,status,business_number,shop_name,owner_name,contact_phone,shop_address1,shop_address2,shop_postcode,shop_photo_path,business_license_path,rejected_reason,submitted_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: error.message };
  }

  if (!data) {
    return { ok: true, status: "UNSUBMITTED", row: null };
  }

  const row = data as OwnerVerificationRow;
  const status = normalizeStatus((data as { status?: unknown }).status);
  return { ok: true, status, row: { ...row, status } };
}
