"use client";

import * as React from "react";

import type {
  BookingCard,
  BookingColumn,
  BookingRevenueItem,
  BookingStage,
  BookingStatusTone,
  BookingTimeTone,
} from "@/features/bookings/model/types";
import { toBoardState } from "@/features/bookings/model/board-state";
import {
  mapBoardStateToViewData,
  mapBookingColumnToViewData,
  mapRevenueItemToViewData,
} from "@/features/bookings/presenter/booking-view-mapper";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface ShopMembershipRow {
  shop_id: string;
}

interface ReservationRow {
  id: string;
  status: string;
  user_id: string;
  created_at: string;
  references: unknown;
  slots: unknown;
}

interface ReferenceRow {
  title: string | null;
}

interface SlotRow {
  start_at: string;
  duration_min: number;
  status: string;
}

const BOOKING_COLUMNS: BookingColumn[] = [
  { id: "deposit_pending", title: "예약금 확인" },
  { id: "in_service", title: "오늘의 시술" },
  { id: "payment_pending", title: "결제 대기" },
  { id: "completed", title: "완료" },
];

const INITIAL_REVENUE_ITEMS: BookingRevenueItem[] = [
  {
    key: "today",
    label: "오늘 예약 건수",
    amount: "0건",
    icon: "today",
    tone: "success",
  },
  {
    key: "month",
    label: "전체 예약 건수",
    amount: "0건",
    icon: "view_kanban",
    tone: "primary",
  },
];

const DEFAULT_BOARD = mapBoardStateToViewData(toBoardState([]));
const ACTIVE_RESERVATION_STATUSES = [
  "PENDING_DEPOSIT",
  "DEPOSIT_PAID",
  "CONFIRMED",
  "SERVICE_CONFIRMED",
  "BALANCE_PAID",
  "COMPLETED",
  "USER_CANCELLED",
  "SHOP_CANCELLED",
  "EXPIRED",
];

export interface BookingsPageViewModel {
  mounted: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  columns: ReturnType<typeof mapBookingColumnToViewData>[];
  board: ReturnType<typeof mapBoardStateToViewData>;
  revenueCards: ReturnType<typeof mapRevenueItemToViewData>[];
}

function firstObject<T>(value: unknown): T | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value[0] ? (value[0] as T) : null;
  }
  return value as T;
}

function toStage(status: string): BookingStage {
  switch (status) {
    case "PENDING_DEPOSIT":
      return "deposit_pending";
    case "DEPOSIT_PAID":
    case "CONFIRMED":
      return "in_service";
    case "SERVICE_CONFIRMED":
    case "BALANCE_PAID":
      return "payment_pending";
    case "COMPLETED":
    case "USER_CANCELLED":
    case "SHOP_CANCELLED":
    case "EXPIRED":
      return "completed";
    default:
      return "deposit_pending";
  }
}

function toStatusLabel(status: string): string {
  switch (status) {
    case "PENDING_DEPOSIT":
      return "입금 대기";
    case "DEPOSIT_PAID":
      return "예약금 결제";
    case "CONFIRMED":
      return "예약 확정";
    case "SERVICE_CONFIRMED":
      return "시술 완료";
    case "BALANCE_PAID":
      return "잔금 결제 완료";
    case "COMPLETED":
      return "완료";
    case "USER_CANCELLED":
      return "고객 취소";
    case "SHOP_CANCELLED":
      return "샵 취소";
    case "EXPIRED":
      return "예약 만료";
    default:
      return status;
  }
}

function toStatusTone(status: string): BookingStatusTone {
  switch (status) {
    case "PENDING_DEPOSIT":
      return "warning";
    case "DEPOSIT_PAID":
    case "CONFIRMED":
      return "default";
    case "SERVICE_CONFIRMED":
      return "attention";
    case "BALANCE_PAID":
    case "COMPLETED":
      return "success";
    case "USER_CANCELLED":
    case "SHOP_CANCELLED":
    case "EXPIRED":
      return "attention";
    default:
      return "default";
  }
}

function formatDateTime(value: Date): string {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(value);
}

function formatTime(value: Date): string {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(value);
}

function pickDesignerTone(seed: string): "purple" | "blue" | "orange" {
  const tones: Array<"purple" | "blue" | "orange"> = ["purple", "blue", "orange"];
  const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return tones[hash % tones.length] ?? "purple";
}

function toTimePresentation(
  stage: BookingStage,
  slotStartAt: Date | null,
  durationMin: number,
): { label: string; tone: BookingTimeTone } {
  if (!slotStartAt) {
    return { label: "시간 미정", tone: "default" };
  }

  const now = Date.now();
  const start = slotStartAt.getTime();
  const end = start + Math.max(1, durationMin) * 60 * 1000;

  if (stage === "completed") {
    return { label: `${formatDateTime(slotStartAt)} 완료`, tone: "success" };
  }

  if (stage === "in_service") {
    if (start <= now && now < end) {
      return { label: `NOW ${formatTime(slotStartAt)}`, tone: "now" };
    }

    if (start > now && start - now <= 6 * 60 * 60 * 1000) {
      return { label: `NEXT ${formatTime(slotStartAt)}`, tone: "next" };
    }
  }

  if (stage === "payment_pending") {
    return { label: formatDateTime(slotStartAt), tone: "strike" };
  }

  return { label: formatDateTime(slotStartAt), tone: "default" };
}

function toBookingCard(row: ReservationRow): BookingCard {
  const reference = firstObject<ReferenceRow>(row.references);
  const slot = firstObject<SlotRow>(row.slots);

  const stage = toStage(row.status);
  const slotDate = slot?.start_at ? new Date(slot.start_at) : null;
  const validSlotDate = slotDate && !Number.isNaN(slotDate.getTime()) ? slotDate : null;
  const durationMin = slot?.duration_min ?? 60;
  const timePresentation = toTimePresentation(stage, validSlotDate, durationMin);

  return {
    id: row.id,
    stage,
    timeLabel: timePresentation.label,
    customerName: `고객 ${row.user_id.slice(0, 6)}`,
    serviceName: reference?.title?.trim() || "시술",
    designerName: "담당 배정",
    designerInitial: "담",
    imageUrl: `https://picsum.photos/seed/booking-${row.id}/80/80`,
    timeTone: timePresentation.tone,
    designerTone: pickDesignerTone(row.id),
    statusLabel: toStatusLabel(row.status),
    statusTone: toStatusTone(row.status),
    secondaryStatusLabel:
      stage === "payment_pending" && row.status !== "BALANCE_PAID" ? "결제 확인" : undefined,
    secondaryStatusTone:
      stage === "payment_pending" && row.status !== "BALANCE_PAID" ? "warning" : undefined,
  };
}

function makeRevenueItems(totalCount: number, todayCount: number): BookingRevenueItem[] {
  return [
    {
      key: "today",
      label: "오늘 예약 건수",
      amount: `${todayCount}건`,
      icon: "today",
      tone: "success",
    },
    {
      key: "month",
      label: "전체 예약 건수",
      amount: `${totalCount}건`,
      icon: "view_kanban",
      tone: "primary",
    },
  ];
}

async function loadReservationsAsCards(): Promise<{ cards: BookingCard[]; todayCount: number }> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("환경변수가 설정되지 않았습니다. (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)");
  }

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
    throw new Error(`매장 권한 확인에 실패했습니다. (${membershipError.message})`);
  }

  const membershipRows = (memberships ?? []) as ShopMembershipRow[];
  if (membershipRows.length === 0) {
    return { cards: [], todayCount: 0 };
  }

  const shopId = membershipRows[0]?.shop_id;
  if (!shopId) {
    return { cards: [], todayCount: 0 };
  }

  const { data, error } = await supabase
    .from("reservations")
    .select(
      "id,status,user_id,created_at,references!reservations_reference_id_fkey(title),slots!reservations_slot_id_fkey(start_at,duration_min,status)",
    )
    .eq("shop_id", shopId)
    .in("status", ACTIVE_RESERVATION_STATUSES)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(`예약 데이터 조회에 실패했습니다. (${error.message})`);
  }

  const rows = (data ?? []) as ReservationRow[];
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCount = rows.reduce((count, row) => {
    const slot = firstObject<SlotRow>(row.slots);
    if (!slot?.start_at) {
      return count;
    }
    return slot.start_at.slice(0, 10) === todayKey ? count + 1 : count;
  }, 0);

  return {
    cards: rows.map(toBookingCard),
    todayCount,
  };
}

export function useBookingsPageViewModel(): BookingsPageViewModel {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [board, setBoard] = React.useState(DEFAULT_BOARD);
  const [revenueCards, setRevenueCards] = React.useState(
    INITIAL_REVENUE_ITEMS.map(mapRevenueItemToViewData),
  );

  React.useEffect(() => {
    let active = true;

    const run = async () => {
      setMounted(true);
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { cards, todayCount } = await loadReservationsAsCards();
        if (!active) return;

        setBoard(mapBoardStateToViewData(toBoardState(cards)));
        setRevenueCards(makeRevenueItems(cards.length, todayCount).map(mapRevenueItemToViewData));
      } catch (error) {
        if (!active) return;

        setBoard(DEFAULT_BOARD);
        setRevenueCards(INITIAL_REVENUE_ITEMS.map(mapRevenueItemToViewData));
        setErrorMessage(
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : "예약 데이터를 불러오지 못했습니다.",
        );
      } finally {
        if (!active) return;
        setIsLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  const columns = React.useMemo(
    () => BOOKING_COLUMNS.map(mapBookingColumnToViewData),
    [],
  );

  return {
    mounted,
    isLoading,
    errorMessage,
    columns,
    board,
    revenueCards,
  };
}
