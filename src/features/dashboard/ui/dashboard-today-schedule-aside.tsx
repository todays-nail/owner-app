import { forwardRef } from "react";

import type { DashboardScheduleItem } from "@/features/dashboard/model/dashboard-summary";
import { cn } from "@/lib/utils";

interface DashboardTodayScheduleAsideProps {
  scheduleItems: DashboardScheduleItem[];
  scheduleDateLabel: string;
  scheduleSectionMinHeight: number | null;
  onCreateBookingClick: () => void;
  onRecordPaymentClick: (reservationId: string) => void;
}

function statusText(status: string): string {
  switch (status) {
    case "PENDING_DEPOSIT":
      return "예약금 대기";
    case "DEPOSIT_PAID":
      return "예약금 완료";
    case "CONFIRMED":
      return "예약 확정";
    case "SERVICE_CONFIRMED":
      return "시술 완료";
    case "BALANCE_PAID":
      return "잔금 완료";
    case "COMPLETED":
      return "완료";
    default:
      return status;
  }
}

export const DashboardTodayScheduleAside = forwardRef<HTMLElement, DashboardTodayScheduleAsideProps>(
  function DashboardTodayScheduleAside(
    { scheduleItems, scheduleDateLabel, scheduleSectionMinHeight, onCreateBookingClick, onRecordPaymentClick },
    ref,
  ) {
    return (
      <aside
        ref={ref}
        className="flex w-full flex-col rounded-xl border border-primary/5 bg-white shadow-sm dark:bg-background-dark xl:sticky xl:top-6 xl:w-[26rem]"
        style={
          scheduleSectionMinHeight
            ? { minHeight: `${scheduleSectionMinHeight}px` }
            : undefined
        }
      >
        <div className="flex items-center justify-between border-b border-primary/5 p-6">
          <h3 className="flex items-center gap-2 font-bold">
            <span className="material-icons text-lg text-primary" aria-hidden="true">
              event_note
            </span>
            오늘 일정
          </h3>
          <span className="rounded bg-slate-100 px-2.5 py-1.5 text-xs font-semibold uppercase dark:bg-white/5">
            {scheduleDateLabel || "-"}
          </span>
        </div>

        <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto p-6">
          {scheduleItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-white/10">
              오늘 등록된 일정이 없습니다.
            </div>
          ) : (
            scheduleItems.map((item) => (
              <div key={item.reservationId} className="mb-4 rounded-xl border border-primary/10 p-4 last:mb-0">
                <p className="text-[11px] font-bold text-primary">{item.timeRange}</p>
                <h4 className="mt-1 text-sm font-bold">{item.customerName}</h4>
                <p className="mt-0.5 text-xs text-slate-500">{item.serviceName}</p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      item.reservationStatus === "BALANCE_PAID" || item.reservationStatus === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {statusText(item.reservationStatus)}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRecordPaymentClick(item.reservationId)}
                    className="rounded-md border border-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    결제 기록
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-primary/5 p-6">
          <button
            type="button"
            onClick={onCreateBookingClick}
            className="w-full rounded-lg bg-primary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
          >
            새 예약 등록
          </button>
        </div>
      </aside>
    );
  },
);
