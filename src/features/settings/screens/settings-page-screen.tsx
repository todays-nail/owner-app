"use client";

import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import type { ShopSettingsDto } from "@/features/settings/model/types";
import { SettingsPageClient } from "@/features/settings/ui/settings-page-client";

export function SettingsPageScreen({ initialData }: { initialData: ShopSettingsDto }) {
  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="settings" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f7f4f3] dark:bg-background-dark/30">
          <SettingsPageClient initialData={initialData} />
        </main>
      </div>
    </div>
  );
}
