"use client";

export interface OptionsViewModel {
  title: string;
  description: string;
}

export function useOptionsViewModel(): OptionsViewModel {
  return {
    title: "Options",
    description: "MVP placeholder."
  };
}
