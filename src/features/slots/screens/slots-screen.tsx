"use client";

import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import { SlotsView } from "@/features/slots/ui/slots-view";
import { useSlotsViewModel } from "@/features/slots/view-model/use-slots-view-model";

export function SlotsScreen() {
  const vm = useSlotsViewModel();

  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="slots" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f7f4f3] dark:bg-background-dark/30">
          <div className="p-6 sm:p-8">
            <SlotsView title={vm.title} description={vm.description} />
          </div>
        </main>
      </div>
    </div>
  );
}
