"use client";

import * as React from "react";

import {toBoardState} from "@/features/bookings/model/board-state";
import {BOOKING_COLUMNS, BOOKING_REVENUE_ITEMS, INITIAL_BOOKING_CARDS} from "@/features/bookings/model/mock-bookings";
import {
  mapBoardStateToViewData,
  mapBookingColumnToViewData,
  mapRevenueItemToViewData
} from "@/features/bookings/presenter/booking-view-mapper";

export interface BookingsPageViewModel {
  mounted: boolean;
  columns: ReturnType<typeof mapBookingColumnToViewData>[];
  board: ReturnType<typeof mapBoardStateToViewData>;
  revenueCards: ReturnType<typeof mapRevenueItemToViewData>[];
}

export function useBookingsPageViewModel(): BookingsPageViewModel {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const columns = React.useMemo(
    () => BOOKING_COLUMNS.map(mapBookingColumnToViewData),
    []
  );

  const board = React.useMemo(
    () => mapBoardStateToViewData(toBoardState(INITIAL_BOOKING_CARDS)),
    []
  );

  const revenueCards = React.useMemo(
    () => BOOKING_REVENUE_ITEMS.map(mapRevenueItemToViewData),
    []
  );

  return {
    mounted,
    columns,
    board,
    revenueCards
  };
}
