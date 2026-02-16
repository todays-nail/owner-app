"use client";

export interface ReferencesViewModel {
  title: string;
  description: string;
}

export function useReferencesViewModel(): ReferencesViewModel {
  return {
    title: "References",
    description: "MVP placeholder."
  };
}
