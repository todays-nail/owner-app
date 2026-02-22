import type { AccountSettingsDto } from "@/features/settings/model/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface UserRow {
  nickname: string | null;
  profile_image_url: string | null;
}

interface OwnerRow {
  manager_name: string | null;
}

interface OwnerAccountSettingsRow {
  notify_system_notice: boolean | null;
  notify_security_notice: boolean | null;
  notify_marketing: boolean | null;
}

export type GetAccountSettingsResult =
  | { ok: true; data: AccountSettingsDto }
  | {
      ok: false;
      reason: "ENV_MISSING" | "NOT_AUTHENTICATED" | "QUERY_FAILED";
      errorMessage?: string;
    };

function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

export async function getAccountSettingsForCurrentUser(): Promise<GetAccountSettingsResult> {
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

  const userId = user.id;

  const [
    { data: userRow, error: userRowError },
    { data: ownerRow, error: ownerRowError },
    { data: ownerAccountSettingsRow, error: ownerAccountSettingsError }
  ] = await Promise.all([
    supabase
      .from("users")
      .select("nickname,profile_image_url")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("owners").select("manager_name").eq("id", userId).maybeSingle(),
    supabase
      .from("owner_account_settings")
      .select("notify_system_notice,notify_security_notice,notify_marketing")
      .eq("user_id", userId)
      .maybeSingle()
  ]);

  if (userRowError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: userRowError.message };
  }

  if (ownerRowError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: ownerRowError.message };
  }

  if (ownerAccountSettingsError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: ownerAccountSettingsError.message };
  }

  const userData = (userRow as UserRow | null) ?? null;
  const ownerData = (ownerRow as OwnerRow | null) ?? null;
  const ownerAccountSettingsData =
    (ownerAccountSettingsRow as OwnerAccountSettingsRow | null) ?? null;

  return {
    ok: true,
    data: {
      name: readString(ownerData?.manager_name) ?? readString(userData?.nickname) ?? "사장님",
      nickname: readString(userData?.nickname) ?? "",
      email: readString(user.email) ?? "",
      profileImageUrl: readString(userData?.profile_image_url),
      notifySystemNotice: parseBoolean(ownerAccountSettingsData?.notify_system_notice, true),
      notifySecurityNotice: parseBoolean(ownerAccountSettingsData?.notify_security_notice, true),
      notifyMarketing: parseBoolean(ownerAccountSettingsData?.notify_marketing, false)
    }
  };
}
