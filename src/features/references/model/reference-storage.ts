import {
  INITIAL_REFERENCES,
  REFERENCE_CATEGORIES,
  type DesignReference,
  type ReferenceBadge,
  type ReferenceCategory
} from "@/features/references/model/references";

export const REFERENCE_STORAGE_KEY = "owner-app.references";

const CATEGORY_SET = new Set<string>(REFERENCE_CATEGORIES);
const BADGE_SET = new Set<ReferenceBadge>(["NEW", "인기", null]);
const PLACEHOLDER_TITLES = new Set(["제목없음", "제목 없음", "untitled", "Untitled"]);

function fallbackReferences(): DesignReference[] {
  return INITIAL_REFERENCES.map((item) => ({ ...item, imageUrls: [...item.imageUrls] }));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCategories(value: unknown): ReferenceCategory[] | null {
  if (!Array.isArray(value)) return null;

  const next = value.filter(
    (category): category is ReferenceCategory =>
      typeof category === "string" && CATEGORY_SET.has(category)
  );

  return next.length > 0 ? next : null;
}

function parseImageUrls(value: unknown, imageUrl: string): string[] {
  if (!Array.isArray(value)) return [imageUrl];

  const next = value.filter((url): url is string => typeof url === "string" && url.length > 0);
  return next.length > 0 ? next : [imageUrl];
}

function parseNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sanitizeName(value: unknown): string {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";
  if (PLACEHOLDER_TITLES.has(trimmed)) return "";

  return trimmed;
}

function normalizeReference(raw: unknown): DesignReference | null {
  if (!isObject(raw)) return null;

  const id = typeof raw.id === "string" ? raw.id : "";
  const nameFromNameField = sanitizeName(raw.name);
  const nameFromLegacyTitleField = sanitizeName(raw.title);
  const fallbackNameFromInitial =
    INITIAL_REFERENCES.find((item) => item.id === id)?.name ?? "";
  const name = nameFromNameField || nameFromLegacyTitleField || fallbackNameFromInitial;
  const imageUrlFromImageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl : "";
  const imageUrlFromImageUrls =
    Array.isArray(raw.imageUrls) && typeof raw.imageUrls[0] === "string" ? raw.imageUrls[0] : "";
  const imageUrl = imageUrlFromImageUrl || imageUrlFromImageUrls;
  const categories = parseCategories(raw.categories);
  const price = parseNumber(raw.price);
  const rawFinalPrice = parseNumber(raw.finalPrice ?? raw.final_price);

  if (!id || !name || !imageUrl || !categories || price === null) {
    return null;
  }

  const badge = BADGE_SET.has(raw.badge as ReferenceBadge) ? (raw.badge as ReferenceBadge) : null;
  const isVisible = typeof raw.isVisible === "boolean" ? raw.isVisible : true;
  const durationMinutes = parseNumber(raw.durationMinutes);
  const description = typeof raw.description === "string" ? raw.description : "";
  const imageUrls = parseImageUrls(raw.imageUrls, imageUrl);
  const finalPrice =
    rawFinalPrice === null ? price : Math.max(0, Math.min(price, Math.floor(rawFinalPrice)));

  return {
    id,
    name,
    price,
    finalPrice,
    imageUrl,
    imageUrls,
    categories,
    isVisible,
    badge,
    durationMinutes,
    description
  };
}

export type ReferenceEntity = DesignReference;

export function loadReferences(): ReferenceEntity[] {
  if (typeof window === "undefined") {
    return fallbackReferences();
  }

  const raw = window.localStorage.getItem(REFERENCE_STORAGE_KEY);
  if (!raw) {
    const fallback = fallbackReferences();
    saveReferences(fallback);
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const fallback = fallbackReferences();
      saveReferences(fallback);
      return fallback;
    }

    const normalized = parsed
      .map((item) => normalizeReference(item))
      .filter((item): item is ReferenceEntity => item !== null);

    if (normalized.length === 0) {
      const fallback = fallbackReferences();
      saveReferences(fallback);
      return fallback;
    }

    saveReferences(normalized);
    return normalized;
  } catch {
    const fallback = fallbackReferences();
    saveReferences(fallback);
    return fallback;
  }
}

export function saveReferences(items: ReferenceEntity[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(REFERENCE_STORAGE_KEY, JSON.stringify(items));
}

export function findReferenceById(id: string): ReferenceEntity | null {
  return loadReferences().find((item) => item.id === id) ?? null;
}
