import type { BookingCard, BookingStage } from "@/features/bookings/model/types";

export type BoardState = Record<BookingStage, BookingCard[]>;

export interface CardLocation {
  stage: BookingStage;
  index: number;
}

function moveIndex<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function toBoardState(cards: BookingCard[]): BoardState {
  return {
    deposit_pending: cards.filter((card) => card.stage === "deposit_pending"),
    in_service: cards.filter((card) => card.stage === "in_service"),
    payment_pending: cards.filter((card) => card.stage === "payment_pending"),
    completed: cards.filter((card) => card.stage === "completed")
  };
}

export function findCardLocation(board: BoardState, id: string): CardLocation | null {
  for (const stage of Object.keys(board) as BookingStage[]) {
    const index = board[stage].findIndex((card) => card.id === id);
    if (index !== -1) {
      return { stage, index };
    }
  }

  return null;
}

export function parseDropTarget(board: BoardState, overId: string): CardLocation | null {
  if (overId.startsWith("column:")) {
    const stage = overId.replace("column:", "") as BookingStage;
    return { stage, index: board[stage].length };
  }

  return findCardLocation(board, overId);
}

export function moveBookingCard(
  board: BoardState,
  activeId: string,
  overId: string
): BoardState {
  const source = findCardLocation(board, activeId);
  if (!source) {
    return board;
  }

  const target = parseDropTarget(board, overId);
  if (!target) {
    return board;
  }

  if (source.stage === target.stage) {
    const nextCards = [...board[source.stage]];
    const targetIndex = overId.startsWith("column:") ? nextCards.length - 1 : target.index;

    if (targetIndex === source.index || targetIndex < 0) {
      return board;
    }

    return {
      ...board,
      [source.stage]: moveIndex(nextCards, source.index, targetIndex)
    };
  }

  const sourceCards = [...board[source.stage]];
  const targetCards = [...board[target.stage]];
  const [moved] = sourceCards.splice(source.index, 1);

  const movedCard: BookingCard = {
    ...moved,
    stage: target.stage
  };

  const insertAt = overId.startsWith("column:") ? targetCards.length : target.index;
  targetCards.splice(insertAt, 0, movedCard);

  return {
    ...board,
    [source.stage]: sourceCards,
    [target.stage]: targetCards
  };
}
