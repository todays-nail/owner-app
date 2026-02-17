import type { Weekday } from "@/features/settings/model/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const SHOP_GALLERY_BUCKET = "shop-gallery-images";
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

interface ShopMembershipRow {
  shop_id: string;
}

interface ShopGalleryImageRow {
  id: string;
  storage_path: string | null;
}

interface SortOrderRow {
  sort_order: number | string | null;
}

export interface UpdateShopSettingsInput {
  addressLine1: string;
  addressLine2: string;
  contactPhone: string;
  openTime: string;
  closeTime: string;
  closedWeekdays: Weekday[];
  intro: string;
  baseGelPrice: number;
  removalPrice: number;
  extensionPrice: number;
  artUnitPrice: number;
  depositAmount: number;
  autoConfirm: boolean;
  allowOnsitePayment: boolean;
  invoiceEmail: string;
  settlementBank: string;
  settlementAccount: string;
  notifyQuoteRequest: boolean;
  notifyBookingCreated: boolean;
  notifyPaymentCompleted: boolean;
  removedImageIds: string[];
  newGalleryFiles: File[];
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

function safeFileExt(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  const ext = lastDot >= 0 ? filename.slice(lastDot + 1) : "";
  const cleaned = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned || "bin";
}

function normalizeTimeOrThrow(value: string, label: string): string {
  const trimmed = value.trim();
  const match = TIME_PATTERN.exec(trimmed);
  if (!match) {
    throw new Error(`${label} 형식이 올바르지 않습니다. (HH:MM)`);
  }

  return `${match[1]}:${match[2]}`;
}

function uniqueNonEmptyStrings(values: string[]): string[] {
  const next: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    next.push(trimmed);
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

async function removeStoragePathsBestEffort(
  supabase: NonNullable<ReturnType<typeof createSupabaseBrowserClient>>,
  storagePaths: string[]
): Promise<void> {
  if (storagePaths.length === 0) {
    return;
  }

  try {
    await supabase.storage.from(SHOP_GALLERY_BUCKET).remove(storagePaths);
  } catch {
    // ignore cleanup failure (best-effort)
  }
}

export async function updateShopSettingsForCurrentUser(
  input: UpdateShopSettingsInput
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

  const { data: memberships, error: membershipError } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id);

  if (membershipError) {
    throw new Error(`매장 권한 확인에 실패했습니다. (${formatSupabaseError(membershipError)})`);
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

  const openTime = normalizeTimeOrThrow(input.openTime, "영업 시작 시간");
  const closeTime = normalizeTimeOrThrow(input.closeTime, "영업 종료 시간");

  const { error: updateShopError } = await supabase
    .from("shops")
    .update({
      phone: input.contactPhone.trim(),
      address: input.addressLine1.trim(),
      address_detail: input.addressLine2.trim() || null
    })
    .eq("id", shopId);

  if (updateShopError) {
    throw new Error(`매장 기본 정보 저장에 실패했습니다. (${formatSupabaseError(updateShopError)})`);
  }

  const { error: upsertSettingsError } = await supabase.from("shop_settings").upsert({
    shop_id: shopId,
    open_time: openTime,
    close_time: closeTime,
    closed_weekdays: input.closedWeekdays,
    intro: input.intro.trim(),
    base_gel_price: input.baseGelPrice,
    removal_price: input.removalPrice,
    extension_price: input.extensionPrice,
    art_unit_price: input.artUnitPrice,
    deposit_amount: input.depositAmount,
    auto_confirm: input.autoConfirm,
    allow_onsite_payment: input.allowOnsitePayment,
    invoice_email: input.invoiceEmail.trim(),
    settlement_bank: input.settlementBank.trim(),
    settlement_account: input.settlementAccount.trim(),
    notify_quote_request: input.notifyQuoteRequest,
    notify_booking_created: input.notifyBookingCreated,
    notify_payment_completed: input.notifyPaymentCompleted
  });

  if (upsertSettingsError) {
    throw new Error(`운영 설정 저장에 실패했습니다. (${formatSupabaseError(upsertSettingsError)})`);
  }

  const removedImageIds = uniqueNonEmptyStrings(input.removedImageIds);
  if (removedImageIds.length > 0) {
    const { data: removableRows, error: removableRowsError } = await supabase
      .from("shop_gallery_images")
      .select("id,storage_path")
      .eq("shop_id", shopId)
      .in("id", removedImageIds);

    if (removableRowsError) {
      throw new Error(
        `삭제 대상 이미지를 확인하지 못했습니다. (${formatSupabaseError(removableRowsError)})`
      );
    }

    const rows = (removableRows ?? []) as ShopGalleryImageRow[];
    const ownedImageIds = rows.map((row) => row.id);

    if (ownedImageIds.length > 0) {
      const { error: deleteRowsError } = await supabase
        .from("shop_gallery_images")
        .delete()
        .eq("shop_id", shopId)
        .in("id", ownedImageIds);

      if (deleteRowsError) {
        throw new Error(`이미지 삭제에 실패했습니다. (${formatSupabaseError(deleteRowsError)})`);
      }

      const pathsToRemove = rows
        .map((row) => row.storage_path)
        .filter((path): path is string => typeof path === "string" && path.length > 0);

      await removeStoragePathsBestEffort(supabase, pathsToRemove);
    }
  }

  if (input.newGalleryFiles.length > 0) {
    const { data: lastSortRow, error: lastSortError } = await supabase
      .from("shop_gallery_images")
      .select("sort_order")
      .eq("shop_id", shopId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastSortError) {
      throw new Error(`이미지 정렬 순서를 확인하지 못했습니다. (${formatSupabaseError(lastSortError)})`);
    }

    const nextSortOrder = parseSortOrder((lastSortRow as SortOrderRow | null)?.sort_order) + 1;
    const uploadedPaths: string[] = [];
    const insertRows: Array<{ shop_id: string; storage_path: string; sort_order: number }> = [];

    try {
      for (let index = 0; index < input.newGalleryFiles.length; index += 1) {
        const file = input.newGalleryFiles[index];
        const extension = safeFileExt(file.name);
        const storagePath = `shops/${shopId}/gallery/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(SHOP_GALLERY_BUCKET)
          .upload(storagePath, file, {
            upsert: false
          });

        if (uploadError) {
          throw new Error(`이미지 업로드에 실패했습니다. (${formatSupabaseError(uploadError)})`);
        }

        uploadedPaths.push(storagePath);
        insertRows.push({
          shop_id: shopId,
          storage_path: storagePath,
          sort_order: nextSortOrder + index
        });
      }

      const { error: insertError } = await supabase.from("shop_gallery_images").insert(insertRows);
      if (insertError) {
        throw new Error(
          `업로드 이미지 저장에 실패했습니다. (${formatSupabaseError(insertError)})`
        );
      }
    } catch (error) {
      await removeStoragePathsBestEffort(supabase, uploadedPaths);
      throw error;
    }
  }
}
