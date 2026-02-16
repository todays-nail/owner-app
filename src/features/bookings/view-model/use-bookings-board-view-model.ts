"use client";

import {
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import * as React from "react";

import {
  findCardLocation,
  moveBookingCard,
  toBoardState,
  type BoardState
} from "@/features/bookings/model/board-state";
import type { BookingCard, BookingStage } from "@/features/bookings/model/types";

export interface BookingsBoardViewModel {
  board: BoardState;
  activeCardId: string | null;
  activeCardStage: BookingStage | null;
  sensors: ReturnType<typeof useSensors>;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function useBookingsBoardViewModel(initialCards: BookingCard[]): BookingsBoardViewModel {
  const [board, setBoard] = React.useState<BoardState>(() => toBoardState(initialCards));
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setBoard(toBoardState(initialCards));
    setActiveCardId(null);
  }, [initialCards]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const activeCardStage = React.useMemo(() => {
    if (!activeCardId) {
      return null;
    }

    const location = findCardLocation(board, activeCardId);
    return location?.stage ?? null;
  }, [activeCardId, board]);

  const onDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveCardId(event.active.id as string);
  }, []);

  const onDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    setBoard((current) => moveBookingCard(current, activeId, overId));
  }, []);

  return {
    board,
    activeCardId,
    activeCardStage,
    sensors,
    onDragStart,
    onDragEnd
  };
}
