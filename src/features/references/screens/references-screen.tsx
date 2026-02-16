"use client";

import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import { ReferencesPageClient } from "@/features/references/ui/references-page-client";

export function ReferencesScreen() {
  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="references" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f7f4f3] dark:bg-background-dark/30">
          <div className="references-main-content">
            <ReferencesPageClient />
          </div>
        </main>
      </div>
    </div>
  );
}
