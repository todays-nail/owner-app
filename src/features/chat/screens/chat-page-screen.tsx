"use client";

import {OwnerSidebar} from "@/components/shell/owner-sidebar";
import {ChatPageClient} from "@/features/chat/ui/chat-page-client";

export function ChatPageScreen() {
  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="chat" />

        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-muted dark:bg-background-dark/30">
          <ChatPageClient />
        </main>
      </div>
    </div>
  );
}
