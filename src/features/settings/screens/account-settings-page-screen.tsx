"use client";

import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import type { AccountSettingsDto } from "@/features/settings/model/types";
import { AccountSettingsPageClient } from "@/features/settings/ui/account-settings-page-client";

export function AccountSettingsPageScreen({
  initialData
}: {
  initialData: AccountSettingsDto;
}) {
  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="settings" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted dark:bg-background-dark/30">
          <AccountSettingsPageClient initialData={initialData} />
        </main>
      </div>
    </div>
  );
}
