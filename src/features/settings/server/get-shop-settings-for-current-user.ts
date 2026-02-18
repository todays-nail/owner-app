import {
  SHOP_SETTINGS_DEFAULTS,
  type ShopGalleryImageDto,
  type ShopSettingsDto,
  type Weekday
} from "@/features/settings/model/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GALLERY_BUCKET = "shop-gallery-images";
const GALLERY_SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;

const WEEKDAY_SET = new Set<Weekday>(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);

interface ShopMembershipRow {
  shop_id: string;
}

interface ShopRow {
  id: string;
  name: string | null;
  representative_name: string | null;
  business_registration_no: string | null;
  phone: string | null;
  address: string | null;
  address_detail: string | null;
}

interface ShopSettingsRow {
  open_time: string | null;
  close_time: string | null;
  closed_weekdays: string[] | null;
  intro: string | null;
  base_gel_price: number | string | null;
  removal_price: number | string | null;
  extension_price: number | string | null;
  art_unit_price: number | string | null;
  deposit_amount: number | string | null;
  booking_enabled: boolean | null;
  auto_confirm: boolean | null;
  allow_onsite_payment: boolean | null;
  invoice_email: string | null;
  settlement_bank: string | null;
  settlement_account: string | null;
  notify_quote_request: boolean | null;
  notify_booking_created: boolean | null;
  notify_payment_completed: boolean | null;
}

interface ShopGalleryImageRow {
  id: string;
  storage_path: string | null;
  sort_order: number | string | null;
  created_at: string | null;
}

export type GetShopSettingsResult =
  | { ok: true; data: ShopSettingsDto }
  | {
      ok: false;
      reason: "ENV_MISSING" | "NOT_AUTHENTICATED" | "NO_SHOP" | "QUERY_FAILED";
      errorMessage?: string;
    };

function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseNonNegativeInteger(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return fallback;
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function normalizeTime(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const match = /^([01]\d|2[0-3]):([0-5]\d)/.exec(value);
  if (!match) {
    return fallback;
  }

  return `${match[1]}:${match[2]}`;
}

function normalizeClosedWeekdays(value: unknown): Weekday[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const next: Weekday[] = [];
  const seen = new Set<Weekday>();

  for (const item of value) {
    if (typeof item !== "string") {
      continue;
    }

    const normalized = item.toUpperCase() as Weekday;
    if (!WEEKDAY_SET.has(normalized) || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    next.push(normalized);
  }

  return next;
}

function parseSortOrder(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return 0;
}

function normalizeCreatedAt(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return "";
  }

  return new Date(parsed).toISOString();
}

export async function getShopSettingsForCurrentUser(): Promise<GetShopSettingsResult> {
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

  const { data: memberships, error: membershipError } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id);

  if (membershipError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: membershipError.message };
  }

  const membershipRows = (memberships ?? []) as ShopMembershipRow[];
  if (membershipRows.length === 0) {
    return { ok: false, reason: "NO_SHOP", errorMessage: "연결된 매장 정보가 없습니다." };
  }

  if (membershipRows.length > 1) {
    return {
      ok: false,
      reason: "QUERY_FAILED",
      errorMessage: "계정에 복수 매장이 연결되어 있습니다."
    };
  }

  const shopId = membershipRows[0]?.shop_id;
  if (!shopId) {
    return { ok: false, reason: "NO_SHOP", errorMessage: "매장 ID를 확인할 수 없습니다." };
  }

  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id,name,representative_name,business_registration_no,phone,address,address_detail")
    .eq("id", shopId)
    .maybeSingle();

  if (shopError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: shopError.message };
  }

  if (!shop) {
    return { ok: false, reason: "NO_SHOP", errorMessage: "매장 정보를 찾지 못했습니다." };
  }

  const { data: settings, error: settingsError } = await supabase
    .from("shop_settings")
    .select(
      "open_time,close_time,closed_weekdays,intro,base_gel_price,removal_price,extension_price,art_unit_price,deposit_amount,booking_enabled,auto_confirm,allow_onsite_payment,invoice_email,settlement_bank,settlement_account,notify_quote_request,notify_booking_created,notify_payment_completed"
    )
    .eq("shop_id", shopId)
    .maybeSingle();

  if (settingsError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: settingsError.message };
  }

  const { data: galleryRows, error: galleryError } = await supabase
    .from("shop_gallery_images")
    .select("id,storage_path,sort_order,created_at")
    .eq("shop_id", shopId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (galleryError) {
    return { ok: false, reason: "QUERY_FAILED", errorMessage: galleryError.message };
  }

  const shopRow = shop as ShopRow;
  const settingsRow = settings as ShopSettingsRow | null;
  const rawGalleryRows = (galleryRows ?? []) as ShopGalleryImageRow[];

  const galleryImages = await Promise.all(
    rawGalleryRows.map(async (row): Promise<ShopGalleryImageDto> => {
      const storagePath = readString(row.storage_path) ?? "";
      let signedUrl: string | null = null;

      if (storagePath) {
        const { data: signedData, error: signedError } = await supabase.storage
          .from(GALLERY_BUCKET)
          .createSignedUrl(storagePath, GALLERY_SIGNED_URL_EXPIRES_IN_SECONDS);

        if (!signedError) {
          signedUrl = signedData?.signedUrl ?? null;
        }
      }

      return {
        id: row.id,
        storagePath,
        sortOrder: parseSortOrder(row.sort_order),
        createdAt: normalizeCreatedAt(row.created_at),
        signedUrl
      };
    })
  );

  return {
    ok: true,
    data: {
      shopId: shopRow.id,
      shopName: readString(shopRow.name) ?? "내 샵",
      ownerName: readString(shopRow.representative_name) ?? "대표자",
      businessNumber: readString(shopRow.business_registration_no) ?? "",
      addressLine1: readString(shopRow.address) ?? "",
      addressLine2: readString(shopRow.address_detail) ?? "",
      contactPhone: readString(shopRow.phone) ?? "",
      openTime: normalizeTime(settingsRow?.open_time, "10:00"),
      closeTime: normalizeTime(settingsRow?.close_time, "20:00"),
      closedWeekdays: normalizeClosedWeekdays(settingsRow?.closed_weekdays),
      intro: readString(settingsRow?.intro) ?? "",
      baseGelPrice: parseNonNegativeInteger(
        settingsRow?.base_gel_price,
        SHOP_SETTINGS_DEFAULTS.baseGelPrice
      ),
      removalPrice: parseNonNegativeInteger(
        settingsRow?.removal_price,
        SHOP_SETTINGS_DEFAULTS.removalPrice
      ),
      extensionPrice: parseNonNegativeInteger(
        settingsRow?.extension_price,
        SHOP_SETTINGS_DEFAULTS.extensionPrice
      ),
      artUnitPrice: parseNonNegativeInteger(
        settingsRow?.art_unit_price,
        SHOP_SETTINGS_DEFAULTS.artUnitPrice
      ),
      depositAmount: parseNonNegativeInteger(
        settingsRow?.deposit_amount,
        SHOP_SETTINGS_DEFAULTS.depositAmount
      ),
      bookingEnabled: parseBoolean(
        settingsRow?.booking_enabled,
        SHOP_SETTINGS_DEFAULTS.bookingEnabled
      ),
      autoConfirm: parseBoolean(settingsRow?.auto_confirm, SHOP_SETTINGS_DEFAULTS.autoConfirm),
      allowOnsitePayment: parseBoolean(
        settingsRow?.allow_onsite_payment,
        SHOP_SETTINGS_DEFAULTS.allowOnsitePayment
      ),
      invoiceEmail: readString(settingsRow?.invoice_email) ?? "",
      settlementBank: readString(settingsRow?.settlement_bank) ?? "카카오뱅크",
      settlementAccount: readString(settingsRow?.settlement_account) ?? "",
      notifyQuoteRequest: parseBoolean(
        settingsRow?.notify_quote_request,
        SHOP_SETTINGS_DEFAULTS.notifyQuoteRequest
      ),
      notifyBookingCreated: parseBoolean(
        settingsRow?.notify_booking_created,
        SHOP_SETTINGS_DEFAULTS.notifyBookingCreated
      ),
      notifyPaymentCompleted: parseBoolean(
        settingsRow?.notify_payment_completed,
        SHOP_SETTINGS_DEFAULTS.notifyPaymentCompleted
      ),
      galleryImages
    }
  };
}
