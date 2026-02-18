"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useProtectedUserProfile } from "@/components/auth/protected-user-profile-context";
import { NotificationBellButton } from "@/components/common/notification-bell-button";
import { NotificationPopover } from "@/components/common/notification-popover";
import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import { useAppToast } from "@/components/ui/app-toast-provider";
import { BaseModal } from "@/components/ui/base-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/ui/metric-card";
import {
  type DashboardPaymentStage,
  type DashboardScheduleItem,
  type DashboardSummary,
  type OwnerPaymentLedgerUpsertInput,
} from "@/features/dashboard/model/dashboard-summary";
import { DashboardBookingPipelineSection } from "@/features/dashboard/ui/dashboard-booking-pipeline-section";
import {
  type DashboardBookingCreateFormValues,
  DashboardBookingCreateModal,
} from "@/features/dashboard/ui/dashboard-booking-create-modal";
import { DashboardDesignLibrarySection } from "@/features/dashboard/ui/dashboard-design-library-section";
import { DashboardTodayScheduleAside } from "@/features/dashboard/ui/dashboard-today-schedule-aside";
import { useOwnerNotifications } from "@/features/notifications/view-model/use-owner-notifications";
import type { DesignReference } from "@/features/references/model/references";

export interface DashboardViewProps {
  references: DesignReference[];
  summary: DashboardSummary;
  scheduleItems: DashboardScheduleItem[];
  isLoading: boolean;
  isSubmittingPayment: boolean;
  errorMessage: string | null;
  onRefresh: () => Promise<void>;
  onSubmitPayment: (input: OwnerPaymentLedgerUpsertInput) => Promise<void>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardView({
  references,
  summary,
  scheduleItems,
  isLoading,
  isSubmittingPayment,
  errorMessage,
  onRefresh,
  onSubmitPayment,
}: DashboardViewProps) {
  const router = useRouter();
  const { showToast } = useAppToast();
  const { displayName } = useProtectedUserProfile();

  const notificationVm = useOwnerNotifications(80);

  const greetingName = displayName.endsWith("님")
    ? displayName
    : `${displayName}님`;

  const mainColumnRef = useRef<HTMLDivElement | null>(null);
  const todayScheduleAsideRef = useRef<HTMLElement | null>(null);

  const [scheduleSectionMinHeight, setScheduleSectionMinHeight] = useState<number | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [paymentTargetReservationId, setPaymentTargetReservationId] = useState<string | null>(null);
  const [paymentStage, setPaymentStage] = useState<DashboardPaymentStage>("DEPOSIT");
  const [paymentAmountInput, setPaymentAmountInput] = useState("");
  const [paymentMemoInput, setPaymentMemoInput] = useState("");

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
          : nextMinHeight,
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

  const todayRevenueValue = useMemo(() => formatCurrency(summary.todayRevenue), [summary.todayRevenue]);

  const handleNotificationItemClick = (item: { href?: string }) => {
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
    showToast(`${customerName} 등록 예시가 저장되었습니다.`);
    setIsBookingModalOpen(false);
  };

  const handleOpenPaymentModal = (reservationId: string) => {
    setPaymentTargetReservationId(reservationId);
    setPaymentStage("DEPOSIT");
    setPaymentAmountInput("");
    setPaymentMemoInput("");
  };

  const handleClosePaymentModal = () => {
    setPaymentTargetReservationId(null);
  };

  const handleSubmitPayment = async () => {
    if (!paymentTargetReservationId) {
      return;
    }

    const amount = Number(paymentAmountInput.trim());
    if (!Number.isInteger(amount) || amount < 0) {
      showToast("결제 금액은 0 이상의 정수로 입력해 주세요.");
      return;
    }

    try {
      await onSubmitPayment({
        reservationId: paymentTargetReservationId,
        paymentStage,
        amount,
        memo: paymentMemoInput.trim() || undefined,
        paidAt: new Date().toISOString(),
      });

      showToast("결제 기록이 저장되었습니다.");
      handleClosePaymentModal();
    } catch (error) {
      const message = error instanceof Error && error.message.trim().length > 0
        ? error.message
        : "결제 기록 저장에 실패했습니다.";
      showToast(message);
    }
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
                items={notificationVm.items}
                isOpen={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
                onItemClick={handleNotificationItemClick}
                onMarkRead={(id) => {
                  void notificationVm.markRead(id);
                }}
                onMarkAllRead={() => {
                  void notificationVm.markAllRead();
                }}
                trigger={({ isOpen, controlsId, toggle }) => (
                  <NotificationBellButton
                    variant="dashboard"
                    unreadCount={notificationVm.unreadCount}
                    showUnreadDot={notificationVm.unreadCount > 0}
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

          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {notificationVm.errorMessage ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              알림 동기화에 실패했습니다. {notificationVm.errorMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <div ref={mainColumnRef} className="min-w-0 flex-1">
              <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <MetricCard
                  label="오늘 매출"
                  value={todayRevenueValue}
                  icon="payments"
                  helper={(
                    <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-500">
                      <span className="material-icons text-xs" aria-hidden="true">
                        paid
                      </span>
                      결제원장 기준 집계
                    </p>
                  )}
                  labelClassName="text-xs font-bold uppercase tracking-wider text-slate-500"
                  valueClassName="mt-2 text-3xl font-extrabold tracking-tight"
                  iconWrapperClassName="bg-emerald-100 text-emerald-600"
                />

                <MetricCard
                  label="신규 예약"
                  value={`${summary.newBookingsCount}`}
                  icon="calendar_month"
                  helper={(
                    <p className="mt-2 flex items-center gap-1 text-xs font-bold text-primary">
                      <span className="material-icons text-xs" aria-hidden="true">
                        today
                      </span>
                      오늘 생성된 예약 건수
                    </p>
                  )}
                  labelClassName="text-xs font-bold uppercase tracking-wider text-slate-500"
                  valueClassName="mt-2 text-3xl font-extrabold tracking-tight"
                  iconWrapperClassName="bg-primary/10 text-primary"
                />
              </section>

              <div className="mb-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void onRefresh();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "새로고침 중..." : "대시보드 새로고침"}
                </Button>
              </div>

              <DashboardBookingPipelineSection />

              <DashboardDesignLibrarySection references={references} />
            </div>

            <DashboardTodayScheduleAside
              ref={todayScheduleAsideRef}
              scheduleItems={scheduleItems}
              scheduleDateLabel={summary.dateLabel}
              scheduleSectionMinHeight={scheduleSectionMinHeight}
              onCreateBookingClick={handleOpenBookingModal}
              onRecordPaymentClick={handleOpenPaymentModal}
            />
          </div>
        </main>
      </div>

      <DashboardBookingCreateModal
        open={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onSubmit={handleBookingCreateSubmit}
      />

      <BaseModal
        open={paymentTargetReservationId !== null}
        onClose={handleClosePaymentModal}
        titleId="payment-ledger-modal-title"
        descriptionId="payment-ledger-modal-description"
        rootClassName="z-[70]"
        overlayClassName="bg-black/40"
        contentClassName="max-w-lg rounded-2xl border border-primary/10 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-background-dark sm:p-6"
      >
        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 id="payment-ledger-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                결제 기록 등록
              </h3>
              <p id="payment-ledger-modal-description" className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                예약금 또는 잔금 결제를 기록하면 오늘 매출 지표에 즉시 반영됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClosePaymentModal}
              aria-label="모달 닫기"
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
            >
              <span className="material-icons text-[20px]" aria-hidden="true">
                close
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">결제 구분</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStage("DEPOSIT")}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    paymentStage === "DEPOSIT"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  예약금
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStage("BALANCE")}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    paymentStage === "BALANCE"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  잔금
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="payment-amount-input">
                결제 금액
              </label>
              <Input
                id="payment-amount-input"
                value={paymentAmountInput}
                onChange={(event) => setPaymentAmountInput(event.target.value)}
                placeholder="예: 50000"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="payment-memo-input">
                메모 (선택)
              </label>
              <Input
                id="payment-memo-input"
                value={paymentMemoInput}
                onChange={(event) => setPaymentMemoInput(event.target.value)}
                placeholder="예: 현장 결제 완료"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClosePaymentModal}>
                취소
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void handleSubmitPayment();
                }}
                disabled={isSubmittingPayment}
              >
                {isSubmittingPayment ? "저장 중..." : "결제 기록 저장"}
              </Button>
            </div>
          </div>
        </div>
      </BaseModal>

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
