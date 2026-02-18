import type {DesignReference, ReferenceBadge} from "@/features/references/model/references";
import {createSupabaseBrowserClient} from "@/lib/supabase/browser";

const REFERENCE_IMAGE_BUCKET = "reference-images";

interface ShopMembershipRow {
  shop_id: string;
}

interface StyleTagRow {
  id: string;
  name: string;
}

export type CreateReferenceInput = Omit<DesignReference, "id">;

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
  if (typeof obj.statusCode === "string" || typeof obj.statusCode === "number") {
    parts.push(`status=${String(obj.statusCode)}`);
  }
  if (typeof obj.error === "string" && obj.error.trim().length > 0) {
    parts.push(`error=${obj.error.trim()}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "알 수 없는 오류";
}

function normalizeBadge(value: unknown): ReferenceBadge {
  return value === "NEW" || value === "인기" ? value : null;
}

function parseDataUrl(value: string): { mimeType: string; buffer: ArrayBuffer } {
  const match = /^data:([^;]+);base64,(.+)$/.exec(value);
  if (!match) {
    throw new Error("지원하지 않는 이미지 형식입니다. 파일 업로드로 다시 시도해주세요.");
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2];
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i += 1) {
    view[i] = binary.charCodeAt(i);
  }

  return { mimeType, buffer };
}

function guessExtension(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}

export async function createReferenceForCurrentUser(input: CreateReferenceInput): Promise<void> {
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

  if (!input.name.trim()) {
    throw new Error("디자인 이름을 입력해 주세요.");
  }

  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new Error("기본 가격을 올바르게 입력해 주세요.");
  }

  if (
    !Number.isFinite(input.finalPrice) ||
    input.finalPrice < 0 ||
    input.finalPrice > input.price
  ) {
    throw new Error("최종 노출 가격을 올바르게 입력해 주세요.");
  }

  if (!Array.isArray(input.imageUrls) || input.imageUrls.length === 0) {
    throw new Error("대표 이미지를 업로드해 주세요.");
  }

  const referenceId = crypto.randomUUID();
  const uploadedPaths: string[] = [];

  const rollbackReference = async () => {
    await supabase.from("reference_style_tags").delete().eq("reference_id", referenceId);
    await supabase.from("reference_images").delete().eq("reference_id", referenceId);
    await supabase.from("references").delete().eq("id", referenceId);

    if (uploadedPaths.length > 0) {
      await supabase.storage.from(REFERENCE_IMAGE_BUCKET).remove(uploadedPaths);
    }
  };

  try {
    const now = new Date().toISOString();

    const serviceDuration =
      typeof input.durationMinutes === "number" && Number.isFinite(input.durationMinutes)
        ? input.durationMinutes
        : 60;

    const { error: insertReferenceError } = await supabase.from("references").insert({
      id: referenceId,
      shop_id: shopId,
      title: input.name.trim(),
      description: input.description?.trim() ?? "",
      base_price: input.price,
      final_price: input.finalPrice,
      discounted_price: input.finalPrice,
      service_duration_min: serviceDuration,
      is_active: input.isVisible,
      is_reservable: input.isReservable,
      badge: normalizeBadge(input.badge),
      created_at: now,
      updated_at: now
    });

    if (insertReferenceError) {
      throw new Error(formatSupabaseError(insertReferenceError));
    }

    const uploadedPublicUrls: string[] = [];

    for (let index = 0; index < input.imageUrls.length; index += 1) {
      const imageDataUrl = input.imageUrls[index];
      const { mimeType, buffer } = parseDataUrl(imageDataUrl);
      const extension = guessExtension(mimeType);
      const path = `shops/${shopId}/references/${referenceId}/${index + 1}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(REFERENCE_IMAGE_BUCKET)
        .upload(path, new Blob([buffer], { type: mimeType }), {
          contentType: mimeType,
          upsert: false
        });

      if (uploadError) {
        throw new Error(formatSupabaseError(uploadError));
      }

      uploadedPaths.push(path);

      const {
        data: { publicUrl }
      } = supabase.storage.from(REFERENCE_IMAGE_BUCKET).getPublicUrl(path);

      if (!publicUrl) {
        throw new Error("이미지 URL을 생성하지 못했습니다.");
      }

      uploadedPublicUrls.push(publicUrl);
    }

    const imageRows = uploadedPublicUrls.map((imageUrl, index) => ({
      id: crypto.randomUUID(),
      reference_id: referenceId,
      image_url: imageUrl,
      is_primary: index === 0,
      sort_order: index
    }));

    const { error: insertImagesError } = await supabase.from("reference_images").insert(imageRows);
    if (insertImagesError) {
      throw new Error(formatSupabaseError(insertImagesError));
    }

    const categoryNames = [...new Set(input.categories)];

    if (categoryNames.length > 0) {
      const { data: styleTags, error: styleTagsError } = await supabase
        .from("style_tags")
        .select("id,name")
        .eq("is_active", true)
        .in("name", categoryNames);

      if (styleTagsError) {
        throw new Error(formatSupabaseError(styleTagsError));
      }

      const styleTagRows = (styleTags ?? []) as StyleTagRow[];
      const styleTagByName = new Map(styleTagRows.map((row) => [row.name, row.id]));
      const missingNames = categoryNames.filter((name) => !styleTagByName.has(name));

      if (missingNames.length > 0) {
        throw new Error(`일부 스타일 태그를 찾지 못했습니다: ${missingNames.join(", ")}`);
      }

      const tagRows = categoryNames.map((name) => ({
        reference_id: referenceId,
        tag_id: styleTagByName.get(name) as string
      }));

      const { error: insertTagsError } = await supabase.from("reference_style_tags").insert(tagRows);
      if (insertTagsError) {
        throw new Error(formatSupabaseError(insertTagsError));
      }
    }
  } catch (error) {
    console.error("[references:create] service failed", { error });
    await rollbackReference();
    throw error instanceof Error ? error : new Error("디자인 등록에 실패했습니다.");
  }
}
