import {createSupabaseBrowserClient} from "@/lib/supabase/browser";

const REFERENCE_IMAGE_BUCKET = "reference-images";

interface ShopMembershipRow {
  shop_id: string;
}

interface ExistingImageRow {
  image_url: string;
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

function extractStoragePathFromPublicUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const prefix = `/storage/v1/object/public/${REFERENCE_IMAGE_BUCKET}/`;
    if (!parsed.pathname.startsWith(prefix)) {
      return null;
    }

    const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
    return path.length > 0 ? path : null;
  } catch {
    return null;
  }
}

export async function deleteReferenceForCurrentUser(referenceId: string): Promise<void> {
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

  if (!referenceId) {
    throw new Error("삭제할 레퍼런스 ID가 필요합니다.");
  }

  const { data: targetReference, error: targetReferenceError } = await supabase
    .from("references")
    .select("id")
    .eq("id", referenceId)
    .eq("shop_id", shopId)
    .maybeSingle();

  if (targetReferenceError) {
    throw new Error(formatSupabaseError(targetReferenceError));
  }

  if (!targetReference) {
    throw new Error("삭제할 레퍼런스를 찾지 못했습니다.");
  }

  const { data: existingImageRows, error: existingImagesError } = await supabase
    .from("reference_images")
    .select("image_url")
    .eq("reference_id", referenceId);

  if (existingImagesError) {
    throw new Error(formatSupabaseError(existingImagesError));
  }

  const imagePathsToRemove = ((existingImageRows ?? []) as ExistingImageRow[])
    .map((row) => row.image_url)
    .filter((url): url is string => typeof url === "string" && url.length > 0)
    .map((url) => extractStoragePathFromPublicUrl(url))
    .filter((path): path is string => !!path);

  try {
    const { error: deleteImagesError } = await supabase
      .from("reference_images")
      .delete()
      .eq("reference_id", referenceId);

    if (deleteImagesError) {
      throw new Error(formatSupabaseError(deleteImagesError));
    }

    const { error: deleteTagsError } = await supabase
      .from("reference_style_tags")
      .delete()
      .eq("reference_id", referenceId);

    if (deleteTagsError) {
      throw new Error(formatSupabaseError(deleteTagsError));
    }

    const { error: deleteReferenceError } = await supabase
      .from("references")
      .delete()
      .eq("id", referenceId)
      .eq("shop_id", shopId);

    if (deleteReferenceError) {
      throw new Error(formatSupabaseError(deleteReferenceError));
    }

    if (imagePathsToRemove.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(REFERENCE_IMAGE_BUCKET)
        .remove(imagePathsToRemove);

      if (removeError) {
        console.error("[references:delete] remove storage failed", {
          referenceId,
          imagePathsToRemove,
          error: removeError
        });
      }
    }
  } catch (error) {
    console.error("[references:delete] failed", { referenceId, error });
    throw error instanceof Error ? error : new Error("레퍼런스 삭제에 실패했습니다.");
  }
}
