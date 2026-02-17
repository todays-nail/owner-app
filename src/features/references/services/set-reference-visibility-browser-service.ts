import {createSupabaseBrowserClient} from "@/lib/supabase/browser";

interface ShopMembershipRow {
  shop_id: string;
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

  return parts.length > 0 ? parts.join(" | ") : "알 수 없는 오류";
}

export async function setReferenceVisibilityForCurrentUser(
  referenceId: string,
  nextVisible: boolean
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("로그인이 필요합니다. 다시 로그인해 주세요.");
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id);

  if (membershipError) {
    throw new Error(formatSupabaseError(membershipError));
  }

  const membershipRows = (memberships ?? []) as ShopMembershipRow[];
  if (membershipRows.length === 0) {
    throw new Error("계정에 연결된 매장이 없습니다. 관리자에게 문의해 주세요.");
  }

  if (membershipRows.length > 1) {
    throw new Error("계정에 복수 매장이 연결되어 있습니다. 관리자에게 문의해 주세요.");
  }

  const shopId = membershipRows[0]?.shop_id;
  if (!shopId) {
    throw new Error("매장 정보를 확인할 수 없습니다.");
  }

  try {
    const { error: updateError } = await supabase
      .from("references")
      .update({
        is_active: nextVisible,
        updated_at: new Date().toISOString()
      })
      .eq("id", referenceId)
      .eq("shop_id", shopId);

    if (updateError) {
      throw new Error(formatSupabaseError(updateError));
    }
  } catch (error) {
    console.error("[references:visibility] failed", { referenceId, nextVisible, error });
    throw error instanceof Error ? error : new Error("노출 상태 변경에 실패했습니다.");
  }
}
