"use client";

import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import { ReferenceCreatePageClient } from "@/features/references/ui/reference-create-page-client";

export function ReferenceCreateScreen() {
  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="references" />

        <main className="flex-1 overflow-y-auto bg-[#f7f4f3] dark:bg-background-dark/30">
          <ReferenceCreatePageClient />
        </main>
      </div>
    </div>
  );
}
