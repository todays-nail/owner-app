"use client";

import * as React from "react";

import {
  BOOKING_COLUMNS,
  BOOKING_REVENUE_ITEMS,
  INITIAL_BOOKING_CARDS
} from "@/features/bookings/model/mock-bookings";
import {
  mapBoardStateToViewData,
  mapBookingColumnToViewData,
  mapRevenueItemToViewData
} from "@/features/bookings/presenter/booking-view-mapper";
import { useBookingsBoardViewModel } from "@/features/bookings/view-model/use-bookings-board-view-model";

export interface BookingsPageViewModel {
  mounted: boolean;
  columns: ReturnType<typeof mapBookingColumnToViewData>[];
  board: ReturnType<typeof mapBoardStateToViewData>;
  activeCardStage: ReturnType<typeof useBookingsBoardViewModel>["activeCardStage"];
  sensors: ReturnType<typeof useBookingsBoardViewModel>["sensors"];
  onDragStart: ReturnType<typeof useBookingsBoardViewModel>["onDragStart"];
  onDragEnd: ReturnType<typeof useBookingsBoardViewModel>["onDragEnd"];
  revenueCards: ReturnType<typeof mapRevenueItemToViewData>[];
}

export function useBookingsPageViewModel(): BookingsPageViewModel {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const boardVm = useBookingsBoardViewModel(INITIAL_BOOKING_CARDS);

  const columns = React.useMemo(
    () => BOOKING_COLUMNS.map(mapBookingColumnToViewData),
    []
  );

  const board = React.useMemo(
    () => mapBoardStateToViewData(boardVm.board),
    [boardVm.board]
  );

  const revenueCards = React.useMemo(
    () => BOOKING_REVENUE_ITEMS.map(mapRevenueItemToViewData),
    []
  );

  return {
    mounted,
    columns,
    board,
    activeCardStage: boardVm.activeCardStage,
    sensors: boardVm.sensors,
    onDragStart: boardVm.onDragStart,
    onDragEnd: boardVm.onDragEnd,
    revenueCards
  };
}
