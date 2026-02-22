import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export interface UpdateAccountSettingsInput {
  name: string;
  nickname: string;
  notifySystemNotice: boolean;
  notifySecurityNotice: boolean;
  notifyMarketing: boolean;
}

function formatSupabaseError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "알 수 없는 오류";
  }

  const obj = error as Record<string, unknown>;
  const parts: string[] = [];

  if (typeof obj.message === "string" && obj.message.trim().length > 0) {
    parts.push(obj.message.trim());
  }
  if (typeof obj.code === "string" && obj.code.trim().length > 0) {
    parts.push(`code=${obj.code.trim()}`);
  }
  if (typeof obj.details === "string" && obj.details.trim().length > 0) {
    parts.push(`details=${obj.details.trim()}`);
  }
  if (typeof obj.hint === "string" && obj.hint.trim().length > 0) {
    parts.push(`hint=${obj.hint.trim()}`);
  }
  if (typeof obj.status === "number" || typeof obj.status === "string") {
    parts.push(`status=${String(obj.status)}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "알 수 없는 오류";
}

function normalizeRequiredString(value: string, label: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${label}을(를) 입력해 주세요.`);
  }

  return trimmed;
}

export async function updateAccountSettingsForCurrentUser(
  input: UpdateAccountSettingsInput
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("환경변수가 설정되지 않았습니다. (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)");
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("로그인이 필요합니다. 다시 로그인해 주세요.");
  }

  const name = normalizeRequiredString(input.name, "이름");
  const nickname = normalizeRequiredString(input.nickname, "닉네임");

  const { error: upsertUserError } = await supabase.from("users").upsert(
    {
      id: user.id,
      nickname
    },
    { onConflict: "id" }
  );

  if (upsertUserError) {
    throw new Error(`프로필 저장에 실패했습니다. (${formatSupabaseError(upsertUserError)})`);
  }

  const { error: upsertOwnerError } = await supabase.from("owners").upsert(
    {
      id: user.id,
      manager_name: name
    },
    { onConflict: "id" }
  );

  if (upsertOwnerError) {
    throw new Error(`대표자 정보 저장에 실패했습니다. (${formatSupabaseError(upsertOwnerError)})`);
  }

  const { error: upsertNotificationError } = await supabase.from("owner_account_settings").upsert(
    {
      user_id: user.id,
      notify_system_notice: input.notifySystemNotice,
      notify_security_notice: input.notifySecurityNotice,
      notify_marketing: input.notifyMarketing
    },
    { onConflict: "user_id" }
  );

  if (upsertNotificationError) {
    throw new Error(`알림 설정 저장에 실패했습니다. (${formatSupabaseError(upsertNotificationError)})`);
  }
}

export async function updateCurrentUserPassword(password: string): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("환경변수가 설정되지 않았습니다. (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)");
  }

  const normalizedPassword = password.trim();
  if (normalizedPassword.length < 8) {
    throw new Error("새 비밀번호는 8자 이상이어야 합니다.");
  }

  const { error } = await supabase.auth.updateUser({
    password: normalizedPassword
  });

  if (error) {
    throw new Error(`비밀번호 변경에 실패했습니다. (${formatSupabaseError(error)})`);
  }
}
