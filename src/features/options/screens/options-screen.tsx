"use client";

import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import { OptionsView } from "@/features/options/ui/options-view";
import { useOptionsViewModel } from "@/features/options/view-model/use-options-view-model";

export function OptionsScreen() {
  const vm = useOptionsViewModel();

  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="options" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f7f4f3] dark:bg-background-dark/30">
          <div className="p-6 sm:p-8">
            <OptionsView title={vm.title} description={vm.description} />
          </div>
        </main>
      </div>
    </div>
  );
}
