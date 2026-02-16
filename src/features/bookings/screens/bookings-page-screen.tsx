"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

import {NotificationBellButton} from "@/components/common/notification-bell-button";
import {NotificationPopover} from "@/components/common/notification-popover";
import {OwnerSidebar} from "@/components/shell/owner-sidebar";
import {Chip} from "@/components/ui/chip";
import {MOCK_NOTIFICATION_ITEMS} from "@/features/notifications/model/mock-notifications";
import type {NotificationItem} from "@/features/notifications/model/types";
import {BookingsBoardClient} from "@/features/bookings/ui/bookings-board-client";
import {BookingsRevenueCards} from "@/features/bookings/ui/bookings-revenue-cards";
import {useBookingsPageViewModel} from "@/features/bookings/view-model/use-bookings-page-view-model";

export function BookingsPageScreen() {
  const router = useRouter();
  const vm = useBookingsPageViewModel();
  const [notificationItems, setNotificationItems] = useState<NotificationItem[]>(() =>
    MOCK_NOTIFICATION_ITEMS.map((item) => ({ ...item }))
  );
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = notificationItems.filter((item) => !item.isRead).length;

  const handleMarkRead = (id: string) => {
    setNotificationItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const handleMarkAllRead = (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    const targetIds = new Set(ids);

    setNotificationItems((prevItems) =>
      prevItems.map((item) =>
        targetIds.has(item.id)
          ? { ...item, isRead: true }
          : item
      )
    );
  };

  const handleNotificationItemClick = (item: NotificationItem) => {
    if (!item.href) {
      return;
    }

    router.push(item.href);
  };

  return (
    <div className="owner-dashboard-root min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <OwnerSidebar activeItem="bookings" />

        <main className="flex h-screen flex-1 flex-col overflow-hidden bg-[#f7f4f3] dark:bg-background-dark/30">
          <header className="z-10 flex-shrink-0 border-b border-primary/10 bg-[#fbf8f7]/90 px-6 pb-5 pt-6 backdrop-blur-sm dark:bg-background-dark/50 lg:pb-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  예약 관리
                </h2>
                <Chip
                  variant="open-status"
                  size="sm"
                  leadingDotClassName="bg-emerald-500"
                  leadingDotPulse
                >
                  영업 중
                </Chip>
              </div>

              <div className="flex items-center gap-3">
                <NotificationPopover
                  items={notificationItems}
                  isOpen={isNotificationOpen}
                  onOpenChange={setIsNotificationOpen}
                  onItemClick={handleNotificationItemClick}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                  trigger={({ isOpen, controlsId, toggle }) => (
                    <NotificationBellButton
                      variant="bookings"
                      unreadCount={unreadCount}
                      showUnreadDot={unreadCount > 0}
                      ariaExpanded={isOpen}
                      ariaControls={controlsId}
                      onClick={toggle}
                    />
                  )}
                />
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  <span className="material-icons text-sm" aria-hidden="true">
                    add
                  </span>
                  새 예약 등록
                </button>
              </div>
            </div>

            <BookingsRevenueCards items={vm.revenueCards} />
          </header>

          <div className="kanban-scrollbar flex-1 overflow-x-auto overflow-y-hidden px-4 py-5 lg:px-6 lg:py-6">
            <BookingsBoardClient
              mounted={vm.mounted}
              columns={vm.columns}
              board={vm.board}
            />
          </div>
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          aria-label="채팅 열기"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110"
        >
          <span className="material-icons text-xl" aria-hidden="true">
            chat
          </span>
        </button>
      </div>
    </div>
  );
}
