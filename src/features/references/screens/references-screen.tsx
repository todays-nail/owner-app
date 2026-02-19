"use client";

import {OwnerSidebar} from "@/components/shell/owner-sidebar";
import type {DesignReference} from "@/features/references/model/references";
import {ReferencesPageClient} from "@/features/references/ui/references-page-client";

interface ReferencesScreenProps {
  initialReferences: DesignReference[];
}

export function ReferencesScreen({ initialReferences }: ReferencesScreenProps) {
  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="references" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted dark:bg-background-dark/30">
          <div className="references-main-content">
            <ReferencesPageClient initialReferences={initialReferences} />
          </div>
        </main>
      </div>
    </div>
  );
}
