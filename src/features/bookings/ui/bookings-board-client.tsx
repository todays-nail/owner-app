"use client";

import {
  BookingsBoard,
  type BookingsBoardViewProps
} from "@/features/bookings/ui/bookings-board";

export interface BookingsBoardClientProps extends BookingsBoardViewProps {
  mounted: boolean;
}

export function BookingsBoardClient({ mounted, ...boardProps }: BookingsBoardClientProps) {
  if (!mounted) {
    return <div className="min-h-[520px] rounded-2xl border border-slate-200/70 bg-slate-50/70" />;
  }

  return <BookingsBoard {...boardProps} />;
}
