"use client";

import {DashboardView} from "@/features/dashboard/ui/dashboard-view";
import {useDashboardViewModel} from "@/features/dashboard/view-model/use-dashboard-view-model";
import type {DesignReference} from "@/features/references/model/references";

interface DashboardScreenProps {
  initialReferences: DesignReference[];
}

export function DashboardScreen({ initialReferences }: DashboardScreenProps) {
  const vm = useDashboardViewModel();

  return (
    <DashboardView
      references={initialReferences}
      summary={vm.summary}
      scheduleItems={vm.scheduleItems}
      isLoading={vm.isLoading}
      isSubmittingPayment={vm.isSubmittingPayment}
      errorMessage={vm.errorMessage}
      onRefresh={vm.refresh}
      onSubmitPayment={vm.submitPayment}
    />
  );
}
