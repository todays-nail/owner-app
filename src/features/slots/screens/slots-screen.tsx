"use client";

import { SlotsView } from "@/features/slots/ui/slots-view";
import { useSlotsViewModel } from "@/features/slots/view-model/use-slots-view-model";

export function SlotsScreen() {
  const vm = useSlotsViewModel();

  return <SlotsView title={vm.title} description={vm.description} />;
}
