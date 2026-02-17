import {
  type DesignReference,
  REFERENCE_CATEGORIES,
  type ReferenceBadge,
  type ReferenceCategory
} from "@/features/references/model/references";
import {createSupabaseServerClient} from "@/lib/supabase/server";

interface ShopMembershipRow {
  shop_id: string;
}

interface RawReferenceImage {
  image_url: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
}

interface RawStyleTag {
  name: string | null;
}

interface RawReferenceStyleTag {
  style_tags: RawStyleTag | RawStyleTag[] | null;
}

interface RawReferenceLikeAggregate {
  count: number | string | null;
}

interface RawReferenceRow {
  id: string;
  title: string | null;
  description: string | null;
  base_price: number | null;
  created_at: string | null;
  service_duration_min: number | null;
  is_active: boolean | null;
  badge: string | null;
  reference_images: RawReferenceImage[] | null;
  reference_style_tags: RawReferenceStyleTag[] | null;
  reference_likes: RawReferenceLikeAggregate[] | RawReferenceLikeAggregate | null;
}

const REFERENCE_CATEGORY_SET = new Set<ReferenceCategory>(REFERENCE_CATEGORIES);

function parseBadge(value: unknown): ReferenceBadge {
  return value === "NEW" || value === "인기" ? value : null;
}

function readNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseImageUrls(images: RawReferenceImage[] | null): string[] {
  if (!images || images.length === 0) {
    return [];
  }

  return images
    .map((item) => ({
      image_url: readNonEmptyString(item.image_url),
      is_primary: item.is_primary === true,
      sort_order: typeof item.sort_order === "number" ? item.sort_order : Number.MAX_SAFE_INTEGER
    }))
    .filter((item): item is { image_url: string; is_primary: boolean; sort_order: number } =>
      item.image_url !== null
    )
    .sort((a, b) => {
      const primaryOrder = Number(b.is_primary) - Number(a.is_primary);
      if (primaryOrder !== 0) return primaryOrder;
      return a.sort_order - b.sort_order;
    })
    .map((item) => item.image_url);
}

function parseCategories(tags: RawReferenceStyleTag[] | null): ReferenceCategory[] {
  if (!tags || tags.length === 0) {
    return [];
  }

  const next: ReferenceCategory[] = [];
  const seen = new Set<ReferenceCategory>();

  for (const tagRow of tags) {
    const styleTag = tagRow.style_tags;
    const names = Array.isArray(styleTag)
      ? styleTag.map((item) => item?.name)
      : [styleTag?.name ?? null];

    for (const rawName of names) {
      if (typeof rawName !== "string") continue;
      if (!REFERENCE_CATEGORY_SET.has(rawName as ReferenceCategory)) continue;

      const category = rawName as ReferenceCategory;
      if (seen.has(category)) continue;

      seen.add(category);
      next.push(category);
    }
  }

  return next;
}

function parseLikeCount(
  rawLikes: RawReferenceLikeAggregate[] | RawReferenceLikeAggregate | null
): number {
  const maybeCount = Array.isArray(rawLikes) ? rawLikes[0]?.count : rawLikes?.count;

  if (typeof maybeCount === "number" && Number.isFinite(maybeCount)) {
    return maybeCount;
  }

  if (typeof maybeCount === "string") {
    const parsed = Number(maybeCount);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function mapReferenceRow(row: RawReferenceRow): DesignReference | null {
  const name = readNonEmptyString(row.title);
  if (!name) {
    return null;
  }

  if (typeof row.base_price !== "number" || !Number.isFinite(row.base_price)) {
    return null;
  }

  const imageUrls = parseImageUrls(row.reference_images);
  if (imageUrls.length === 0) {
    return null;
  }

  const categories = parseCategories(row.reference_style_tags);
  const durationMinutes =
    typeof row.service_duration_min === "number" && Number.isFinite(row.service_duration_min)
      ? row.service_duration_min
      : null;

  return {
    id: row.id,
    name,
    price: row.base_price,
    imageUrl: imageUrls[0],
    imageUrls,
    categories,
    isVisible: row.is_active !== false,
    badge: parseBadge(row.badge),
    durationMinutes,
    description: typeof row.description === "string" ? row.description : "",
    likeCount: parseLikeCount(row.reference_likes),
    createdAt: typeof row.created_at === "string" ? row.created_at : ""
  };
}

export async function getReferencesForCurrentUser(): Promise<DesignReference[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data: membershipRows, error: membershipError } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id);

  if (membershipError || !membershipRows || membershipRows.length === 0) {
    return [];
  }

  const shopIds = (membershipRows as ShopMembershipRow[])
    .map((row) => row.shop_id)
    .filter((shopId): shopId is string => typeof shopId === "string" && shopId.length > 0);

  if (shopIds.length === 0) {
    return [];
  }

  const { data: rawReferences, error: referencesError } = await supabase
    .from("references")
    .select(
      "id,title,description,base_price,created_at,service_duration_min,is_active,badge,reference_images(image_url,is_primary,sort_order),reference_style_tags(style_tags(name)),reference_likes(count)"
    )
    .in("shop_id", shopIds)
    .order("updated_at", { ascending: false });

  if (referencesError || !rawReferences) {
    return [];
  }

  return (rawReferences as RawReferenceRow[])
    .map((row) => mapReferenceRow(row))
    .filter((row): row is DesignReference => row !== null);
}
