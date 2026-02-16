"use client";

import { OptionsView } from "@/features/options/ui/options-view";
import { useOptionsViewModel } from "@/features/options/view-model/use-options-view-model";

export function OptionsScreen() {
  const vm = useOptionsViewModel();

  return <OptionsView title={vm.title} description={vm.description} />;
}
