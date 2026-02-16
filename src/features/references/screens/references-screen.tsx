"use client";

import { ReferencesView } from "@/features/references/ui/references-view";
import { useReferencesViewModel } from "@/features/references/view-model/use-references-view-model";

export function ReferencesScreen() {
  const vm = useReferencesViewModel();

  return <ReferencesView title={vm.title} description={vm.description} />;
}
