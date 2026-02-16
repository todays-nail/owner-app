import type {BookingCard, BookingStage} from "@/features/bookings/model/types";

export type BoardState = Record<BookingStage, BookingCard[]>;

export function toBoardState(cards: BookingCard[]): BoardState {
  return {
    deposit_pending: cards.filter((card) => card.stage === "deposit_pending"),
    in_service: cards.filter((card) => card.stage === "in_service"),
    payment_pending: cards.filter((card) => card.stage === "payment_pending"),
    completed: cards.filter((card) => card.stage === "completed")
  };
}
