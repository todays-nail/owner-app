"use client";

export interface SlotsViewModel {
  title: string;
  description: string;
}

export function useSlotsViewModel(): SlotsViewModel {
  return {
    title: "Slots",
    description: "MVP placeholder."
  };
}
