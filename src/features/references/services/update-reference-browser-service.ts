import type {ReferenceBadge} from "@/features/references/model/references";
import type {ReferenceEditorFormValues} from "@/features/references/ui/reference-editor-form";
import {createSupabaseBrowserClient} from "@/lib/supabase/browser";

const REFERENCE_IMAGE_BUCKET = "reference-images";

interface ShopMembershipRow {
  shop_id: string;
}

interface ExistingImageRow {
  image_url: string;
}

interface ExistingTagRow {
  tag_id: string;
}

interface StyleTagRow {
  id: string;
  name: string;
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

export async function updateReferenceForCurrentUser(
  referenceId: string,
  values: ReferenceEditorFormValues
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

  if (!referenceId) {
    throw new Error("수정할 레퍼런스 ID가 필요합니다.");
  }

  if (!values.name.trim()) {
    throw new Error("디자인 이름을 입력해 주세요.");
  }

  if (!Number.isFinite(values.price) || values.price <= 0) {
    throw new Error("기본 가격을 올바르게 입력해 주세요.");
  }

  if (
    !Number.isFinite(values.finalPrice) ||
    values.finalPrice < 0 ||
    values.finalPrice > values.price
  ) {
    throw new Error("최종 노출 가격을 올바르게 입력해 주세요.");
  }

  if (!Array.isArray(values.imageUrls) || values.imageUrls.length === 0) {
    throw new Error("대표 이미지를 업로드해 주세요.");
  }

  const categoryNames = [...new Set(values.categories)];
  if (categoryNames.length === 0) {
    throw new Error("최소 1개의 스타일 태그를 선택해 주세요.");
  }

  const { data: existingReference, error: existingReferenceError } = await supabase
    .from("references")
    .select("id,shop_id")
    .eq("id", referenceId)
    .eq("shop_id", shopId)
    .maybeSingle();

  if (existingReferenceError) {
    throw new Error(formatSupabaseError(existingReferenceError));
  }

  if (!existingReference) {
    throw new Error("수정할 레퍼런스를 찾지 못했습니다.");
  }

  const { data: existingImageRows, error: existingImagesError } = await supabase
    .from("reference_images")
    .select("image_url")
    .eq("reference_id", referenceId);

  if (existingImagesError) {
    throw new Error(formatSupabaseError(existingImagesError));
  }

  const existingImageUrls = ((existingImageRows ?? []) as ExistingImageRow[])
    .map((row) => row.image_url)
    .filter((url): url is string => typeof url === "string" && url.length > 0);

  const { data: existingTagRows, error: existingTagsError } = await supabase
    .from("reference_style_tags")
    .select("tag_id")
    .eq("reference_id", referenceId);

  if (existingTagsError) {
    throw new Error(formatSupabaseError(existingTagsError));
  }

  const existingTagIds = new Set(
    ((existingTagRows ?? []) as ExistingTagRow[])
      .map((row) => row.tag_id)
      .filter((id): id is string => typeof id === "string" && id.length > 0)
  );

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

  const nextTagIds = new Set(
    categoryNames.map((name) => styleTagByName.get(name)).filter((id): id is string => !!id)
  );

  const uploadedPaths: string[] = [];
  const finalImageUrls: string[] = [];

  try {
    for (let index = 0; index < values.imageUrls.length; index += 1) {
      const raw = values.imageUrls[index];
      const imageUrl = typeof raw === "string" ? raw.trim() : "";

      if (!imageUrl) {
        continue;
      }

      if (imageUrl.startsWith("data:")) {
        const { mimeType, buffer } = parseDataUrl(imageUrl);
        const extension = guessExtension(mimeType);
        const fileName = `${index + 1}-${crypto.randomUUID()}.${extension}`;
        const path = `shops/${shopId}/references/${referenceId}/${fileName}`;

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

        finalImageUrls.push(publicUrl);
        continue;
      }

      finalImageUrls.push(imageUrl);
    }

    if (finalImageUrls.length === 0) {
      throw new Error("대표 이미지를 업로드해 주세요.");
    }

    const serviceDuration =
      typeof values.durationMinutes === "number" && Number.isFinite(values.durationMinutes)
        ? values.durationMinutes
        : 60;

    const now = new Date().toISOString();
    const { error: updateReferenceError } = await supabase
      .from("references")
      .update({
        title: values.name.trim(),
        description: values.description?.trim() ?? "",
        base_price: values.price,
        final_price: values.finalPrice,
        discounted_price: values.finalPrice,
        service_duration_min: serviceDuration,
        is_active: values.isVisible,
        is_reservable: values.isReservable,
        badge: normalizeBadge(values.badge),
        updated_at: now
      })
      .eq("id", referenceId)
      .eq("shop_id", shopId);

    if (updateReferenceError) {
      throw new Error(formatSupabaseError(updateReferenceError));
    }

    const { error: deleteImagesError } = await supabase
      .from("reference_images")
      .delete()
      .eq("reference_id", referenceId);

    if (deleteImagesError) {
      throw new Error(formatSupabaseError(deleteImagesError));
    }

    const nextImageRows = finalImageUrls.map((imageUrl, index) => ({
      reference_id: referenceId,
      image_url: imageUrl,
      is_primary: index === 0,
      sort_order: index
    }));

    const { error: insertImagesError } = await supabase.from("reference_images").insert(nextImageRows);
    if (insertImagesError) {
      throw new Error(formatSupabaseError(insertImagesError));
    }

    const insertTagIds = [...nextTagIds].filter((tagId) => !existingTagIds.has(tagId));
    const deleteTagIds = [...existingTagIds].filter((tagId) => !nextTagIds.has(tagId));

    if (insertTagIds.length > 0) {
      const { error: insertTagsError } = await supabase.from("reference_style_tags").insert(
        insertTagIds.map((tagId) => ({
          reference_id: referenceId,
          tag_id: tagId
        }))
      );

      if (insertTagsError) {
        throw new Error(formatSupabaseError(insertTagsError));
      }
    }

    if (deleteTagIds.length > 0) {
      const { error: deleteTagsError } = await supabase
        .from("reference_style_tags")
        .delete()
        .eq("reference_id", referenceId)
        .in("tag_id", deleteTagIds);

      if (deleteTagsError) {
        throw new Error(formatSupabaseError(deleteTagsError));
      }
    }

    const removedImagePaths = existingImageUrls
      .filter((url) => !finalImageUrls.includes(url))
      .map((url) => extractStoragePathFromPublicUrl(url))
      .filter((path): path is string => !!path);

    if (removedImagePaths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(REFERENCE_IMAGE_BUCKET)
        .remove(removedImagePaths);

      if (removeError) {
        console.error("[references:update] remove stale images failed", {
          referenceId,
          removedImagePaths,
          error: removeError
        });
      }
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(REFERENCE_IMAGE_BUCKET).remove(uploadedPaths);
    }

    console.error("[references:update] failed", {
      referenceId,
      error,
      inputSummary: {
        name: values.name,
        price: values.price,
        imageCount: values.imageUrls.length,
        categoryCount: values.categories.length,
        isVisible: values.isVisible,
        isReservable: values.isReservable
      }
    });

    throw error instanceof Error ? error : new Error("레퍼런스 수정에 실패했습니다.");
  }
}
