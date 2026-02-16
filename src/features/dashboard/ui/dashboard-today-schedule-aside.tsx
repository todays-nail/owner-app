import {forwardRef} from "react";

import type {DashboardScheduleItem} from "@/features/dashboard/model/dashboard";
import {cn} from "@/lib/utils";

interface DashboardTodayScheduleAsideProps {
  scheduleItems: DashboardScheduleItem[];
  scheduleSectionMinHeight: number | null;
  onCreateBookingClick: () => void;
}

export const DashboardTodayScheduleAside = forwardRef<HTMLElement, DashboardTodayScheduleAsideProps>(
  function DashboardTodayScheduleAside(
    {scheduleItems, scheduleSectionMinHeight, onCreateBookingClick},
    ref
  ) {
    return (
      <aside
        ref={ref}
        className="flex w-full flex-col rounded-xl border border-primary/5 bg-white shadow-sm dark:bg-background-dark xl:sticky xl:top-6 xl:w-[26rem]"
        style={
          scheduleSectionMinHeight
            ? {minHeight: `${scheduleSectionMinHeight}px`}
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
          <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase dark:bg-white/5">
            5월 12일
          </span>
        </div>
        <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto p-6">
          {scheduleItems.map((item) => (
            <div
              key={`${item.time}${item.customer}`}
              className={cn(
                "relative border-l-2 border-primary/10 pb-4 pl-8 pt-0.5 last:pb-0",
                item.variant === "faded" && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white dark:border-background-dark",
                  item.variant === "current" && "bg-primary",
                  item.variant === "faded" && "bg-slate-200 dark:bg-slate-700",
                  item.variant === "active" && "bg-primary/40",
                  item.variant === "upcoming" && "bg-primary/20"
                )}
              />
              <p
                className={cn(
                  "text-[10px] font-bold",
                  item.variant === "faded" && "text-slate-500",
                  item.variant === "current" && "text-primary uppercase",
                  item.variant === "active" && "text-primary",
                  item.variant === "upcoming" && "text-slate-400"
                )}
              >
                {item.time}
              </p>
              <h4 className="mt-0.5 text-sm font-bold">{item.customer}</h4>
              <p className="text-xs text-slate-500">{item.service}</p>
              {item.tag ? (
                <div className="mt-1.5 flex gap-1">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {item.tag}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
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
  }
);
