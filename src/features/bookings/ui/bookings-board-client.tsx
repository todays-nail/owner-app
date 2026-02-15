"use client";

import { useEffect, useState } from "react";

import { BookingsBoard } from "@/features/bookings/ui/bookings-board";

export function BookingsBoardClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[520px] rounded-2xl border border-slate-200/70 bg-slate-50/70" />;
  }

  return <BookingsBoard />;
}
