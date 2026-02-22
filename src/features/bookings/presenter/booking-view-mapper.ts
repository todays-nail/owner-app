import type { ChipVariant } from "@/components/ui/chip";
import type { BoardState } from "@/features/bookings/model/board-state";
import type {
  BookingAmountTone,
  BookingCard,
  BookingColumn,
  BookingDesignerTone,
  BookingRevenueItem,
  BookingStage,
  BookingStatusTone,
  BookingTimeTone
} from "@/features/bookings/model/types";

export interface BookingCardViewData extends BookingCard {
  timeChipVariant: ChipVariant;
  designerBadgeClassName: string;
  statusChipVariant: ChipVariant;
  amountClassName?: string;
  secondaryStatusChipVariant?: ChipVariant;
}

export interface BookingColumnViewData extends BookingColumn {
  dotClassName: string;
  countChipVariant: ChipVariant;
  containerClassName: string;
}

export interface BookingsRevenueCardViewData extends BookingRevenueItem {
  iconClassName: string;
}

function mapTimeToneToChipVariant(timeTone: BookingTimeTone): ChipVariant {
  const map: Record<BookingTimeTone, ChipVariant> = {
    default: "time-default",
    strike: "time-strike",
    now: "time-now",
    next: "time-next",
    success: "time-success"
  };

  return map[timeTone];
}

function mapStatusToneToChipVariant(statusTone: BookingStatusTone): ChipVariant {
  const map: Record<BookingStatusTone, ChipVariant> = {
    default: "status-default",
    warning: "status-warning",
    success: "status-success",
    attention: "status-attention"
  };

  return map[statusTone];
}

function mapDesignerToneToClassName(designerTone: BookingDesignerTone): string {
  const map: Record<BookingDesignerTone, string> = {
    purple: "border border-purple-100 bg-purple-50 text-purple-600",
    blue: "border border-blue-100 bg-blue-50 text-blue-600",
    orange: "border border-orange-100 bg-orange-50 text-orange-600"
  };

  return map[designerTone];
}

function mapAmountToneToClassName(amountTone?: BookingAmountTone): string | undefined {
  const map: Record<BookingAmountTone, string> = {
    muted: "text-slate-400",
    primary: "text-primary",
    success: "text-emerald-600"
  };

  if (!amountTone) {
    return undefined;
  }

  return map[amountTone];
}

function mapColumnToPresentation(columnId: BookingStage): Omit<BookingColumnViewData, "id" | "title"> {
  const map: Record<
    BookingStage,
    Omit<BookingColumnViewData, "id" | "title">
  > = {
    deposit_pending: {
      dotClassName: "bg-slate-400",
      countChipVariant: "count-neutral",
      containerClassName:
        "border border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-white/5"
    },
    in_service: {
      dotClassName: "bg-orange-400 animate-pulse",
      countChipVariant: "count-warning",
      containerClassName:
        "border border-orange-200 bg-orange-50 dark:border-white/5 dark:bg-white/5"
    },
    payment_pending: {
      dotClassName: "bg-yellow-500",
      countChipVariant: "count-warning",
      containerClassName:
        "border border-yellow-200 bg-yellow-50 dark:border-white/5 dark:bg-white/5"
    },
    completed: {
      dotClassName: "bg-emerald-400",
      countChipVariant: "count-success",
      containerClassName:
        "border border-emerald-100 bg-emerald-50 dark:border-white/5 dark:bg-white/5"
    }
  };

  return map[columnId];
}

export function mapBookingCardToViewData(card: BookingCard): BookingCardViewData {
  return {
    ...card,
    timeChipVariant: mapTimeToneToChipVariant(card.timeTone),
    designerBadgeClassName: mapDesignerToneToClassName(card.designerTone),
    statusChipVariant: mapStatusToneToChipVariant(card.statusTone),
    amountClassName: mapAmountToneToClassName(card.amountTone),
    secondaryStatusChipVariant: card.secondaryStatusTone
      ? mapStatusToneToChipVariant(card.secondaryStatusTone)
      : undefined
  };
}

export function mapBookingColumnToViewData(column: BookingColumn): BookingColumnViewData {
  return {
    ...column,
    ...mapColumnToPresentation(column.id)
  };
}

export function mapBoardStateToViewData(
  board: BoardState
): Record<BookingStage, BookingCardViewData[]> {
  return {
    deposit_pending: board.deposit_pending.map(mapBookingCardToViewData),
    in_service: board.in_service.map(mapBookingCardToViewData),
    payment_pending: board.payment_pending.map(mapBookingCardToViewData),
    completed: board.completed.map(mapBookingCardToViewData)
  };
}

export function mapRevenueItemToViewData(
  item: BookingRevenueItem
): BookingsRevenueCardViewData {
  return {
    ...item,
    iconClassName:
      item.tone === "success"
        ? "bg-emerald-100 text-emerald-600"
        : "bg-primary/10 text-primary"
  };
}
