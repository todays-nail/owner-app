"use client";

import {DashboardView} from "@/features/dashboard/ui/dashboard-view";
import {useDashboardViewModel} from "@/features/dashboard/view-model/use-dashboard-view-model";

export function DashboardScreen() {
  const vm = useDashboardViewModel();

  return (
    <DashboardView
      designItems={vm.designItems}
      scheduleItems={vm.scheduleItems}
      onUpdateDesignItem={vm.updateDesignItem}
    />
  );
}
