"use client";

import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";

import {useProtectedUserProfile} from "@/components/auth/protected-user-profile-context";
import {NotificationBellButton} from "@/components/common/notification-bell-button";
import {NotificationPopover} from "@/components/common/notification-popover";
import {OwnerSidebar} from "@/components/shell/owner-sidebar";
import {DashboardBookingPipelineSection} from "@/features/dashboard/ui/dashboard-booking-pipeline-section";
import {
  type DashboardBookingCreateFormValues,
  DashboardBookingCreateModal
} from "@/features/dashboard/ui/dashboard-booking-create-modal";
import {DashboardDesignLibrarySection} from "@/features/dashboard/ui/dashboard-design-library-section";
import {DashboardTodayScheduleAside} from "@/features/dashboard/ui/dashboard-today-schedule-aside";
import type {DashboardDesignItem, DashboardScheduleItem} from "@/features/dashboard/model/dashboard";
import {MOCK_NOTIFICATION_ITEMS} from "@/features/notifications/model/mock-notifications";
import type {NotificationItem} from "@/features/notifications/model/types";

export interface DashboardViewProps {
  designItems: DashboardDesignItem[];
  scheduleItems: DashboardScheduleItem[];
  onUpdateDesignItem: (id: string, patch: Partial<Pick<DashboardDesignItem, "name" | "price" | "image">>) => void;
}

export function DashboardView({ designItems, scheduleItems, onUpdateDesignItem }: DashboardViewProps) {
  const router = useRouter();
  const { displayName } = useProtectedUserProfile();
  const greetingName = displayName.endsWith("님")
    ? displayName
    : `${displayName}님`;
  const mainColumnRef = useRef<HTMLDivElement | null>(null);
  const todayScheduleAsideRef = useRef<HTMLElement | null>(null);
  const [scheduleSectionMinHeight, setScheduleSectionMinHeight] = useState<number | null>(null);
  const [notificationItems, setNotificationItems] = useState<NotificationItem[]>(() =>
    MOCK_NOTIFICATION_ITEMS.map((item) => ({ ...item }))
  );
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const unreadCount = notificationItems.filter((item) => !item.isRead).length;

  useEffect(() => {
    const mainColumnElement = mainColumnRef.current;
    const todayScheduleAsideElement = todayScheduleAsideRef.current;

    if (!mainColumnElement || !todayScheduleAsideElement) {
      return;
    }

    const syncScheduleSectionHeight = () => {
      const nextMinHeight = Math.ceil(mainColumnElement.getBoundingClientRect().height);
      setScheduleSectionMinHeight((prevMinHeight) =>
        prevMinHeight === nextMinHeight
          ? prevMinHeight
          : nextMinHeight
      );
    };

    syncScheduleSectionHeight();

    const resizeObserver = new ResizeObserver(syncScheduleSectionHeight);
    resizeObserver.observe(mainColumnElement);
    window.addEventListener("resize", syncScheduleSectionHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncScheduleSectionHeight);
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

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

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleBookingCreateSubmit = (values: DashboardBookingCreateFormValues) => {
    const customerName =
      values.customerName.trim().length > 0
        ? `${values.customerName} 고객`
        : "새 예약";
    setToastMessage(`${customerName} 등록 예시가 저장되었습니다.`);
    setIsBookingModalOpen(false);
  };

  return (
    <div className="owner-dashboard-root owner-dashboard-fit-root">
      <div className="owner-dashboard-fit">
        <OwnerSidebar activeItem="dashboard" />

        <main className="flex-1 bg-nude-soft p-4 sm:p-6 lg:p-7 dark:bg-background-dark/30">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-light tracking-tight dark:text-white sm:text-3xl">
                <span className="font-[350]">안녕하세요,</span>{" "}
                <span className="font-bold text-primary">{greetingName}</span>
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                오늘 샵의 현황을 확인해보세요.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationPopover
                items={notificationItems}
                isOpen={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
                onItemClick={handleNotificationItemClick}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                trigger={({ isOpen, controlsId, toggle }) => (
                  <NotificationBellButton
                    variant="dashboard"
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
                onClick={handleOpenBookingModal}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
              >
                <span className="material-icons text-sm" aria-hidden="true">
                  add
                </span>
                새 예약 등록
              </button>
            </div>
          </header>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <div ref={mainColumnRef} className="min-w-0 flex-1">
              <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        오늘 매출
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        ₩1,240,000
                      </h3>
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-500">
                        <span className="material-icons text-xs" aria-hidden="true">
                          trending_up
                        </span>
                        어제 대비 +12.4%
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <span className="material-icons text-[22px]" aria-hidden="true">
                        payments
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        신규 예약
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">28</h3>
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-primary">
                        <span className="material-icons text-xs" aria-hidden="true">
                          priority_high
                        </span>
                        5건의 긴급 요청
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-icons text-[22px]" aria-hidden="true">
                        calendar_month
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <DashboardBookingPipelineSection />

              <DashboardDesignLibrarySection
                designItems={designItems}
                onUpdateDesignItem={onUpdateDesignItem}
              />
            </div>

            <DashboardTodayScheduleAside
              ref={todayScheduleAsideRef}
              scheduleItems={scheduleItems}
              scheduleSectionMinHeight={scheduleSectionMinHeight}
              onCreateBookingClick={handleOpenBookingModal}
            />
          </div>
        </main>
      </div>

      <DashboardBookingCreateModal
        open={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onSubmit={handleBookingCreateSubmit}
      />

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-[70] inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:bg-gray-100 dark:text-gray-900 sm:right-6 sm:top-6"
        >
          <span className="material-icons text-base" aria-hidden="true">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          aria-label="채팅 열기"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110"
        >
          <span className="material-icons" aria-hidden="true">
            chat
          </span>
        </button>
      </div>
    </div>
  );
}
