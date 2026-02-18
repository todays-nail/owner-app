import type { Weekday } from "@/features/settings/model/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const DAY_MS = 24 * 60 * 60 * 1000;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/;
const DEFAULT_DAYS = 14;
const DEFAULT_STEP_MINUTES = 30;
const DEFAULT_DURATION_MINUTES = 60;

interface ShopMembershipRow {
  shop_id: string;
}

interface ShopSettingRow {
  open_time: string | null;
  close_time: string | null;
  closed_weekdays: string[] | null;
  booking_enabled: boolean | null;
}

interface ExistingSlotRow {
  start_at: string;
}

export interface GenerateBookingSlotsInput {
  days?: number;
  stepMinutes?: number;
  durationMinutes?: number;
}

export interface GenerateBookingSlotsResult {
  insertedCount: number;
  existingCount: number;
  candidateCount: number;
  fromDate: string;
  toDate: string;
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

function parseMinutes(timeText: string | null | undefined): number | null {
  if (!timeText) return null;

  const trimmed = timeText.trim();
  const matched = TIME_PATTERN.exec(trimmed);
  if (!matched) return null;

  const hour = Number(matched[1]);
  const minute = Number(matched[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  return hour * 60 + minute;
}

function normalizeWeekday(value: string): Weekday | null {
  const upper = value.trim().toUpperCase();
  if (
    upper === "MON" ||
    upper === "TUE" ||
    upper === "WED" ||
    upper === "THU" ||
    upper === "FRI" ||
    upper === "SAT" ||
    upper === "SUN"
  ) {
    return upper;
  }

  return null;
}

function weekdayFromUTCDate(date: Date): Weekday {
  const day = date.getUTCDay();
  const map: Weekday[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return map[day] ?? "SUN";
}

function minuteKey(isoString: string): string {
  const parsed = new Date(isoString);
  return Number.isNaN(parsed.getTime())
    ? isoString
    : parsed.toISOString().slice(0, 16);
}

export async function generateBookingSlotsForCurrentUser(
  input: GenerateBookingSlotsInput = {},
): Promise<GenerateBookingSlotsResult> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("환경변수가 설정되지 않았습니다. (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)");
  }

  const days = Number.isInteger(input.days) && (input.days ?? 0) > 0
    ? Math.min(31, input.days as number)
    : DEFAULT_DAYS;
  const stepMinutes = Number.isInteger(input.stepMinutes) && (input.stepMinutes ?? 0) > 0
    ? Math.min(180, input.stepMinutes as number)
    : DEFAULT_STEP_MINUTES;
  const durationMinutes = Number.isInteger(input.durationMinutes) && (input.durationMinutes ?? 0) > 0
    ? Math.min(360, input.durationMinutes as number)
    : DEFAULT_DURATION_MINUTES;

  const {
    data: { user },
    error: userError,
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

  const { data: shopSetting, error: shopSettingError } = await supabase
    .from("shop_settings")
    .select("open_time,close_time,closed_weekdays,booking_enabled")
    .eq("shop_id", shopId)
    .maybeSingle();

  if (shopSettingError) {
    throw new Error(`예약 설정 조회에 실패했습니다. (${formatSupabaseError(shopSettingError)})`);
  }

  const setting = shopSetting as ShopSettingRow | null;
  const bookingEnabled = setting?.booking_enabled ?? false;
  if (!bookingEnabled) {
    throw new Error("예약 접수 활성화를 먼저 켜주세요.");
  }

  const openMinutes = parseMinutes(setting?.open_time);
  const closeMinutes = parseMinutes(setting?.close_time);
  if (openMinutes === null || closeMinutes === null || closeMinutes <= openMinutes) {
    throw new Error("영업시간 설정이 올바르지 않습니다. 시작/종료 시간을 확인해 주세요.");
  }

  if (durationMinutes > closeMinutes - openMinutes) {
    throw new Error("슬롯 기본 소요 시간이 영업시간보다 깁니다. 설정을 확인해 주세요.");
  }

  const closedWeekdays = new Set<Weekday>();
  for (const raw of setting?.closed_weekdays ?? []) {
    if (typeof raw !== "string") continue;
    const normalized = normalizeWeekday(raw);
    if (normalized) {
      closedWeekdays.add(normalized);
    }
  }

  const now = new Date();
  const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const rangeStart = startOfTodayUTC;
  const rangeEnd = new Date(rangeStart.getTime() + days * DAY_MS);

  const { data: existingSlots, error: existingSlotsError } = await supabase
    .from("slots")
    .select("start_at")
    .eq("shop_id", shopId)
    .gte("start_at", rangeStart.toISOString())
    .lt("start_at", rangeEnd.toISOString());

  if (existingSlotsError) {
    throw new Error(`기존 슬롯 조회에 실패했습니다. (${formatSupabaseError(existingSlotsError)})`);
  }

  const existingStartKeys = new Set<string>(
    ((existingSlots ?? []) as ExistingSlotRow[])
      .map((row) => row.start_at)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map(minuteKey),
  );

  const candidates: Array<{
    shop_id: string;
    start_at: string;
    duration_min: number;
    capacity: number;
    status: "OPEN";
  }> = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const dayStart = new Date(rangeStart.getTime() + dayOffset * DAY_MS);
    if (closedWeekdays.has(weekdayFromUTCDate(dayStart))) {
      continue;
    }

    for (
      let minuteOfDay = openMinutes;
      minuteOfDay + durationMinutes <= closeMinutes;
      minuteOfDay += stepMinutes
    ) {
      const startAt = new Date(dayStart.getTime() + minuteOfDay * 60 * 1000).toISOString();
      const key = minuteKey(startAt);
      if (existingStartKeys.has(key)) {
        continue;
      }

      existingStartKeys.add(key);
      candidates.push({
        shop_id: shopId,
        start_at: startAt,
        duration_min: durationMinutes,
        capacity: 1,
        status: "OPEN",
      });
    }
  }

  if (candidates.length > 0) {
    const { error: insertError } = await supabase
      .from("slots")
      .insert(candidates);

    if (insertError) {
      throw new Error(`슬롯 생성에 실패했습니다. (${formatSupabaseError(insertError)})`);
    }
  }

  return {
    insertedCount: candidates.length,
    existingCount: Math.max(0, (existingSlots ?? []).length),
    candidateCount: candidates.length + Math.max(0, (existingSlots ?? []).length),
    fromDate: rangeStart.toISOString().slice(0, 10),
    toDate: new Date(rangeEnd.getTime() - DAY_MS).toISOString().slice(0, 10),
  };
}
